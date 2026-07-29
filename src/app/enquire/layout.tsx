import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Venetian Plaster Quote Melbourne | Free Consultation",
  description:
    "Request a free, no-obligation Venetian plaster or decorative finish quote from Renaissance Decor. We service Melbourne metro, Bayside and the Mornington Peninsula, with a response within one business day.",
  alternates: { canonical: "/enquire" },
};

export default function EnquireLayout({ children }: { children: React.ReactNode }) {
  return children;
}
