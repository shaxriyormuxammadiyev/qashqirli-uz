import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/store";
import { ImageIcon } from "lucide-react";

export function ArticleCard({ article, featured }: { article: Article; featured?: boolean }) {
  return (
    <Link
      to="/maqola/$id"
      params={{ id: article.id }}
      className="block bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition group"
    >
      <div
        className={`relative bg-muted grid place-items-center text-muted-foreground ${
          featured ? "aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        {article.cover_image_url ? (
          <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-60">
            <ImageIcon className="size-8" />
            <span className="font-serif text-xl">
              {featured ? "Asosiy rasm" : "Rasm uchun joy"}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-2 text-xs text-tag font-medium">
          {article.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <h3
          className={`font-serif font-semibold text-foreground group-hover:text-brand transition ${
            featured ? "text-2xl" : "text-xl"
          }`}
        >
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-4">{article.excerpt}</p>
      </div>
    </Link>
  );
}
