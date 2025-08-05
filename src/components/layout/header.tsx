"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clapperboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/subscriptions", label: "Browse" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/account", label: "Account" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Clapperboard className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">
              Subscription Streamliner
            </span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-4 sm:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end space-x-4">
          <Button variant="ghost">Login</Button>
          <Button>Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
