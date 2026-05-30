import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useStore } from "@/lib/store";
import { Home } from "lucide-react";

export const Route = createFileRoute("/audio/$id")({
  component: Page,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <Link to="/" className="text-brand underline">Bosh sahifa</Link>
    </div>
  ),
});

function Page() {
  const { id } = Route.useParams();
  const audio = useStore((s) => s.audios.find((a) => a.id === id));
  const loaded = useStore((s) => s.loaded);
  if (!audio) {
    if (!loaded) return <div className="min-h-screen grid place-items-center text-muted-foreground">Yuklanmoqda...</div>;
    throw notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl px-4 sm:px-6 py-8 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-brand">
            <Home className="size-4" /> Bosh sahifa
          </Link>
          <span>/</span>
          <Link to="/audio" className="hover:text-brand">Audio</Link>
          <span>/</span>
          <span className="text-foreground truncate">{audio.title}</span>
        </nav>

        <div className="flex flex-wrap gap-2 mb-3 text-xs text-tag font-medium">
          {audio.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
        <h1 className="text-4xl font-semibold mb-2">{audio.title}</h1>
        <div className="text-sm text-muted-foreground mb-6">{audio.created_at.slice(0, 10)} · {audio.duration}</div>

        {audio.audio_url && (
          <div className="bg-brand-bright text-brand-bright-foreground rounded-lg p-6 mb-6">
            <AudioPlayer src={audio.audio_url} variant="dark" />
          </div>
        )}

        <p className="text-lg leading-relaxed text-foreground/90">{audio.description}</p>
      </main>
      <SiteFooter />
    </div>
  );
}

