import Image from "next/image";
import React from "react";

const SponsorsPartners = () => {
  return (
    <div className="bg-light text-primary px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center">
          Sponsors and Partners
        </h1>

        {/* Sponsor Logos */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-secondary text-center">
            Our Sponsors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-center">
            {/* Sponsor 1 */}
            <div className="flex justify-center">
              <Image
                src="/ANRFlogo.png"
                alt="Operant"
                className="h-24 w-auto"
                height={150}
                width={150}
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/operant.png"
                alt="Operant"
                className="h-24 w-auto"
                height={150}
                width={150}
              />
            </div>
            {/* Sponsor 2 */}
            <div className="flex justify-center">
              <Image
                src="/nextgen.png"
                alt="NextGen"
                className="h-24 w-auto"
                height={150}
                width={150}
              />
            </div>
            {/* Sponsor 3 */}
            <div className="flex justify-center">
              <Image
                src="/arpb.png"
                alt="ARPB"
                className="h-24 w-auto"
                height={150}
                width={150}
              />
            </div>
            {/* Sponsor 4 */}
            <div className="flex justify-center">
              <Image
                src="/jssnewlogo.png"
                alt="JSS"
                className="h-24 w-auto"
                height={150}
                width={150}
              />
            </div>
          </div>
        </div>

        {/* Knowledge Partners Logos */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-secondary text-center">
            Knowledge Partners
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 items-center">
            {/* Knowledge Partner 1 */}
            <div className="flex justify-center">
              <Image
                src="/YBP.png"
                alt="Knowledge Partner 1"
                className="h-24 w-auto"
                height={150}
                width={150}
              />
            </div>
            {/* Knowledge Partner 2 */}
            <div className="flex justify-center">
              <Image
                src="/dpu.png"
                alt="Knowledge Partner 2"
                className="h-24 w-auto"
                height={150}
                width={150}
              />
            </div>
          </div>
        </div>

        {/* Sponsor Opportunities */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-semibold mb-6 text-secondary text-center">
            Sponsor Opportunities
          </h2>
          <p className="text-lg leading-relaxed text-justify mb-4">
            Becoming a sponsor for our conference provides a unique opportunity
            to showcase your brand and connect with industry leaders,
            researchers, and professionals in the field of pharmaceutical
            research. Sponsorship can help you increase brand awareness,
            generate leads, and build valuable relationships.
          </p>
          <p className="text-lg leading-relaxed text-justify mb-4">
            We offer various sponsorship packages to suit your needs, including
            platinum, gold, silver, and bronze levels. Each level offers
            different benefits such as booth space, speaking opportunities, logo
            placement, and more.
          </p>
          <p className="text-lg leading-relaxed text-justify mb-4">
            If you are interested in becoming a sponsor, please contact us at{" "}
            <a
              href="mailto:info@pharmanecia.org"
              className="text-accent hover:underline"
            >
              info@pharmanecia.org
            </a>{" "}
            for more information and to receive a detailed sponsorship
            prospectus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SponsorsPartners;
