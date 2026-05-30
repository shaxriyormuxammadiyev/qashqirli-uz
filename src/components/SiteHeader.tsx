import { Link } from "@tanstack/react-router";

const nav = [
  { to: "/", label: "Bosh sahifa" },
  { to: "/maqolalar", label: "Oxirgi maqolalar" },
  { to: "/ruknlar", label: "Ruknlar" },
  { to: "/arxiv", label: "Arxiv" },
  { to: "/audio", label: "Audio maqolalar" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 shadow-md">
      <div className="bg-brand text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            {/* Eskisini o'rniga rasm tegi joylashtirildi */}
            <img 
              src="/logo.png" 
              alt="Qashqirli Logo" 
              className="h-10 w-auto object-contain"
            />
            <span className="font-serif text-2xl tracking-tight">QASHQIRLI.uz</span>
          </Link>
          <div className="text-right hidden sm:block">
            <div className="font-serif text-xl leading-tight">Qozoqboy Yo'ldosh</div>
            <div className="text-xs text-brand-foreground/70">
              Professor Qozoqboy Yo'ldosh olami bilan tanishamiz
            </div>
          </div>
        </div>
        <nav className="border-t border-brand-foreground/15">
          <div className="mx-auto max-w-7xl grid grid-cols-2 sm:grid-cols-5 text-sm">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="px-4 py-3 text-center text-brand-foreground/80 hover:bg-brand-bright/10 hover:text-brand-foreground transition border-r border-brand-foreground/10 last:border-r-0 data-[status=active]:bg-brand-bright/15 data-[status=active]:text-brand-bright data-[status=active]:font-medium"
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}