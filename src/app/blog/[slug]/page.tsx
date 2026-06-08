import { getBlogPostBySlug } from "@/actions/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Journal | Renaissance Decor`,
    description: post.excerpt || `Read our latest article: ${post.title}`,
  };
}

export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" />

      {/* Hero Header Section */}
      <section className="pt-32 pb-8 px-6 md:px-12 w-full max-w-[1200px] mx-auto flex flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-2">
          <Link
            href="/blog"
            className="font-futura text-[9px] uppercase tracking-[0.25em] text-[var(--color-bark)] hover:underline"
          >
            Journal
          </Link>
          <span className="font-futura text-[9px] text-[var(--color-bark)]">/</span>
          {post.publishedAt && (
            <span className="font-futura text-[9px] uppercase tracking-[0.25em] text-[var(--color-bark)]">
              {new Date(post.publishedAt).toLocaleDateString("en-AU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
        <h1 className="font-futura font-bold text-2xl md:text-4xl lg:text-5xl text-[var(--color-charcoal)] tracking-widest uppercase max-w-4xl leading-tight mb-8">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="font-futura text-sm md:text-base text-[var(--color-charcoal)]/70 max-w-2xl leading-relaxed font-light mb-12">
            {post.excerpt}
          </p>
        )}
      </section>

      {/* Cover Image Section */}
      {post.coverImage && (
        <section className="w-full max-w-[1200px] mx-auto px-6 md:px-12 pb-16">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[var(--color-stone)] overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>
        </section>
      )}

      {/* Main Content Column */}
      <section className="w-full max-w-[800px] mx-auto px-6 md:px-12 pb-32">
        <div className="font-futura text-sm md:text-base text-[var(--color-charcoal)]/80 leading-loose font-light whitespace-pre-wrap break-words">
          {post.content}
        </div>

        {/* Back navigation footer */}
        <div className="mt-20 pt-10 border-t border-[var(--color-stone)] flex justify-between items-center">
          <Link
            href="/blog"
            className="font-futura font-bold text-[10px] uppercase tracking-[0.25em] text-[var(--color-charcoal)] hover:opacity-50 transition-opacity"
          >
            ← Back to Journal
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
