import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard } from "@/components/ArticleCard";
import { useStore } from "@/lib/store";
import { Home } from "lucide-react";

export const Route = createFileRoute("/maqolalar")({
  head: () => ({
    meta: [
      { title: "Oxirgi maqolalar — QASHQIRLI.uz" },
      { name: "description", content: "Professor Qozoqboy Yo'ldoshning eng so'nggi maqolalari." },
    ],
  }),
  component: Page,
});

function Page() {
  const articles = useStore((s) => s.articles);
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-8 w-full">
        <Breadcrumb label="Oxirgi maqolalar" />
        <h1 className="text-3xl font-semibold mb-6">Oxirgi maqolalar</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Breadcrumb({ label }: { label: string }) {
  return (
    <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
      <Link to="/" className="inline-flex items-center gap-1 hover:text-brand">
        <Home className="size-4" /> Bosh sahifa
      </Link>
      <span>/</span>
      <span className="text-foreground">{label}</span>
    </nav>
  );
}
