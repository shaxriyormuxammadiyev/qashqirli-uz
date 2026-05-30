import { useState } from "react";
import { actions } from "@/lib/store";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      toast.error("Email manzili noto'g'ri");
      return;
    }
    setLoading(true);
    try {
      await actions.subscribe(v);
      toast.success("Obuna bo'lganingiz uchun rahmat!");
      setEmail("");
    } catch (err: any) {
      if (err?.code === "23505") toast.error("Bu email allaqachon obuna bo'lgan");
      else toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <div className="flex items-center gap-2 mb-2 text-brand-bright">
        <Mail className="size-4" />
        <span className="text-sm font-medium">Yangiliklarga obuna bo'ling</span>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          required
          className="flex-1 bg-brand-foreground/10 border border-brand-foreground/20 rounded px-3 py-2 text-sm text-brand-foreground placeholder:text-brand-foreground/50 focus:outline-none focus:border-brand-bright"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-bright text-brand-bright-foreground rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "..." : "Obuna bo'lish"}
        </button>
      </div>
    </form>
  );
}
