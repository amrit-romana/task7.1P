import { getProjects } from "@/actions/projects";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout/Header";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params as per Next.js 15 asynchronous routing architecture
  const { id } = await params;

  const projects = await getProjects();
  const project = projects.find(p => p.id === id);

  if (!project) {
    notFound();
  }

  // Ensure there's a fallback array if galleryImages is undefined
  const images = project.galleryImages && project.galleryImages.length > 0
    ? project.galleryImages
    : [project.image];

  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)]">
      <Header theme="dark" />

      {/* Hero Image Section */}
      <section className="pt-24 md:pt-32 px-6 md:px-12 w-full max-w-[1600px] mx-auto">
        <div className="relative w-full h-[50vh] md:h-[75vh] bg-[var(--color-stone)] overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      </section>

      {/* Title & Description Block */}
      <section className="px-6 md:px-12 w-full max-w-[1600px] mx-auto pt-12 md:pt-20 pb-12 flex flex-col items-start">
        <h1 className="font-futura font-bold text-[10px] md:text-xs text-[var(--color-charcoal)] tracking-[0.2em] uppercase mb-4">
          {project.title}
        </h1>
        <p className="font-futura text-[12px] md:text-[13px] text-[var(--color-charcoal)] leading-loose max-w-3xl font-light whitespace-pre-line">
          {project.description || "Although this house was built in 1942, it was built more with the sensibilities of a Georgian period house, large open rooms, classical mouldings and period features. The design intent was to make the property fit for a family, not pretentious or overly serious."}
        </p>
      </section>

      {/* 2-Column Gallery Grid */}
      <section className="px-6 md:px-12 w-full max-w-[1600px] mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-full aspect-[4/5] bg-[var(--color-stone)] overflow-hidden">
              <Image
                src={img}
                alt={`${project.title} gallery view ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
