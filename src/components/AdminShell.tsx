import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useStore, actions } from "@/lib/store";
import {
  LayoutDashboard,
  FileText,
  Headphones,
  LogOut,
  ExternalLink,
  Lock,
  Users,
  Loader2,
} from "lucide-react";

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const isAdmin = useStore((s) => s.isAdmin);
  const authLoaded = useStore((s) => s.authLoaded);

  // Auth yuklanishini kutamiz
  if (!authLoaded) {
    return (
      <div className="min-h-screen grid place-items-center bg-brand">
        <Loader2 className="size-8 text-brand-foreground animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return <LoginScreen />;

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 bg-brand text-brand-foreground shrink-0 hidden md:flex flex-col">
        <div className="px-5 py-5 border-b border-brand-foreground/15">
          <div className="font-serif text-xl">Admin Panel</div>
          <div className="text-xs text-brand-foreground/60">QASHQIRLI.uz</div>
        </div>
        <nav className="flex-1 p-3 space-y-1 text-sm">
          <NavItem to="/admin" icon={<LayoutDashboard className="size-4" />} label="Dashboard" exact />
          <NavItem to="/admin/maqolalar" icon={<FileText className="size-4" />} label="Maqolalar" />
          <NavItem to="/admin/audio" icon={<Headphones className="size-4" />} label="Audio" />
          <NavItem to="/admin/subscribers" icon={<Users className="size-4" />} label="Obunachilar" />
        </nav>
        <div className="p-3 border-t border-brand-foreground/15 space-y-1 text-sm">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-brand-bright/15 text-brand-foreground/80"
          >
            <ExternalLink className="size-4" /> Saytni ko'rish
          </Link>
          <button
            onClick={() => actions.logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-brand-bright/15 text-brand-foreground/80"
          >
            <LogOut className="size-4" /> Chiqish
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <Link to="/" className="text-sm text-brand hover:underline inline-flex items-center gap-1 md:hidden">
            <ExternalLink className="size-4" /> Sayt
          </Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  to,
  icon,
  label,
  exact,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      className="flex items-center gap-2 px-3 py-2 rounded text-brand-foreground/80 hover:bg-brand-bright/15 data-[status=active]:bg-brand-bright/20 data-[status=active]:text-brand-bright"
    >
      {icon} {label}
    </Link>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const { error } = await actions.login(email, password);
    setLoading(false);
    if (error) {
      setErr("Email yoki parol noto'g'ri");
    } else {
      navigate({ to: "/admin" });
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-brand p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-xl shadow-2xl p-8 w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="size-10 rounded-full bg-brand-bright/20 grid place-items-center">
            <Lock className="size-5 text-brand" />
          </div>
          <div>
            <div className="font-serif text-xl">Admin kirish</div>
            <div className="text-xs text-muted-foreground">QASHQIRLI.uz</div>
          </div>
        </div>

        <label className="text-sm block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          required
          className="w-full border border-input rounded px-3 py-2 mb-3 bg-background"
        />

        <label className="text-sm block mb-1">Parol</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full border border-input rounded px-3 py-2 mb-4 bg-background"
        />

        <p className="text-xs text-muted-foreground mb-4">
          Supabase Dashboard → Authentication → Users bo'limida admin foydalanuvchi yarating.
        </p>

        {err && <p className="text-sm text-destructive mb-3">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand text-brand-foreground rounded py-2 font-medium hover:bg-brand/90 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? "Kirilmoqda..." : "Kirish"}
        </button>

        <Link to="/" className="block text-center text-sm text-muted-foreground mt-4 hover:text-brand">
          ← Saytga qaytish
        </Link>
      </form>
    </div>
  );
}
