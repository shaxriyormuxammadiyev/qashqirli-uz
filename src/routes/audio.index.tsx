import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AudioCard } from "@/components/AudioCard";
import { useStore } from "@/lib/store";
import { Home } from "lucide-react";

export const Route = createFileRoute("/audio/")({
  head: () => ({
    meta: [
      { title: "Audio maqolalar — QASHQIRLI.uz" },
      { name: "description", content: "Professor Qozoqboy Yo'ldoshning audio maqolalari va suhbatlari." },
    ],
  }),
  component: Page,
});

function Page() {
  const audios = useStore((s) => s.audios);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-5xl px-4 sm:px-6 py-8 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-brand">
            <Home className="size-4" /> Bosh sahifa
          </Link>
          <span>/</span>
          <span className="text-foreground">Audio maqolalar</span>
        </nav>
        <h1 className="text-3xl font-semibold mb-6">Audio maqolalar</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          {audios.map((a) => <AudioCard key={a.id} audio={a} />)}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
