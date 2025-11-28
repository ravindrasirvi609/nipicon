import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const PharmaneciaScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (
      containerRef.current &&
      textRef.current &&
      videoRef.current &&
      overlayRef.current
    ) {
      const textWidth = textRef.current.offsetWidth;
      const windowWidth = window.innerWidth;

      // Text animation
      gsap.to(textRef.current, {
        x: -(textWidth - windowWidth),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${textWidth}`,
          pin: true,
          scrub: 1,
        },
      });

      // Video scale animation
      gsap.to(videoRef.current, {
        scale: 1.1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Overlay opacity animation
      gsap.to(overlayRef.current, {
        opacity: 0.7,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Text opacity and scale animation
      gsap.to(textRef.current, {
        opacity: 0.8,
        scale: 0.95,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-[80vh] sm:h-[100vh] md:h-[110vh] overflow-hidden relative"
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/ooty.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        ref={overlayRef}
        className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"
      ></div>
      <div
        ref={textRef}
        className="text-[30vw] sm:text-[35vw] md:text-[40vw] font-bold whitespace-nowrap absolute top-1/2 left-0 transform -translate-y-1/2 px-[20vw] sm:px-[30vw] md:px-[50vw] text-white"
      >
        PHARMANECIA 4.E
      </div>
    </div>
  );
};

export default PharmaneciaScroll;
