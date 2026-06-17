import { Header } from "@/components/layout/Header";
import Image from "next/image";
import { getProducts } from "@/actions/products";
import { incrementPageView } from "@/actions/analytics";
import { FadeIn } from "@/components/ui/FadeIn";
import { after } from "next/server";

export const metadata = {
  title: "Products | Renaissance Decor",
  description: "Explore our curated range of premium decorative finishes and tools.",
};

export default async function ShopPage() {
  after(() => incrementPageView("/shop"));

  const products = await getProducts();

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" />

      {/* Page Title */}
      <section className="pt-36 md:pt-48 pb-16 px-6 md:px-12 w-full flex flex-col items-center">
        <FadeIn direction="up">
          <h1 className="font-futura font-light text-4xl md:text-5xl lg:text-6xl text-charcoal tracking-widest uppercase mb-0">
            Products
          </h1>
        </FadeIn>
      </section>

      {/* LustreFX Stockist Section */}
      <section className="w-full border-t border-stone/30">
        <div className="max-w-300 mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left: text */}
          <FadeIn direction="right" duration={1.1}>
            <div className="flex flex-col gap-6">
              <span className="font-futura text-[9px] uppercase tracking-[0.4em] text-bark">
                Official Stockist
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-charcoal leading-snug">
                Renaissance Décor are proud stockists for LustreFX.
              </h2>
              <p className="font-futura font-light text-sm text-bark leading-relaxed">
                LustreFX is defined by innovation — hand-crafted by a family
                company in Canberra. All products are proudly Australian Made,
                trusted by artisans, interior designers, and builders across
                the country.
              </p>
            </div>
          </FadeIn>

          {/* Right: logo */}
          <FadeIn direction="left" duration={1.1} delay={0.15}>
            <div className="flex items-center justify-center md:justify-end">
              <Image
                src="/images/logo-lustrefx.png"
                alt="LustreFX"
                width={300}
                height={150}
                className="w-50 md:w-65 h-auto opacity-85"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          </FadeIn>

        </div>
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
