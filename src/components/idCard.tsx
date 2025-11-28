"use client";

import React, { useState } from "react";
import Html2Canvas from "html2canvas";
import SocialMediaPost from "./SocialMediaPost"; // Make sure the import path is correct

interface SocialShareCardProps {
  name: string;
  affiliation?: string;
  imageUrl: string;
}

const SocialShareCard: React.FC<SocialShareCardProps> = ({
  name,
  affiliation,
  imageUrl,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // Create a temporary div to render the SocialMediaPost
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      document.body.appendChild(tempDiv);

      // Render the SocialMediaPost component into the temporary div
      const socialMediaPost = (
        <SocialMediaPost
          name={name}
          affiliation={affiliation || ""}
          imageUrl={imageUrl}
        />
      );
      await new Promise((resolve) => {
        require("react-dom").render(socialMediaPost, tempDiv, resolve);
      });

      // Use html2canvas to capture the rendered component
      const canvas = await Html2Canvas(tempDiv, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Enable CORS for image loading
        width: 1080,
        height: 1080,
      });

      // Create and trigger download
      const link = document.createElement("a");
      link.download = "social-share-card.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className={`px-6 py-3 bg-gradient-to-r from-[#021373] to-[#D94814] text-white font-semibold rounded-full hover:from-[#D94814] hover:to-[#021373] transition-all duration-300 flex items-center space-x-2 shadow-lg ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}
        <span>
          {isLoading ? "Generating..." : "Generate Social Media Post"}
        </span>
      </button>
      <div className="text-center text-lg text-gray-600 max-w-md">
        <p>
          Download and share this image on LinkedIn to showcase your
          participation in Pharmanecia 4.E!
        </p>
        <p className="mt-2">
          Don&apos;t forget to tag{" "}
          <span className="font-bold">Operant Pharmacy Federation</span> and use
          the hashtag{" "}
          <span className="font-semibold text-blue-600">#Pharmanecia4E</span>.
        </p>
        <p className="mt-2 text-indigo-600 font-bold">
          Lucky participants who share will be eligible for exciting prizes on
          the day of the conference!
        </p>
      </div>
    </div>
  );
};

export default SocialShareCard;
