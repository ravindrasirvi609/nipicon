// app/components/EventStructuredData.tsx
import Script from "next/script";

const EventStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Pharmanecia 4.E International Research Conference",
    description:
      "Recent Advances in Artificial Intelligence and Machine learning driven drug discovery",
    startDate: "2025-03-07",
    endDate: "2025-03-08",
    location: {
      "@type": "Place",
      name: "JSS College of Pharmacy",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ooty",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Department of Pharmaceutical Chemistry, JSS College of Pharmacy",
    },
  };

  return (
    <Script id="event-structured-data" type="application/ld+json">
      {JSON.stringify(structuredData)}
    </Script>
  );
};

export default EventStructuredData;
