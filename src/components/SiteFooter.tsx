import { Link } from "@tanstack/react-router";
import { NewsletterForm } from "./NewsletterForm";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-brand text-brand-foreground">
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 md:grid-cols-2">
        <div>
          <div className="font-serif text-2xl mb-1">QASHQIRLI.uz</div>
          <div className="text-brand-foreground/70 text-sm">
            © {new Date().getFullYear()} Professor Qozoqboy Yo'ldosh
          </div>
          
        </div>
        <div className="md:justify-self-end w-full md:max-w-md">
          <NewsletterForm />
        </div>
      </div>
    </footer>
  );
}
