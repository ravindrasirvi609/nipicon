"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface InfiniteRibbonProps {
  text: string;
}

const InfiniteRibbon: React.FC<InfiniteRibbonProps> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textElement = textRef.current;
    const containerElement = containerRef.current;

    if (!textElement || !containerElement) return;

    // Clone the text element to create a seamless loop
    const clonedText = textElement.cloneNode(true) as HTMLElement;
    containerElement.appendChild(clonedText);

    // Create a GSAP timeline for smooth infinite animation
    const tl = gsap.timeline({ repeat: -1 });

    // Set initial positions for full-width animation
    gsap.set([textElement, clonedText], {
      x: containerElement.offsetWidth, // Start from the right edge of the container
      position: "absolute",
      left: 0,
    });

    // Animate both text elements for full-width effect
    tl.to([textElement, clonedText], {
      x: -textElement.offsetWidth, // Move to the left edge of the container
      duration: 20, // Increased duration for smoother animation
      ease: "linear", // Changed to linear for consistent speed
      stagger: {
        amount: 20 / 2, // Adjusted for seamless loop
      },
    });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="sticky w-full overflow-hidden bg-red z-10">
      <div ref={containerRef} className="relative whitespace-nowrap h-8">
        <div
          ref={textRef}
          className="inline-block text-white font-black text-2xl"
        >
          <span className="flex items-center gap-2">
            <span className="text-yellow-300">🔔</span>
            {text}
            <span className="ml-12">|</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default InfiniteRibbon;
