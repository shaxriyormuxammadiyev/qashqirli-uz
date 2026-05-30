import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useStore } from "@/lib/store";
import { Home, Tag } from "lucide-react";

export const Route = createFileRoute("/ruknlar")({
  head: () => ({
    meta: [
      { title: "Ruknlar — QASHQIRLI.uz" },
      { name: "description", content: "Maqolalar bo'yicha ruknlar va teglar ro'yxati." },
    ],
  }),
  component: Page,
});

function Page() {
  const articles = useStore((s) => s.articles);
  const audios = useStore((s) => s.audios);
  const tagCount = new Map<string, number>();
  [...articles, ...audios].forEach((x) =>
    x.tags.forEach((t) => tagCount.set(t, (tagCount.get(t) ?? 0) + 1)),
  );
  const tags = [...tagCount.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-8 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-brand">
            <Home className="size-4" /> Bosh sahifa
          </Link>
          <span>/</span>
          <span className="text-foreground">Ruknlar</span>
        </nav>
        <h1 className="text-3xl font-semibold mb-6">Ruknlar</h1>
        <div className="flex flex-wrap gap-3">
          {tags.map(([tag, count]) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-full text-sm shadow-sm"
            >
              <Tag className="size-3.5 text-brand-bright" />
              <span className="text-tag font-medium">{tag}</span>
              <span className="text-muted-foreground">{count}</span>
            </span>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
