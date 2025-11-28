import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AccommodationPlans from "./AccommodationPlans";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const VenueAccommodations = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const venueRef = useRef(null);
  const mapRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const venue = venueRef.current;
    const map = mapRef.current;

    gsap.fromTo(
      section,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      title,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      venue,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: venue,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      map,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: map,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative bg-cover bg-center bg-fixed text-white px-6 py-24"
      style={{
        backgroundImage:
          "url('https://www.ghumindiaghum.com/images/Package/3uc9qMr5L3/Ooty-hill-station.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative max-w-7xl mx-auto z-10">
        <h1
          ref={titleRef}
          className="text-5xl font-bold mb-12 text-center text-yellow-300"
        >
          Venue and Accommodations
        </h1>

        {/* Venue Details */}
        <div
          ref={venueRef}
          className="mb-12 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8"
        >
          <h2 className="text-4xl font-semibold mb-6 text-yellow-100 text-center">
            Venue Details
          </h2>
          <p className="text-xl leading-relaxed mb-8">
            The conference will be held at the JSS College of Pharmacy, Ooty, a
            premier institution known for its excellent facilities and beautiful
            surroundings. The venue is easily accessible and offers a conducive
            environment for learning and networking.
          </p>
          <div ref={mapRef} className="overflow-hidden rounded-lg shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.0883078143543!2d76.70452457581243!3d11.401132147358766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8bd9f179dd8ed%3A0xe380d17adde20a10!2sJSS%20College%20Of%20Pharmacy%20Ooty!5e0!3m2!1sen!2sin!4v1721646776209!5m2!1sen!2sin"
              width="600"
              height="450"
              allowFullScreen={true}
              loading="lazy"
              className="w-full h-96 border-0"
            ></iframe>
          </div>
        </div>

        {/* Accommodation Information */}
        <AccommodationPlans />
      </div>
    </div>
  );
};

export default VenueAccommodations;
