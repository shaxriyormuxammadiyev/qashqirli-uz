import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useStore } from "@/lib/store";
import { Home, Calendar } from "lucide-react";

export const Route = createFileRoute("/arxiv")({
  head: () => ({
    meta: [
      { title: "Arxiv — QASHQIRLI.uz" },
      { name: "description", content: "Maqolalar va audio yozuvlar arxivi." },
    ],
  }),
  component: Page,
});

function Page() {
  const articles = useStore((s) => s.articles);
  const audios = useStore((s) => s.audios);
  const items = [
    ...articles.map((a) => ({ id: a.id, title: a.title, excerpt: a.excerpt, created_at: a.created_at, kind: "Maqola" as const, to: `/maqola/${a.id}` })),
    ...audios.map((a) => ({ id: a.id, title: a.title, excerpt: a.description, created_at: a.created_at, kind: "Audio" as const, to: `/audio/${a.id}` })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-8 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-brand">
            <Home className="size-4" /> Bosh sahifa
          </Link>
          <span>/</span>
          <span className="text-foreground">Arxiv</span>
        </nav>
        <h1 className="text-3xl font-semibold mb-6">Arxiv</h1>
        <ul className="divide-y divide-border bg-card rounded-lg shadow-sm">
          {items.map((it) => (
            <li key={it.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-muted/40 transition">
              <div className="text-xs text-muted-foreground flex items-center gap-1 w-28 shrink-0 pt-1">
                <Calendar className="size-3.5" />
                {it.created_at.slice(0, 10)}
              </div>
              <div className="flex-1 min-w-0">
                <a href={it.to} className="font-serif text-lg font-medium hover:text-brand">
                  {it.title}
                </a>
                <p className="text-sm text-muted-foreground line-clamp-2">{it.excerpt}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-brand/10 text-brand shrink-0">
                {it.kind}
              </span>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
