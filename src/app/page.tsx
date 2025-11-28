import ClientHomePage from "@/components/ClientHomePage";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Pharmanecia 4.E | International Research Conference on AI and ML",
  description:
    "Join the leading international Research conference, Pharmanecia 4.E, exploring AI and ML in drug discovery. March 7-8, 2025, JSS College of Pharmacy, Ooty.",
  keywords:
    "Research conference, international conference, AI in pharmacy, ML in drug discovery, Pharmanecia",
  openGraph: {
    title: "Pharmanecia 4.E - International Pharmacy Conference",
    description:
      "Leading international conference on AI and ML in Drug Discovery. Join pharmacy experts worldwide on March 7-8, 2025.",
    url: "https://www.pharmanecia.org/",
    siteName: "Pharmanecia 4.E",
    images: [
      {
        url: "https://www.pharmanecia.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pharmanecia 4.E Conference",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pharmanecia 4.E",
    description:
      "International Research Conference on AI and ML in Drug Discovery",
    images: ["https://www.pharmanecia.org/og-image.png"],
  },
};

export default function HomePage() {
  return (
    <>
      {" "}
      <ClientHomePage />
      <Script id="event-schema" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "Pharmanecia 4.E International Pharmacy Conference",
            "description": "International Research Conference on AI and ML in Drug Discovery",
            "startDate": "2025-03-07",
            "endDate": "2025-03-08",
            "location": {
              "@type": "Place",
              "name": "JSS College of Pharmacy",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Ooty",
                "addressCountry": "IN"
              }
            },
            "organizer": {
              "@type": "Organization",
              "name": "Pharmanecia",
              "url": "https://www.pharmanecia.org/"
            }
          }
        `}
      </Script>
    </>
  );
}
