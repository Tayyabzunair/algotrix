"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { posts } from "./posts";
import { ArrowRight, Clock } from "lucide-react";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function BlogPage() {
  return (
    <main className="relative min-h-screen bg-grid overflow-hidden">
      <Navbar />

      <div
        className="glow-blob"
        style={{
          width: "500px",
          height: "500px",
          background: "#10b981",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.2,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-brand-300 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
            Blog
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gradient leading-tight">
            Insights on AutoML & data science
          </h1>
          <p className="mt-5 text-lg text-[var(--color-ink-muted)] max-w-2xl mx-auto">
            Learn how machine learning works, and how Algotrix makes it
            effortless.
          </p>
        </motion.div>

        {/* Posts */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mt-16 space-y-5"
        >
          {posts.map((post) => (
            <motion.div key={post.slug} variants={item}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block glass rounded-3xl p-8 hover:border-brand-400/30 transition-colors"
              >
                <div className="flex items-center gap-3 text-xs text-[var(--color-ink-muted)]">
                  <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 font-medium">
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>

                <h2 className="text-2xl font-bold mt-4 group-hover:text-brand-300 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm text-[var(--color-ink-muted)] leading-relaxed">
                  {post.excerpt}
                </p>

                <span className="inline-flex items-center gap-2 mt-5 text-brand-300 font-semibold text-sm">
                  Read article
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
