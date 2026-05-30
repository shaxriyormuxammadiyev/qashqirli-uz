import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { useStore, actions, type Article } from "@/lib/store";
import { Plus, Pencil, Trash2, X, Star, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/maqolalar")({
  component: Page,
});

function emptyArticle(): Partial<Article> {
  return {
    title: "",
    excerpt: "",
    content: "",
    tags: [],
    cover_image_url: null,
    featured: false,
  };
}

function Page() {
  const articles = useStore((s) => s.articles);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);

  return (
    <AdminShell title="Maqolalar">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditing(emptyArticle())}
          className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-4 py-2 rounded hover:bg-brand/90"
        >
          <Plus className="size-4" /> Yangi maqola
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3">Sarlavha</th>
              <th className="px-4 py-3 hidden sm:table-cell">Teglar</th>
              <th className="px-4 py-3 hidden md:table-cell">Sana</th>
              <th className="px-4 py-3 w-32 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium flex items-center gap-2">
                  {a.featured && <Star className="size-3.5 text-brand-bright fill-current" />}
                  {a.title}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-tag">{a.tags.join(" ")}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{a.created_at.slice(0, 10)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(a)} className="p-2 hover:text-brand">
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm("O'chirilsinmi?")) {
                        await actions.deleteArticle(a.id);
                        toast.success("O'chirildi");
                      }
                    }}
                    className="p-2 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Editor
          article={editing}
          onClose={() => setEditing(null)}
          onSave={async (a) => {
            await actions.upsertArticle(a);
            toast.success("Saqlandi");
            setEditing(null);
          }}
        />
      )}
    </AdminShell>
  );
}

function Editor({ article, onClose, onSave }: { article: Partial<Article>; onClose: () => void; onSave: (a: Partial<Article>) => void }) {
  const [form, setForm] = useState(article);
  const [tagsStr, setTagsStr] = useState((article.tags ?? []).join(" "));
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await actions.uploadFile("covers", file);
      setForm((f) => ({ ...f, cover_image_url: url }));
      toast.success("Rasm yuklandi");
    } catch (err: any) {
      toast.error("Yuklashda xatolik: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-serif text-lg">{article.id ? "Tahrirlash" : "Yangi maqola"}</h3>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...form, tags: tagsStr.split(/\s+/).filter(Boolean) });
          }}
          className="p-4 space-y-4"
        >
          <Field label="Sarlavha">
            <input required value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-input rounded px-3 py-2 bg-background" />
          </Field>
          <Field label="Qisqacha">
            <textarea required value={form.excerpt ?? ""} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2} className="w-full border border-input rounded px-3 py-2 bg-background" />
          </Field>
          <Field label="Matn">
            <textarea required value={form.content ?? ""} onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6} className="w-full border border-input rounded px-3 py-2 bg-background" />
          </Field>
          <Field label="Teglar (bo'sh joy bilan)">
            <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="#teg1 #teg2"
              className="w-full border border-input rounded px-3 py-2 bg-background" />
          </Field>
          <Field label="Muqova rasm">
            {form.cover_image_url && (
              <img src={form.cover_image_url} alt="cover" className="w-full max-h-40 object-cover rounded mb-2" />
            )}
            <label className="border-2 border-dashed border-border rounded p-4 flex flex-col items-center gap-2 text-muted-foreground text-sm cursor-pointer hover:border-brand">
              <Upload className="size-5" />
              {uploading ? "Yuklanmoqda..." : "Rasm yuklash"}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
            <input
              value={form.cover_image_url ?? ""}
              onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
              placeholder="yoki URL kiriting"
              className="mt-2 w-full border border-input rounded px-3 py-2 bg-background text-sm"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Bosh sahifada asosiy sifatida ko'rsatish
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-border">Bekor</button>
            <button type="submit" className="px-4 py-2 rounded bg-brand text-brand-foreground hover:bg-brand/90">Saqlash</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium block mb-1">{label}</span>
      {children}
    </label>
  );
}
