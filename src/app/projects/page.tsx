import { Header } from "@/components/layout/Header";
import { getProjects } from "@/actions/projects";
import Image from "next/image";
import Link from "next/link";
import { incrementPageView } from "@/actions/analytics";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await incrementPageView("/projects");
  const allProjects = await getProjects();

  // Create an artificial larger array for a staggered gallery effect if needed, 
  // or simply map the existing projects into a 3-column classic masonry.
  // HFL Interiors uses a distinct, slightly asymmetrical 3-column masonry with varied image ratios.

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" />

      <section className="pt-48 pb-12 px-6 md:px-12 w-full flex flex-col items-center">
        <h1 className="font-futura font-light text-4xl md:text-5xl lg:text-6xl text-[#000000] tracking-widest uppercase mb-12">
          Projects
        </h1>

        <p className="font-futura text-sm md:text-base text-center max-w-2xl text-[var(--color-charcoal)]/70 leading-relaxed mb-24 font-light">
          A selection of our commissioned architectural finishes, spanning private residences, commercial spaces, and luxury retail across Melbourne and internationally.
        </p>
      </section>

      {/* HFL Style Asymmetrical Masonry Grid */}
      <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pb-32">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8">
          {allProjects.map((project, idx) => (
            <Link
              key={idx}
              href={`/projects/${project.id}`}
              className="w-full break-inside-avoid mb-10 md:mb-16 group cursor-pointer flex flex-col gap-3 md:gap-4 block"
            >
              <div
                className="relative w-full overflow-hidden bg-transparent group-hover:bg-[#B0A99C] transition-colors duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] aspect-[4/5]"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-center transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[0.92]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-col text-left px-1">
                <span className="font-futura font-bold text-[8px] md:text-[9.5px] text-[var(--color-charcoal)] uppercase tracking-[0.2em]">
                  {project.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
