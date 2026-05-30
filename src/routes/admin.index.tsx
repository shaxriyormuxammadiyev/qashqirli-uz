import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { useStore } from "@/lib/store";
import { FileText, Headphones, Users, Tag } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Page,
});

function Page() {
  const articles = useStore((s) => s.articles);
  const audios = useStore((s) => s.audios);
  const subscribers = useStore((s) => s.subscribers);
  const tags = new Set([...articles, ...audios].flatMap((x) => x.tags));

  return (
    <AdminShell title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={<FileText className="size-5" />} label="Maqolalar" value={articles.length} to="/admin/maqolalar" />
        <Stat icon={<Headphones className="size-5" />} label="Audio" value={audios.length} to="/admin/audio" />
        <Stat icon={<Users className="size-5" />} label="Obunachilar" value={subscribers.length} to="/admin/subscribers" />
        <Stat icon={<Tag className="size-5" />} label="Teglar" value={tags.size} />
      </div>
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="font-serif text-xl mb-2">Xush kelibsiz</h2>
        <p className="text-muted-foreground text-sm">
          Chap menyudan maqolalar, audio yozuvlar yoki obunachilarni boshqaring.
          Barcha o'zgarishlar darhol jonli saytda aks etadi.
        </p>
      </div>
    </AdminShell>
  );
}

function Stat({ icon, label, value, to }: { icon: React.ReactNode; label: string; value: number; to?: string }) {
  const inner = (
    <div className="bg-card rounded-lg p-5 border border-border hover:border-brand-bright transition">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">{icon}{label}</div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}
