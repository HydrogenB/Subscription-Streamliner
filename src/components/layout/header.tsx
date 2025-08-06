"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clapperboard, Menu, X, ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/subscriptions", label: "Browse" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/account", label: "Account" },
];

export function Header({ showBackButton = false, title }: { showBackButton?: boolean; title?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {showBackButton ? (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <Link href="/" className="flex items-center space-x-2">
            <Clapperboard className="h-6 w-6 text-primary" />
          </Link>
        )}
        
        <div className="flex-1 text-center">
            <h1 className="text-lg font-bold">{title}</h1>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                  <Clapperboard className="h-6 w-6 text-primary" />
                  <span className="font-bold">
                    Subscription Streamliner
                  </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                </Button>
              </div>

              <nav className="flex flex-col items-start space-y-4 mb-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" onClick={() => setIsOpen(false)}>Login</Button>
                <Button onClick={() => setIsOpen(false)}>Sign Up</Button>
              </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
