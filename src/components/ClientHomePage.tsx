"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AboutConference from "@/components/About";
import LatestNews from "@/components/LatestNews";
import ScheduleOverview from "@/components/ScheduleOverview";
import SpeakersHighlights from "@/components/SpeakersHighlights";
import SponsorsPartners from "@/components/SponsorsPartners";
import Testimonials from "@/components/Testimonials";
import VenueAccommodations from "@/components/VenueAccommodations";
import OpfModel from "@/components/opfModel";
import PharmaneciaScroll from "@/components/pharmanecia";
import FloatingElements from "./FloatingElements";
import { useTrackingContext } from "./TrackingProvider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ClientHomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useTrackingContext();

  useGSAP(() => {
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: "power3.out",
    });

    gsap.from(contentRef.current?.children || [], {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top 80%",
      },
    });
  });
  const handleRegisterClick = () => {
    trackEvent({
      eventType: "button_click",
      eventCategory: "engagement",
      eventAction: "click",
      eventLabel: "register_button",
    });
  };

  const handleSubmitAbstractClick = () => {
    trackEvent({
      eventType: "button_click",
      eventCategory: "engagement",
      eventAction: "click",
      eventLabel: "abstract_button",
    });
  };

  return (
    <>
      <div
        ref={heroRef}
        className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: 'url("/ooty/walpaper-1.jpg")',
        }}
      >
        <FloatingElements />
        <div className="absolute inset-0 bg-primary bg-opacity-50"></div>
        <div
          className="relative z-10 text-light text-center max-w-4xl px-4 py-8 bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-lg shadow-lg"
          ref={contentRef}
        >
          <p className="text-lg font-bold text-yellow-400">
            ANRF & DBT Sponsored
          </p>
          <h1 className="text-5xl md:text-7xl text-yellow-400 font-extrabold mb-4 bg-clip-text bg-gradient-to-r from-accent to-secondary">
            Pharmanecia 4.E
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            International Research Conference
          </h2>
          <h3 className="text-xl md:text-2xl font-medium mb-6 italic">
            &quot;Recent Advances in AI and ML Driven Drug Discovery&quot;
          </h3>
          <p className="text-lg md:text-xl mb-4 font-bold text-danger">
            7<sup>th</sup> and 8<sup>th</sup> March, 2025
          </p>
          <p className="text-md md:text-lg mb-8">
            Organized by Department of Pharmaceutical Chemistry, JSS College of
            Pharmacy, Ooty | Hosted by Operant Pharmacy Federation
          </p>
          <p className="text-lg mb-8 font-bold text-danger">
            Selected Research articles will be published in Scopus Indexed
            Journal
          </p>
          <p className="text-lg mb-8 font-bold text-yellow-500">
            Malaysian Journal of Medicine and Health Sciences (MJMHS)
          </p>
          <div className="space-x-4 ">
            <Link href="/Registration">
              <button
                className="bg-primary text-light px-8 py-3 rounded-full text-lg font-semibold hover:bg-danger transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 border-danger border-2"
                onClick={handleRegisterClick}
              >
                Register Now
              </button>
            </Link>
            {/* <Link href="/abstractForm">
              <button
                className="bg-primary text-light px-8 py-3 rounded-full text-lg font-semibold hover:bg-danger transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 border-danger border-2"
                onClick={handleSubmitAbstractClick}
              >
                Abstract
              </button>
            </Link> */}
            <Link href="https://docs.google.com/spreadsheets/d/13sDTucRm_zBFMm3w9jYzGpmEoJFsSPPlucPHkF0kSMk/edit?usp=sharing">
              <button className="bg-primary text-light px-8 py-3 m-2 rounded-full text-lg font-semibold hover:bg-danger transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 border-danger border-2">
                Poster Schedule
              </button>
            </Link>
            <Link href="https://docs.google.com/spreadsheets/d/1pB-DcLLU5gda1ZHdyYMJs2QN6pc_g6ZsicB1duVtDWY/edit?usp=sharing">
              <button className="bg-primary text-light px-8 py-3 m-2 rounded-full text-lg font-semibold hover:bg-danger transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 border-danger border-2">
                Oral Schedule
              </button>
            </Link>
          </div>
        </div>
      </div>

      <AboutConference />
      <PharmaneciaScroll />
      <SpeakersHighlights />
      <ScheduleOverview />
      <SponsorsPartners />
      <VenueAccommodations />
      <Testimonials />
      <LatestNews />
      <OpfModel />
    </>
  );
};

export default ClientHomePage;
