import { Header } from "@/components/layout/Header";
import Image from "next/image";
import { getProducts } from "@/actions/products";
import { incrementPageView } from "@/actions/analytics";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products | Renaissance Decor",
  description: "Explore our curated range of premium decorative finishes and tools.",
};

export default async function ShopPage() {
  // Track page view
  await incrementPageView("/shop");

  const products = await getProducts();

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" />

      <section className="pt-48 pb-12 px-6 md:px-12 w-full flex flex-col items-center">
        <h1 className="font-futura font-light text-4xl md:text-5xl lg:text-6xl text-[var(--color-charcoal)] tracking-widest uppercase mb-6 md:mb-12">
          Products
        </h1>
        <p className="font-futura text-sm md:text-base text-[var(--color-charcoal)]/80 leading-relaxed font-light text-center max-w-2xl mb-12">
          Explore our curated range of premium decorative finishes and tools. Trusted by leading artisans and designers globally.
        </p>
      </section>

      {/* Dynamic Product Grid */}
      <section className="w-full max-w-[1200px] mx-auto px-6 md:px-12 pb-32">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-light font-futura">
            No products available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <a
                key={product.id}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex flex-col gap-3 group"
              >
                <div className="relative w-full aspect-square bg-[var(--color-stone)] overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-opacity duration-300 group-hover:opacity-75"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-futura font-bold text-[10px] md:text-[11px] text-[var(--color-charcoal)] uppercase tracking-widest md:tracking-[0.2em]">
                    {product.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-20">
          <a
            href="https://lustrefx.com.au/products/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--color-charcoal)] border-b border-[var(--color-charcoal)] pb-1 hover:opacity-60 transition-opacity"
          >
            Browse All External Products
          </a>
        </div>
      </section>
    </main>
  );
}
