import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useStore } from "@/lib/store";
import { Home, ImageIcon } from "lucide-react";

export const Route = createFileRoute("/maqola/$id")({
  component: Page,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">Maqola topilmadi.</p>
        <Link to="/" className="text-brand underline">Bosh sahifa</Link>
      </div>
    </div>
  ),
});

function Page() {
  const { id } = Route.useParams();
  const article = useStore((s) => s.articles.find((a) => a.id === id));
  if (!article) throw notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl px-4 sm:px-6 py-8 w-full">
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-brand">
            <Home className="size-4" /> Bosh sahifa
          </Link>
          <span>/</span>
          <Link to="/maqolalar" className="hover:text-brand">Maqolalar</Link>
          <span>/</span>
          <span className="text-foreground truncate">{article.title}</span>
        </nav>

        <div className="flex flex-wrap gap-2 mb-3 text-xs text-tag font-medium">
          {article.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
        <h1 className="text-4xl font-semibold mb-2">{article.title}</h1>
        <div className="text-sm text-muted-foreground mb-6">{article.created_at.slice(0, 10)}</div>

        <div className="aspect-[16/9] bg-muted rounded-lg grid place-items-center text-muted-foreground mb-8 overflow-hidden">
          {article.cover_image_url ? (
            <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-60">
              <ImageIcon className="size-10" />
              <span className="font-serif text-xl">Asosiy rasm</span>
            </div>
          )}
        </div>

        <article className="prose prose-neutral max-w-none whitespace-pre-line text-foreground/90 leading-relaxed text-lg">
          {article.content}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
