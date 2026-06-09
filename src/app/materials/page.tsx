import { Header } from "@/components/layout/Header";
import { getFinishes } from "@/actions/finishes";
import Image from "next/image";
import Link from "next/link";
import { incrementPageView } from "@/actions/analytics";

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  await incrementPageView("/materials");
  const finishes = await getFinishes();

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" />
      
      <section className="pt-48 pb-12 px-6 md:px-12 w-full flex flex-col items-center">
        <h1 className="font-futura font-light text-4xl md:text-5xl lg:text-6xl text-[#000000] tracking-widest uppercase mb-12">
          Finishes
        </h1>
        <p className="font-futura text-sm md:text-base text-center max-w-2xl text-[#000000]/70 leading-relaxed mb-24 font-light">
          Choose from our extensive range of Finishes, or alternatively we can create custom finishes to suit your requirements. For bespoke finishes please contact us and provide images and details from which sample boards can be created.
        </p>
      </section>

      {/* Grid of Finishes */}
      <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {finishes.map((finish, idx) => (
            <Link
              key={finish.id}
              href={`/materials/${finish.id}`}
              className="group cursor-pointer flex flex-col gap-6"
            >
              <div className="relative w-full overflow-hidden bg-[var(--color-stone)] aspect-[4/5]">
                <Image
                  src={finish.image}
                  alt={finish.name}
                  fill
                  className="object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-col text-center">
                <span className="font-futura font-bold text-sm md:text-base text-[#000000] uppercase tracking-[0.2em]">
                  {finish.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
