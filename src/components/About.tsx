import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AboutConference: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const themesRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (titleRef.current) {
      gsap.from(titleRef.current, {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
      });
    }

    if (introRef.current) {
      gsap.from(introRef.current.children, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: introRef.current,
          start: "top 80%",
        },
      });
    }

    if (themesRef.current) {
      gsap.from(themesRef.current.children, {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: themesRef.current,
          start: "top 80%",
        },
      });
    }

    if (goalRef.current) {
      gsap.from(goalRef.current, {
        duration: 1,
        scale: 0.9,
        opacity: 0,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: goalRef.current,
          start: "top 90%",
        },
      });
    }
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-primary px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 ref={titleRef} className="text-5xl font-bold mb-12 text-center">
          About the Conference
        </h1>

        <div ref={introRef} className="mb-16">
          <h2 className="text-3xl font-semibold mb-4 text-secondary">
            Brief Introduction
          </h2>
          <p className="text-lg leading-relaxed">
            The International Research Conference on &quot;Recent Advances in
            Artificial Intelligence and Machine Learning Driven Drug
            Discovery&quot; is an esteemed event organized by the Department of
            Pharmaceutical Chemistry at JSS College of Pharmacy, Ooty and Hosted
            by Operant Pharmacy Federation. This conference aims to explore the
            cutting-edge intersection of AI, machine learning, and drug
            discovery, bringing together a diverse group of researchers, data
            scientists, pharmaceutical experts, and students to engage in
            groundbreaking discussions and collaborations.
          </p>
        </div>

        <div ref={themesRef} className="mb-16">
          <h2 className="text-3xl font-semibold mb-4 text-secondary">
            Themes and Objectives
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            The conference will cover a wide range of topics related to AI and
            ML in drug discovery, including but not limited to:
          </p>
          <ul className="list-disc list-inside mb-6 text-lg space-y-2 pl-4">
            <li>AI-driven target identification and validation</li>
            <li>
              Machine learning models for predicting drug-target interactions
            </li>
            <li>Deep learning approaches in de novo drug design</li>
            <li>
              AI applications in high-throughput screening and lead optimization
            </li>
            <li>Predictive modeling for ADMET properties</li>
            <li>
              Ethical considerations and regulatory challenges in AI-driven drug
              discovery
            </li>
          </ul>
          <p className="text-lg leading-relaxed">
            The main objective of this event is to foster a collaborative
            environment where AI researchers, data scientists, pharmaceutical
            experts, and students can share their insights and engage in
            fruitful discussions about the transformative potential of AI and
            machine learning in revolutionizing the drug discovery process.
          </p>
        </div>

        <div
          ref={goalRef}
          className="bg-accent text-white p-6 rounded-lg shadow-lg"
        >
          <p className="text-xl font-bold text-center">
            THE GOAL OF THIS CONFERENCE IS TO BRIDGE THE GAP BETWEEN ARTIFICIAL
            INTELLIGENCE, MACHINE LEARNING, AND PHARMACEUTICAL RESEARCH, PAVING
            THE WAY FOR INNOVATIVE APPROACHES IN DRUG DISCOVERY AND DEVELOPMENT.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutConference;
