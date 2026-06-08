import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Courses & Training | Renaissance Decor",
  description:
    "Join our expert-led hands-on training courses in Venetian Plaster, Metal Finishes, and Microcement in Melbourne.",
};

const courses = [
  {
    id: "venetian-plaster-beginners",
    title: "Venetian Plasters - Beginners",
    price: "$750.00",
    duration: "1 Day",
    location: "Unit 5 / 314 Governor Road, Braeside 3195",
    date: "TBC (Register Interest)",
    image: "/images/textured_wall_detail_1779881978134.png", // fallback or generated images
    description:
      "Intensive hands-on training of key Venetian plaster finishes. Learn the fundamentals of surface preparation, base coating, and refined trowel techniques to achieve authentic polished and textured Italian finishes.",
    inclusions: [
      "Certificate of completion",
      "Intensive training of key Venetian finishes by LustreFX",
      "Sample boards to take home for client presentations",
      "Free sample pots of products to start your practice",
      "Detailed reference workbook to take home",
      "Lunch, gourmet snacks, and drinks provided",
      "Ongoing expert technical support via phone/email",
    ],
    enquirySubject: "Venetian Plasters - Beginners",
  },
  {
    id: "metal-coatings",
    title: "Metal Coatings & Finishes",
    price: "TBC",
    duration: "1 Day",
    location: "Unit 5 / 314 Governor Road, Braeside 3195",
    date: "TBC (Register Interest)",
    image: "/images/modern_concrete_interior_1779881917291.png",
    description:
      "Master the application of liquid metal coatings and advanced oxidation techniques. Discover how to apply real metal to any surface and accelerate beautiful, natural rust, patina, and burnished textures.",
    inclusions: [
      "Certificate of completion",
      "Intensive training of key metal finishes by LustreFX",
      "Sample boards to take home for client presentations",
      "Free sample pots of products to start your practice",
      "Detailed reference workbook to take home",
      "Lunch, gourmet snacks, and drinks provided",
      "Ongoing expert technical support via phone/email",
    ],
    enquirySubject: "Metal Coatings & Finishes",
  },
  {
    id: "microcement-beginners",
    title: "Microcement - Beginners",
    price: "TBC",
    duration: "1 Day",
    location: "Unit 5 / 314 Governor Road, Braeside 3195",
    date: "TBC (Register Interest)",
    image: "/images/db_verification_test_1778646278288.webp",
    description:
      "Gain expert skills in microcement floor and wall applications. Learn the step-by-step processes of applying durable, seamless, waterproof microcement finishes by Hychem for residential and commercial spaces.",
    inclusions: [
      "Certificate of completion",
      "Intensive training in Microcement finishing by Hychem",
      "Sample boards to take home for client presentations",
      "Free sample pots of products to start your practice",
      "Detailed reference workbook to take home",
      "Lunch, gourmet snacks, and drinks provided",
      "Ongoing expert technical support via phone/email",
    ],
    enquirySubject: "Microcement - Beginners",
  },
];

export default function CoursesPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[var(--color-parchment)] select-none">
      <Header theme="dark" />

      {/* Hero Header */}
      <section className="pt-48 pb-12 px-6 md:px-12 w-full flex flex-col items-center">
        <h1 className="font-futura font-light text-4xl md:text-5xl lg:text-6xl text-[#000000] tracking-widest uppercase mb-6 text-center">
          Artisanal Courses
        </h1>
        <p className="font-futura text-sm md:text-base text-center max-w-2xl text-[var(--color-charcoal)]/70 leading-relaxed font-light">
          Join our expert-led, hands-on training courses at our Braeside showroom. Learn the heritage craft, master advanced finishes, and gain professional certificates.
        </p>
      </section>

      {/* Courses List */}
      <section className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pb-32 pt-12">
        <div className="flex flex-col gap-24 md:gap-32">
          {courses.map((course, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={course.id}
                className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-start ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Course Image */}
                <div className="w-full lg:w-1/2 aspect-[4/3] relative bg-[var(--color-stone)] overflow-hidden shadow-sm">
                  {course.image ? (
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-neutral-400"
                      >
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  )}
                  {/* Subtle luxury badge */}
                  <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-sm text-[var(--color-parchment)] px-4 py-2 font-futura text-[10px] uppercase tracking-widest font-semibold">
                    {course.duration}
                  </div>
                </div>

                {/* Course Details Content */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                  <div>
                    <span className="font-futura text-[9px] uppercase tracking-[0.25em] text-[var(--color-bark)] mb-2 block">
                      Professional Training
                    </span>
                    <h2 className="font-futura font-bold text-xl md:text-2xl lg:text-3xl text-[var(--color-charcoal)] uppercase tracking-[0.1em] leading-tight">
                      {course.title}
                    </h2>
                  </div>

                  <p className="font-futura text-xs md:text-sm text-[var(--color-charcoal)]/80 leading-relaxed font-light">
                    {course.description}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 border-y border-[var(--color-stone)] py-4 font-futura text-xs">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-bark)] font-semibold">Price</p>
                      <p className="text-sm font-bold text-[var(--color-charcoal)] mt-1">{course.price}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-bark)] font-semibold">Location</p>
                      <p className="text-[11px] text-[var(--color-charcoal)]/80 mt-1 leading-snug">
                        Braeside Showroom
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-bark)] font-semibold">Duration</p>
                      <p className="text-[11px] text-[var(--color-charcoal)]/80 mt-1">{course.duration}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--color-bark)] font-semibold">Next Date</p>
                      <p className="text-[11px] font-medium text-[var(--color-charcoal)] mt-1">{course.date}</p>
                    </div>
                  </div>

                  {/* Package Inclusions */}
                  <div>
                    <h3 className="font-futura font-bold text-[10px] uppercase tracking-[0.15em] text-[var(--color-charcoal)] mb-4">
                      Course Inclusions:
                    </h3>
                    <ul className="flex flex-col gap-2.5 font-futura text-xs text-[var(--color-charcoal)]/80 font-light">
                      {course.inclusions.map((inc, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="text-[var(--color-bark)] flex-shrink-0 mt-0.5">•</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Enquiry CTA Button */}
                  <div className="mt-4">
                    <Link
                      href={`/enquire?subject=${encodeURIComponent(
                        "Enquiry regarding " + course.enquirySubject
                      )}`}
                      className="inline-block bg-[#2b1f1f] text-white font-futura text-[10px] uppercase tracking-[0.25em] px-10 py-4 hover:bg-black transition-colors rounded-sm shadow-sm"
                    >
                      Enquire / Secure Spot
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Showroom Invite Banner */}
      <section className="w-full bg-[#eadecf] py-20 px-6 md:px-12 text-center flex flex-col items-center">
        <span className="font-futura text-[9px] uppercase tracking-[0.25em] text-[var(--color-bark)] mb-4 block">
          Visit Our Showroom
        </span>
        <h2 className="font-futura font-light text-2xl md:text-3xl text-black tracking-widest uppercase mb-6 max-w-xl">
          Interested in Private or Custom Group Training?
        </h2>
        <p className="font-futura text-xs md:text-sm text-black/70 max-w-lg leading-relaxed mb-8 font-light">
          We host private masterclasses for architecture firms, design studios, and commercial contracting teams. Speak with Adam to coordinate a custom syllabus.
        </p>
        <div className="flex gap-4">
          <Link
            href="/enquire"
            className="font-futura font-bold text-[10px] uppercase tracking-[0.25em] text-black border-b border-black pb-1 hover:opacity-50 transition-opacity"
          >
            Contact Adam
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
