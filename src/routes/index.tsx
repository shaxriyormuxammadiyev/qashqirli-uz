import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArticleCard } from "@/components/ArticleCard";
import { AudioCard } from "@/components/AudioCard";
import { useStore, useLoadData } from "@/lib/store"; // useLoadData hookini import qilamiz

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QASHQIRLI.uz — Professor Qozoqboy Yo'ldosh olami" },
      {
        name: "description",
        content:
          "Professor Qozoqboy Yo'ldoshning maqolalari, audio suhbatlari va adabiy tahlillari — QASHQIRLI.uz da.",
      },
      { property: "og:title", content: "QASHQIRLI.uz — Qozoqboy Yo'ldosh" },
      {
        property: "og:description",
        content: "Adabiyot, tanqid va ma'naviyat olamiga sayohat.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  // 1. Sahifa ochilishi bilan Supabase'dan ma'lumotlarni avtomat yuklash hookini chaqiramiz
  useLoadData();

  // 2. Store'dan holatni (state) va ma'lumotlarni olamiz
  const articles = useStore((s) => s.articles);
  const audios = useStore((s) => s.audios);
  const loaded = useStore((s) => s.loaded); // Yuklanish tugaganini bilish uchun

  const featured = articles.find((a) => a.featured) ?? articles[0];
  const standard = articles.filter((a) => a.id !== featured?.id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          {/* 3. Agar ma'lumot hali yuklanayotgan bo'lsa (loaded false bo'lsa) */}
          {!loaded ? (
            <div className="text-center py-12 text-muted-foreground animate-pulse">
              Ma'lumotlar yuklanmoqda...
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left column — standard articles */}
              <div className="space-y-6 lg:col-span-1">
                {standard.length > 0 ? (
                  standard.map((a) => <ArticleCard key={a.id} article={a} />)
                ) : (
                  <p className="text-sm text-muted-foreground">Maqolalar mavjud emas.</p>
                )}
              </div>

              {/* Right column — featured + audio */}
              <div className="space-y-6 lg:col-span-2">
                {featured ? (
                  <ArticleCard article={featured} featured />
                ) : (
                  <p className="text-sm text-muted-foreground">Asosiy maqola topilmadi.</p>
                )}
                
                <div className="space-y-4">
                  {audios.length > 0 ? (
                    audios.map((a) => <AudioCard key={a.id} audio={a} />)
                  ) : (
                    <p className="text-sm text-muted-foreground">Audio materiallar mavjud emas.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}