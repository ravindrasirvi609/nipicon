import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const AnimatedIcons: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (containerRef.current) {
      const icons = containerRef.current.querySelectorAll(".icon");

      // Initial animation
      gsap.fromTo(
        icons,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
        }
      );

      // Individual animations
      icons.forEach((icon, index) => {
        const tl = gsap.timeline({ repeat: -1 });

        switch (index) {
          case 0: // Pill
            tl.to(icon, {
              x: "100%",
              y: "50%",
              duration: 10,
              ease: "sine.inOut",
            })
              .to(icon, {
                x: "0%",
                y: "100%",
                duration: 10,
                ease: "sine.inOut",
              })
              .to(icon, {
                x: "-100%",
                y: "50%",
                duration: 10,
                ease: "sine.inOut",
              })
              .to(icon, { x: "0%", y: "0%", duration: 10, ease: "sine.inOut" });
            break;
          case 1: // Microscope
            tl.to(icon, { rotation: 360, duration: 20, ease: "none" });
            break;
          case 2: // DNA
            tl.to(icon, { y: "-100%", duration: 5, ease: "power1.inOut" }).to(
              icon,
              { y: "100%", duration: 5, ease: "power1.inOut" }
            );
            break;
          case 3: // Research Paper
            tl.to(icon, { scale: 1.5, duration: 2, ease: "power2.inOut" }).to(
              icon,
              { scale: 1, duration: 2, ease: "power2.inOut" }
            );
            break;
        }
      });
    }
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none">
      {/* Pill Icon */}
      <svg
        className="icon w-12 h-12 text-blue-500 absolute left-1/4 top-1/4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M19.73 14.87L7.14 2.28a3 3 0 00-4.24 0 3 3 0 000 4.24L15.49 19.1a3 3 0 004.24 0 3 3 0 000-4.23zM5.13 5.28a1 1 0 011.41 0l2.64 2.63-1.41 1.41L5.13 6.7a1 1 0 010-1.42z" />
      </svg>

      {/* Microscope Icon */}
      <svg
        className="icon w-12 h-12 text-green-500 absolute right-1/4 top-1/4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.5 14.25a1 1 0 100-2 1 1 0 000 2zm1.5-4v-1a1 1 0 10-2 0v1h-1v-2a3 3 0 00-3-3h-1V4a1 1 0 10-2 0v1.25H8V4a1 1 0 10-2 0v1.25H5a3 3 0 00-3 3v2H1a1 1 0 100 2h1v4H1a1 1 0 100 2h1v.75A3 3 0 005 22h11.5a4.5 4.5 0 003.5-7.32V10.25h-1zM5 20a1 1 0 01-1-1v-9a1 1 0 011-1h9a1 1 0 011 1v9a1 1 0 01-1 1H5z" />
      </svg>

      {/* DNA Icon */}
      <svg
        className="icon w-12 h-12 text-purple-500 absolute left-1/4 bottom-1/4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M8.44 11.91l1.05-1.04a1 1 0 10-1.41-1.41l-1.05 1.04a1 1 0 101.41 1.41zm7.12 0a1 1 0 10-1.41-1.41l-1.05 1.04a1 1 0 101.41 1.41l1.05-1.04zM12 2a1 1 0 00-1 1v2a1 1 0 002 0V3a1 1 0 00-1-1zm0 16a1 1 0 00-1 1v2a1 1 0 002 0v-2a1 1 0 00-1-1zm9-7h-2a1 1 0 000 2h2a1 1 0 000-2zM5 11H3a1 1 0 000 2h2a1 1 0 000-2zm14.54-4.63l-1.41 1.41a1 1 0 101.41 1.41l1.41-1.41a1 1 0 10-1.41-1.41zM5.87 16.46l-1.41 1.41a1 1 0 101.41 1.41l1.41-1.41a1 1 0 10-1.41-1.41zm13.67 1.41l-1.41-1.41a1 1 0 10-1.41 1.41l1.41 1.41a1 1 0 101.41-1.41zM5.87 7.54L4.46 6.13a1 1 0 10-1.41 1.41l1.41 1.41a1 1 0 101.41-1.41z" />
      </svg>

      {/* Research Paper Icon */}
      <svg
        className="icon w-12 h-12 text-red-500 absolute right-1/4 bottom-1/4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 12H7v-2h10v2zm0-4H7V9h10v2z" />
      </svg>
    </div>
  );
};

export default AnimatedIcons;
