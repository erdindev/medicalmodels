"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./user-menu";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-foreground">
            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="font-semibold">medicalmodels.co</span>
          </Link>

          {/* Minimal Nav */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/compare"
              className={`font-bold ${pathname.startsWith("/compare") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Compare
            </Link>
            <Link
              href="/models"
              className={`font-bold ${pathname.startsWith("/models") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Models
            </Link>
            <Link
              href="/papers"
              className={`font-bold ${pathname.startsWith("/papers") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Papers
            </Link>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
