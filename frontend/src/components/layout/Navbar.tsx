import Link from "next/link";
import { NavSearch } from "@/components/layout/NavSearch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ConnectWalletButton } from "@/features/wallet/ConnectWalletButton";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/collections", label: "Collections" },
  { href: "/create", label: "Create" },
  { href: "/stats", label: "Stats" },
];

export function Navbar() {
  return (
    <header className="glass sticky top-0 z-40 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
            {siteConfig.name}
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <NavSearch />
          <ThemeToggle />
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
