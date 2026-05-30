import { Link } from "@tanstack/react-router";
import type { AudioArticle } from "@/lib/store";
import { AudioLines } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";

export function AudioCard({ audio }: { audio: AudioArticle }) {
  return (
    <div className="bg-brand-bright text-brand-bright-foreground rounded-lg p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <AudioLines className="size-7 opacity-80 shrink-0 mt-1" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2 text-xs text-tag font-medium">
            {audio.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <Link
            to="/audio/$id"
            params={{ id: audio.id }}
            className="block mt-1 font-serif text-xl font-semibold hover:underline"
          >
            {audio.title}
          </Link>
          <p className="mt-1 text-sm/relaxed text-brand-bright-foreground/85 line-clamp-2">
            {audio.description}
          </p>
        </div>
      </div>
      {audio.audio_url && <AudioPlayer src={audio.audio_url} variant="dark" />}
    </div>
  );
}
