import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/AdminShell";
import { useStore, actions, type AudioArticle } from "@/lib/store";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/audio")({
  component: Page,
});

function empty(): Partial<AudioArticle> {
  return {
    title: "",
    description: "",
    tags: [],
    duration: "00:00",
    audio_url: "",
    cover_image_url: null,
  };
}

function Page() {
  const audios = useStore((s) => s.audios);
  const [editing, setEditing] = useState<Partial<AudioArticle> | null>(null);

  return (
    <AdminShell title="Audio maqolalar">
      <div className="flex justify-end mb-4">
        <button onClick={() => setEditing(empty())}
          className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-4 py-2 rounded hover:bg-brand/90">
          <Plus className="size-4" /> Yangi audio
        </button>
      </div>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3">Sarlavha</th>
              <th className="px-4 py-3 hidden sm:table-cell">Davomiyligi</th>
              <th className="px-4 py-3 hidden md:table-cell">Sana</th>
              <th className="px-4 py-3 w-32 text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {audios.map((a) => (
              <tr key={a.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{a.duration}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{a.created_at.slice(0, 10)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(a)} className="p-2 hover:text-brand"><Pencil className="size-4" /></button>
                  <button onClick={async () => {
                    if (confirm("O'chirilsinmi?")) {
                      await actions.deleteAudio(a.id);
                      toast.success("O'chirildi");
                    }
                  }} className="p-2 hover:text-destructive"><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <Editor item={editing} onClose={() => setEditing(null)} onSave={async (a) => {
          await actions.upsertAudio(a);
          toast.success("Saqlandi");
          setEditing(null);
        }} />
      )}
    </AdminShell>
  );
}

function Editor({ item, onClose, onSave }: { item: Partial<AudioArticle>; onClose: () => void; onSave: (a: Partial<AudioArticle>) => void }) {
  const [form, setForm] = useState(item);
  const [tagsStr, setTagsStr] = useState((item.tags ?? []).join(" "));
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await actions.uploadFile("audio", file);
      setForm((f) => ({ ...f, audio_url: url }));
      toast.success("Audio yuklandi");
    } catch (err: any) {
      toast.error("Xatolik: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-serif text-lg">{item.id ? "Tahrirlash" : "Yangi audio"}</h3>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ ...form, tags: tagsStr.split(/\s+/).filter(Boolean) }); }} className="p-4 space-y-4">
          <L label="Sarlavha"><input required value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-input rounded px-3 py-2 bg-background" /></L>
          <L label="Tavsif"><textarea required rows={4} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-input rounded px-3 py-2 bg-background" /></L>
          <L label="Davomiyligi"><input value={form.duration ?? ""} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="12:34" className="w-full border border-input rounded px-3 py-2 bg-background" /></L>
          <L label="Teglar"><input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="#audio #suhbat" className="w-full border border-input rounded px-3 py-2 bg-background" /></L>
          <L label="Audio fayl (MP3)">
            <label className="border-2 border-dashed border-border rounded p-4 flex flex-col items-center gap-2 text-muted-foreground text-sm cursor-pointer hover:border-brand">
              <Upload className="size-5" />
              {uploading ? "Yuklanmoqda..." : "MP3 fayl yuklash"}
              <input type="file" accept="audio/*" onChange={handleUpload} className="hidden" />
            </label>
            <input
              value={form.audio_url ?? ""}
              onChange={(e) => setForm({ ...form, audio_url: e.target.value })}
              placeholder="yoki audio URL kiriting"
              className="mt-2 w-full border border-input rounded px-3 py-2 bg-background text-sm"
            />
            {form.audio_url && <audio src={form.audio_url} controls className="w-full mt-2" />}
          </L>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-border">Bekor</button>
            <button type="submit" className="px-4 py-2 rounded bg-brand text-brand-foreground hover:bg-brand/90">Saqlash</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm font-medium block mb-1">{label}</span>{children}</label>;
}
