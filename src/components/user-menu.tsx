"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return <div className="h-8 w-8 rounded-full bg-secondary animate-pulse" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
            {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card shadow-lg py-1 z-50">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">
              {session.user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session.user.email}
            </p>
            {session.user.plan && session.user.plan !== "free" && (
              <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                {session.user.plan}
              </span>
            )}
          </div>

          <Link
            href="/saved"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-foreground hover:bg-secondary/50"
          >
            Saved models
          </Link>
          <Link
            href="/comparisons"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-foreground hover:bg-secondary/50"
          >
            My comparisons
          </Link>
          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-foreground hover:bg-secondary/50"
          >
            Settings
          </Link>

          <div className="border-t border-border mt-1">
            <button
              onClick={() => signOut()}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-secondary/50"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
