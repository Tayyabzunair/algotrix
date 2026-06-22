"use client";

import { use } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { posts } from "../posts";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-grid overflow-hidden">
      <Navbar />

      <div
        className="glow-blob"
        style={{
          width: "450px",
          height: "450px",
          background: "#10b981",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.18,
        }}
      />

      <article className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-muted)] hover:text-brand-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8"
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

          <h1 className="text-3xl sm:text-5xl font-bold text-gradient leading-tight mt-5">
            {post.title}
          </h1>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 space-y-5"
        >
          {post.content.map((block, i) =>
            block.type === "heading" ? (
              <h2 key={i} className="text-2xl font-bold mt-10 text-[var(--color-ink)]">
                {block.text}
              </h2>
            ) : (
              <p
                key={i}
                className="text-[var(--color-ink-muted)] leading-relaxed text-[15px]"
              >
                {block.text}
              </p>
            )
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 mt-14 text-center"
        >
          <h3 className="text-2xl font-bold text-gradient">
            Try Algotrix yourself
          </h3>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Upload a CSV and build a model in minutes — no code required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 mt-6 px-7 py-3.5 rounded-xl bg-brand-500 text-black font-semibold hover:bg-brand-400 transition-all hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5"
          >
            Start Building Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </article>

      <Footer />
    </main>
  );
}
