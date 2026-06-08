import { getBlogPosts } from "@/actions/blog";
import { Header } from "@/components/layout/Header";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Journal | Renaissance Decor",
  description:
    "Insights, inspiration and behind-the-scenes stories from the Renaissance Decor team.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts(true); // published only

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" />

      {/* Page Header */}
      <section className="pt-48 pb-12 px-6 md:px-12 w-full flex flex-col items-center">
        <h1 className="font-futura font-light text-4xl md:text-5xl lg:text-6xl text-[#000000] tracking-widest uppercase mb-12">
          Journal
        </h1>
        <p className="font-futura text-sm md:text-base text-center max-w-2xl text-[var(--color-charcoal)]/70 leading-relaxed mb-24 font-light">
          Insights, inspiration, and craft from our studio — exploring the
          intersection of texture, material, and light.
        </p>
      </section>

      {/* Blog Masonry Grid matching Projects page aesthetics */}
      <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
        {posts.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-futura text-sm text-[var(--color-charcoal)]/50 uppercase tracking-widest">
              No articles published yet
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8">
            {posts.map((post, idx) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="w-full break-inside-avoid mb-10 md:mb-16 group cursor-pointer flex flex-col gap-3 md:gap-4 block"
              >
                {/* Image Container with identical zoom-out hover effect */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-transparent group-hover:bg-[#B0A99C] transition-colors duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover object-center transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[0.92]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={idx === 0}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-stone)] to-[var(--color-bark)]/30 flex items-center justify-center transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[0.92]">
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-[var(--color-bark)]/40"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Meta details & title layout */}
                <div className="flex flex-col text-left px-1 gap-1">
                  {post.publishedAt && (
                    <span className="font-futura text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-[var(--color-bark)]">
                      {new Date(post.publishedAt).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  <h2 className="font-futura font-bold text-[10px] md:text-[11.5px] text-[var(--color-charcoal)] uppercase tracking-[0.18em] leading-snug">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="font-futura text-[11px] text-[var(--color-charcoal)]/60 leading-relaxed font-light mt-1.5 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="font-futura text-[8px] uppercase tracking-[0.2em] text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)] pb-0.5 self-start mt-2 group-hover:opacity-60 transition-opacity">
                    Read Journal →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
