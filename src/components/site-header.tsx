import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center" aria-label={`${site.name} home`}>
          <Image src="/brand/logo.png" alt={site.name} width={233} height={63} priority className="h-12 w-auto" />
        </Link>
        <nav className="hidden md:block" aria-label="Main">
          <ul className="flex gap-7 text-sm font-medium">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MobileNav items={site.nav} />
      </div>
    </header>
  );
}
