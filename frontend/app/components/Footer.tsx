import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--color-border)] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex">
              <Logo />
            </Link>
            <p className="mt-4 text-sm text-[var(--color-ink-muted)] leading-relaxed max-w-xs">
              From raw data to a trained model in minutes. AutoML for everyone —
              no code required.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-bold text-[var(--color-ink)]">Product</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/features"
                  className="text-[var(--color-ink-muted)] hover:text-brand-300 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-[var(--color-ink-muted)] hover:text-brand-300 transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-[var(--color-ink-muted)] hover:text-brand-300 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-bold text-[var(--color-ink)]">Account</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/login"
                  className="text-[var(--color-ink-muted)] hover:text-brand-300 transition-colors"
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-[var(--color-ink-muted)] hover:text-brand-300 transition-colors"
                >
                  Sign up
                </Link>
              </li>
              <li>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-[var(--color-ink)]">Company</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-[var(--color-ink-muted)] hover:text-brand-300 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-[var(--color-ink-muted)] hover:text-brand-300 transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-[var(--color-ink-dim)]">
            © 2026 Algotrix. All rights reserved.
          </p>
          <p className="text-sm text-[var(--color-ink-dim)]">
            Built with Next.js & FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
