"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Logo from "./Logo";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Features", href: "/features" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4"
    >
      <nav
        className={`mx-auto max-w-6xl flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${scrolled ? "glass-strong shadow-2xl shadow-black/40" : "bg-transparent"
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
        <Logo />
        </Link>

        {/* Center links — desktop only */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-block text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-brand-500 text-black hover:bg-brand-400 transition-all hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
