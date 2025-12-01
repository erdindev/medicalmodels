"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./user-menu";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1] as any
      }
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1] as any,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: { opacity: 1, y: 0 }
  };

  const links = [
    { href: "/models", label: "Models" },
    { href: "/developer-teams", label: "Developer Teams" },
    { href: "/datasets", label: "Datasets" },
  ];

  return (
    <nav className={`sticky top-0 z-[100] border-b border-border transition-colors duration-200 ${isOpen ? 'bg-white' : 'bg-background/70 backdrop-blur-md'}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-foreground z-50 relative">
            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className={`font-semibold ${isOpen ? 'text-black' : ''}`}>medicalmodels.co</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-bold relative py-4 ${pathname.startsWith(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {link.label}
                {pathname.startsWith(link.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-3 left-0 right-0 h-0.5 bg-[rgb(100,100,255)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute top-full left-0 right-0 h-3 bg-gradient-to-b from-[rgba(100,100,255,0.3)] to-transparent blur-[2px]" />
                  </motion.div>
                )}
              </Link>
            ))}
            <UserMenu />
          </div>

          {/* Mobile Burger */}
          <button
            className={`md:hidden z-50 relative text-foreground ${isOpen ? 'opacity-0 pointer-events-none' : ''}`}
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Mobile Fullscreen Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                className="fixed top-0 left-0 w-screen h-screen bg-white z-[110] flex flex-col items-end justify-end overflow-hidden pb-[20vh] pr-6"
                style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'fixed', height: '100vh', width: '100vw' }}
              >
                <div className="flex flex-col gap-6 text-right">
                  <motion.div variants={linkVariants} className="flex justify-end mb-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-8 w-8 text-black" />
                    </button>
                  </motion.div>
                  {links.map((link) => (
                    <motion.div key={link.href} variants={linkVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-4xl font-black text-black hover:text-primary transition-colors block"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div variants={linkVariants}>
                    <div onClick={() => setIsOpen(false)} className="flex justify-end">
                      <UserMenu />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
