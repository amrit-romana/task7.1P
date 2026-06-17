"use client";

import { Header } from "@/components/layout/Header";
import { FadeIn } from "@/components/ui/FadeIn";
import { useState, useRef } from "react";

const contactData = {
  address: {
    line1: "Unit 5 / 314 Governor Road,",
    line2: "Braeside 3195",
    note: "Visits by appointment only"
  },
  hours: "9:00am — 5:00pm, Mon – Fri",
  abn: "ABN 70 890 172 250",
  telephone: "0468 326 303",
  email: "info@renaissancedecor.com.au",
  marketing: "office@renaissancedecor.com.au",
  instagram: "@renaissancedecor"
};

export default function EnquirePage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[var(--color-parchment)] flex flex-col">
        <Header theme="dark" />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8">
          <FadeIn direction="up">
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">Thank You</span>
          </FadeIn>
          <FadeIn delay={0.15} direction="up" duration={1.2}>
            <h1 className="font-futura font-light text-4xl md:text-5xl text-[#000000] tracking-widest uppercase">
              Enquiry Received
            </h1>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <p className="font-serif italic text-xl text-[#000000]/60 max-w-sm leading-relaxed">
              We will review your project details and be in touch shortly.
            </p>
          </FadeIn>
          <FadeIn delay={0.45} direction="up">
            <button
              onClick={() => setSubmitted(false)}
              className="font-sans text-[11px] uppercase tracking-[0.3em] border-b border-black pb-1 hover:opacity-50 transition-opacity"
            >
              Send Another
            </button>
          </FadeIn>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-parchment)] flex flex-col">
      <Header theme="dark" />

      {/* Page Hero */}
      <section className="pt-36 md:pt-48 pb-16 px-6 md:px-12 w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col gap-6 items-center text-center w-full">
          <FadeIn direction="up">
            <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">
              Connect
            </span>
          </FadeIn>
          <FadeIn delay={0.15} direction="up" duration={1.2}>
            <h1 className="font-futura font-light text-5xl md:text-6xl lg:text-8xl text-[#000000] tracking-widest uppercase">
              Enquire
            </h1>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <p className="font-serif italic text-xl md:text-2xl text-[#000000]/60 leading-relaxed max-w-lg">
              Tell us about your project and we'll be in touch with bespoke recommendations.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Grid */}
      <section className="pb-32 px-6 md:px-12 w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

        {/* LEFT: Contact Info + Form */}
        <div className="lg:col-span-7 flex flex-col gap-16">

          {/* Contact Info */}
          <FadeIn direction="up" delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-16 border-b border-[#000000]/10">
              <div className="flex flex-col gap-2">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Address</span>
                <p className="font-sans text-sm text-[#000000]/80 leading-loose">
                  {contactData.address.line1}<br />
                  {contactData.address.line2}
                </p>
                <p className="font-sans text-xs text-[#000000]/40 italic">{contactData.address.note}</p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Telephone</span>
                  <a href={`tel:${contactData.telephone.replace(/\s/g, "")}`} className="font-sans text-sm text-[#000000]/80 hover:text-[#000000] transition-colors">
                    {contactData.telephone}
                  </a>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Hours</span>
                  <p className="font-sans text-sm text-[#000000]/80">{contactData.hours}</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Email</span>
                  <a href={`mailto:${contactData.email}`} className="font-sans text-sm text-[#000000]/80 hover:text-[#000000] transition-colors">
                    {contactData.email}
                  </a>
                  <a href={`mailto:${contactData.marketing}`} className="font-sans text-xs text-[#000000]/40 italic hover:text-[#000000]/70 transition-colors">
                    Press: {contactData.marketing}
                  </a>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Instagram</span>
                  <a href="https://instagram.com/renaissancedecor" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-[#000000]/80 hover:text-[#000000] transition-colors">
                    {contactData.instagram}
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-12">

            <FadeIn direction="up" delay={0.15}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
                <div className="flex flex-col gap-3">
                  <label className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#000000]/60">
                    First name <span className="text-[#000000]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    className="bg-transparent border-b border-[#000000]/30 focus:border-[#000000] outline-none py-3 font-sans text-base text-[#000000] transition-colors placeholder:text-[#000000]/20"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#000000]/60">
                    Last name <span className="text-[#000000]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Last name"
                    className="bg-transparent border-b border-[#000000]/30 focus:border-[#000000] outline-none py-3 font-sans text-base text-[#000000] transition-colors placeholder:text-[#000000]/20"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
                <div className="flex flex-col gap-3">
                  <label className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#000000]/60">
                    Email address <span className="text-[#000000]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="bg-transparent border-b border-[#000000]/30 focus:border-[#000000] outline-none py-3 font-sans text-base text-[#000000] transition-colors placeholder:text-[#000000]/20"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#000000]/60">
                    Telephone <span className="text-[#000000]/30 lowercase tracking-normal font-light italic">optional</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Optional"
                    className="bg-transparent border-b border-[#000000]/30 focus:border-[#000000] outline-none py-3 font-sans text-base text-[#000000] transition-colors placeholder:text-[#000000]/20"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.25}>
              <div className="flex flex-col gap-3">
                <label className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#000000]/60">
                  Project address <span className="text-[#000000]/30 lowercase tracking-normal font-light italic">optional</span>
                </label>
                <input
                  type="text"
                  placeholder="Suburb or full address"
                  className="bg-transparent border-b border-[#000000]/30 focus:border-[#000000] outline-none py-3 font-sans text-base text-[#000000] transition-colors placeholder:text-[#000000]/20"
                />
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
                <div className="flex flex-col gap-3">
                  <label className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#000000]/60">
                    Wall length <span className="text-[#000000]/30 lowercase tracking-normal font-light italic">optional</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4.5m"
                    className="bg-transparent border-b border-[#000000]/30 focus:border-[#000000] outline-none py-3 font-sans text-base text-[#000000] transition-colors placeholder:text-[#000000]/20"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#000000]/60">
                    Wall height <span className="text-[#000000]/30 lowercase tracking-normal font-light italic">optional</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2.7m"
                    className="bg-transparent border-b border-[#000000]/30 focus:border-[#000000] outline-none py-3 font-sans text-base text-[#000000] transition-colors placeholder:text-[#000000]/20"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.35}>
              <div className="flex flex-col gap-3">
                <label className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#000000]/60">
                  Inspirational image <span className="text-[#000000]/30 lowercase tracking-normal font-light italic">optional</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-b border-dashed border-[#000000]/30 hover:border-[#000000] transition-colors cursor-pointer py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-sans text-sm text-[#000000]/40">
                    {fileName || "Attach a photo or rendering"}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 opacity-40">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                />
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.4}>
              <div className="flex flex-col gap-3">
                <label className="font-sans text-[10px] uppercase tracking-[0.25em] font-bold text-[#000000]/60">
                  Your message <span className="text-[#000000]">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Details about your surfaces, preferred finish, and timeline..."
                  className="bg-transparent border-b border-[#000000]/30 focus:border-[#000000] outline-none py-3 font-sans text-base text-[#000000] transition-colors placeholder:text-[#000000]/20 resize-none"
                />
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.45}>
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full sm:w-fit font-sans text-xs font-bold uppercase tracking-[0.2em] border border-[#000000] px-16 py-5 hover:bg-[#000000] hover:text-[var(--color-parchment)] transition-colors duration-500 disabled:opacity-40"
              >
                {submitting ? "Sending..." : "Send Enquiry"}
              </button>
            </FadeIn>

          </form>
        </div>

        {/* RIGHT: Map + Note */}
        <aside className="lg:col-span-5 flex flex-col gap-8 lg:pt-4">
          <FadeIn direction="left" delay={0.2} className="w-full">
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <iframe
                src="https://maps.google.com/maps?q=314+Governor+Road+Braeside+VIC+3195+Australia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.35}>
            <div className="flex flex-col gap-4 border-t border-[#000000]/10 pt-8">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Showroom</span>
              <p className="font-sans text-sm text-[#000000]/70 leading-loose max-w-xs">
                Visiting our Braeside showroom is by appointment only — we want to ensure dedicated time and bring the right samples to your consultation.
              </p>
              <p className="font-sans text-xs text-[#000000]/40">{contactData.abn}</p>
            </div>
          </FadeIn>
        </aside>

      </section>
    </main>
  );
}
