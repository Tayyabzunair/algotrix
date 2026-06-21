import Link from "next/link";

export default function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "How it Works", href: "/#how" },
        { label: "Upload Data", href: "/upload" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Log in", href: "/login" },
        { label: "Sign up", href: "/signup" },
        { label: "Dashboard", href: "/dashboard" },
      ],
    },
    {
      title: "Tech",
      links: [
        { label: "Next.js", href: "#" },
        { label: "FastAPI", href: "#" },
        { label: "scikit-learn", href: "#" },
      ],
    },
  ];

  return (
    <footer className="relative z-10 border-t border-[var(--color-border)] mt-10">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-bold text-black text-lg">
                A
              </div>
              <span
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Algotrix
              </span>
            </div>
            <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              From raw data to a trained model in minutes. AutoML for everyone.
            </p>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-4 text-[var(--color-ink)]">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-ink-muted)] hover:text-brand-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4">
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
