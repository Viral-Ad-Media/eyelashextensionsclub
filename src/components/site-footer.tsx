import Link from "next/link";
import { cacheLife } from "next/cache";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-serif text-xl text-gold">{site.name}</p>
          <p className="mt-3 text-sm leading-relaxed">{site.description}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cream">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/blog/" className="hover:text-gold">All articles</Link></li>
            <li><Link href="/category/general/" className="hover:text-gold">Lash basics</Link></li>
            <li><Link href="/category/tips-and-tricks/" className="hover:text-gold">Tips & tricks</Link></li>
            <li><Link href="/category/reviews/" className="hover:text-gold">Reviews</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cream">About</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/faq/" className="hover:text-gold">FAQ</Link></li>
            <li><Link href="/privacy-policy/" className="hover:text-gold">Privacy policy</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-cream/10 py-5 text-center text-xs">
        © <Year /> {site.name}. For general information only, not medical advice.
      </p>
    </footer>
  );
}

async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
