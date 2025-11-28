"use client";
import Image from "next/image";
import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const SpeakersHighlights = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.from(boxRef.current, {
      y: 50,
      opacity: 0,
      scrollTrigger: {
        trigger: boxRef.current,
        start: "top 70%",
        end: "top 10%",
        scrub: true,
      },
    });
  });

  return (
    <div className="bg-danger text-primary px-6 py-12" ref={boxRef}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-secondary text-center">
            Chief Patron
          </h2>
          <div className="grid grid-cols-1 gap-8">
            {/* First row with single centered patron */}
            <div className="flex justify-center">
              <div className="bg-white shadow-lg rounded-lg p-6 text-center w-full max-w-md">
                <Image
                  src="/vijaykarnataka.webp"
                  alt="Chief Patron"
                  className="w-32 h-32 mx-auto rounded-full mb-4"
                  height={150}
                  width={150}
                />
                <h3 className="text-xl font-semibold text-primary">
                  Jagadguru Sri Shivarathri Deshikendra Mahaswamiji
                </h3>
                <p className="text-sm text-gray-700 mt-2">
                  Chancellor of JSS Academy of Higher Education and Research,
                  Mysuru
                </p>
              </div>
            </div>

            {/* Second row with three patrons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <Image
                  src="/profile/chancellor.jpg"
                  alt="Pro Chancellor"
                  className="w-32 h-32 mx-auto rounded-full mb-4"
                  height={150}
                  width={150}
                />
                <h3 className="text-xl font-semibold text-primary">
                  Dr. B. Suresh
                </h3>
                <p className="text-sm text-gray-700 mt-2">
                  Pro Chancellor, JSSAHER, Mysuru
                </p>
              </div>

              <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <Image
                  src="/drbasavanagowdappa.jpg"
                  alt="Vice Chancellor"
                  className="w-32 h-32 mx-auto rounded-full mb-4"
                  height={150}
                  width={150}
                />
                <h3 className="text-xl font-semibold text-primary">
                  Dr. H. Basavanagowdappa{" "}
                </h3>
                <p className="text-sm text-gray-700 mt-2">
                  Vice Chancellor, JSSAHER, Mysuru
                </p>
              </div>

              <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <Image
                  src="/097A3252.jpg"
                  alt="Founder"
                  className="w-32 h-32 mx-auto rounded-full mb-4"
                  height={150}
                  width={150}
                />
                <h3 className="text-xl font-semibold text-primary">
                  Vikram Choudhary
                </h3>
                <p className="text-sm text-gray-700 mt-2">
                  Founder, Operant Pharmacy Federation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notable Sessions section remains unchanged */}
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-secondary text-center">
            Notable Sessions
          </h2>
          <div className="space-y-8">
            {/* Session 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-semibold text-primary mb-2">
                Emerging Trends in Drug Discovery
              </h3>
              <p className="text-lg text-gray-700">
                This session will cover the latest advancements in drug
                discovery, featuring presentations from leading researchers in
                the field.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Speakers: Announcing Soon
              </p>
            </div>

            {/* Session 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-semibold text-primary mb-2">
                Innovations in Pharmaceutical Technology
              </h3>
              <p className="text-lg text-gray-700">
                Explore the cutting-edge technologies that are shaping the
                future of pharmaceuticals in this insightful session.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Speakers: Announcing Soon
              </p>
            </div>

            {/* Session 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-2xl font-semibold text-primary mb-2">
                Regulatory Challenges and Solutions
              </h3>
              <p className="text-lg text-gray-700">
                Join us for a deep dive into the regulatory landscape,
                addressing challenges and proposing innovative solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakersHighlights;
