import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { useStore, actions } from "@/lib/store";
import { Trash2, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/subscribers")({
  component: Page,
});

function Page() {
  const subscribers = useStore((s) => s.subscribers);

  const exportCsv = () => {
    const rows = [["email", "status", "subscribed_at"], ...subscribers.map((s) => [s.email, s.status, s.subscribed_at])];
    const csv = rows.map((r) => r.map((v) => `"${(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminShell title="Obunachilar">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">Jami: {subscribers.length}</div>
        <button onClick={exportCsv} disabled={!subscribers.length}
          className="inline-flex items-center gap-2 bg-brand text-brand-foreground px-4 py-2 rounded hover:bg-brand/90 disabled:opacity-50">
          <Download className="size-4" /> CSV eksport
        </button>
      </div>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 hidden sm:table-cell">Holat</th>
              <th className="px-4 py-3 hidden md:table-cell">Obuna sanasi</th>
              <th className="px-4 py-3 w-20 text-right">Amal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{s.email}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="inline-block px-2 py-0.5 rounded text-xs bg-brand-bright/20 text-brand">{s.status}</span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                  {new Date(s.subscribed_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={async () => {
                    if (confirm("Obunachini o'chirasizmi?")) {
                      await actions.deleteSubscriber(s.id);
                      toast.success("O'chirildi");
                    }
                  }} className="p-2 hover:text-destructive"><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
            {!subscribers.length && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Hozircha obunachilar yo'q</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
