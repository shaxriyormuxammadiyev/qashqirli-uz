import { useEffect, useState, useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  cover_image_url: string | null;
  featured: boolean;
  created_at: string;
};

export type AudioArticle = {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  cover_image_url: string | null;
  tags: string[];
  duration: string;
  created_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  status: string;
  subscribed_at: string;
};

type State = {
  articles: Article[];
  audios: AudioArticle[];
  subscribers: Subscriber[];
  session: Session | null;
  isAdmin: boolean;
  loaded: boolean;
  authLoaded: boolean;
};

let state: State = {
  articles: [],
  audios: [],
  subscribers: [],
  session: null,
  isAdmin: false,
  loaded: false,
  authLoaded: false,
};

const listeners = new Set<() => void>();

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state)
  );
}

// Auth — Supabase session ni kuzatib boradi
function initAuth() {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setState({
      session,
      isAdmin: !!session,
      authLoaded: true,
    });
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    setState({
      session,
      isAdmin: !!session,
      authLoaded: true,
    });
    // Admin kirganda subscribers ham yuklanadi
    if (session) {
      loadAll(true);
    }
  });
}

// Birinchi marta chaqiriladi
if (typeof window !== "undefined") {
  initAuth();
}

// Ma'lumotlarni yuklash
let loadingPromise: Promise<void> | null = null;

async function loadAll(force = false) {
  if (loadingPromise && !force) return loadingPromise;
  loadingPromise = (async () => {
    const isLoggedIn = !!state.session;

    const [a, au, su] = await Promise.all([
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
      supabase.from("audio_articles").select("*").order("created_at", { ascending: false }),
      isLoggedIn
        ? supabase.from("subscribers").select("*").order("subscribed_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
    ]);

    setState({
      articles: (a.data ?? []) as Article[],
      audios: (au.data ?? []) as AudioArticle[],
      subscribers: isLoggedIn ? ((su.data ?? []) as Subscriber[]) : [],
      loaded: true,
    });
  })();
  return loadingPromise;
}

export function useLoadData() {
  const [, setTick] = useState(0);
  useEffect(() => {
    loadAll().then(() => setTick((t) => t + 1));
  }, []);
}

export const actions = {
  // Email/parol bilan kirish — Supabase Auth
  async login(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  },

  async logout() {
    await supabase.auth.signOut();
    setState({ session: null, isAdmin: false, subscribers: [] });
  },

  async refresh() {
    loadingPromise = null;
    await loadAll(true);
  },

  async upsertArticle(a: Partial<Article> & { id?: string }) {
    if (a.id) {
      const { id, ...rest } = a;
      const { error } = await supabase.from("articles").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("articles").insert(a as any);
      if (error) throw new Error(error.message);
    }
    await actions.refresh();
  },

  async deleteArticle(id: string) {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await actions.refresh();
  },

  async upsertAudio(a: Partial<AudioArticle> & { id?: string }) {
    if (a.id) {
      const { id, ...rest } = a;
      const { error } = await supabase.from("audio_articles").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("audio_articles").insert(a as any);
      if (error) throw new Error(error.message);
    }
    await actions.refresh();
  },

  async deleteAudio(id: string) {
    const { error } = await supabase.from("audio_articles").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await actions.refresh();
  },

  async subscribe(email: string) {
    const { error } = await supabase.from("subscribers").insert({ email });
    if (error) throw error;
    await actions.refresh();
  },

  async deleteSubscriber(id: string) {
    const { error } = await supabase.from("subscribers").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await actions.refresh();
  },

  async uploadFile(bucket: "audio" | "covers", file: File): Promise<string> {
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },
};
