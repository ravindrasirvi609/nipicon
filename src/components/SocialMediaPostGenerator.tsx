"use client";

import React, { useState } from "react";
import Html2Canvas from "html2canvas";
import Image from "next/image";
import SocialMediaPost from "./NewSocialMediaPost";

const badgeTypes = {
  speaker: "Keynote Speaker",
  panelist: "Panelist",
  moderator: "Moderator",
  organizer: "Organizer",
  sponsor: "Sponsor",
  attendee: "Attendee",
  student: "Student",
  researcher: "Researcher",
} as const;

const backgroundPatterns = {
  none: "none",
  dots: "dots",
  lines: "lines",
  hexagon: "hexagon",
  molecules: "molecules",
} as const;

interface SocialMediaPostGeneratorProps {}

const SocialMediaPostGenerator: React.FC<
  SocialMediaPostGeneratorProps
> = () => {
  const [formData, setFormData] = useState({
    name: "",
    affiliation: "",
    designation: "",
    gradientStart: "#F5F5F5",
    gradientEnd: "#FFFFFF",
    badge: "" as keyof typeof badgeTypes | "",
    backgroundPattern: "none" as keyof typeof backgroundPatterns,
    aspectRatio: "square" as "square" | "story" | "banner",
    customMessage: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleDownload = async () => {
    if (!formData.name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!imageFile) {
      alert("Please upload a profile image");
      return;
    }

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
          name={formData.name}
          affiliation={formData.affiliation}
          designation={formData.designation}
          imageUrl={imagePreview}
          theme="default"
          layout="classic"
          badge={formData.badge || undefined}
          backgroundPattern={formData.backgroundPattern}
          aspectRatio={formData.aspectRatio}
          customMessage={formData.customMessage || undefined}
          customColors={{
            gradientStart: formData.gradientStart,
            gradientEnd: formData.gradientEnd,
          }}
        />
      );
      await new Promise((resolve) => {
        require("react-dom").render(socialMediaPost, tempDiv, resolve);
      });

      // Use html2canvas to capture the rendered component
      const canvasDimensions = {
        square: { width: 1080, height: 1080 },
        story: { width: 1080, height: 1920 },
        banner: { width: 1920, height: 1080 },
      };

      const dimensions = canvasDimensions[formData.aspectRatio];

      const canvas = await Html2Canvas(tempDiv, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Enable CORS for image loading
        width: dimensions.width,
        height: dimensions.height,
      });

      // Create and trigger download
      const link = document.createElement("a");
      link.download = `ipc2025-${formData.aspectRatio}-post-${formData.name
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Error generating image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#021373] to-[#D94814] rounded-full mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#021373] to-[#D94814] bg-clip-text text-transparent mb-2">
            Create Your Social Media Post
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Fill in your details to generate a custom 74th Indian Pharmaceutical
            Congress 2025 social media post
          </p>
        </div>

        {/* Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#021373] to-[#D94814] rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Enter Your Information
              </h2>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="flex items-center text-sm font-semibold text-gray-700"
                >
                  <span className="bg-gradient-to-r from-[#021373] to-[#D94814] bg-clip-text text-transparent">
                    Name
                  </span>
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    required
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>

              {/* Affiliation Field */}
              <div className="space-y-2">
                <label
                  htmlFor="affiliation"
                  className="block text-sm font-semibold text-gray-700"
                >
                  College/Company Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="affiliation"
                    name="affiliation"
                    value={formData.affiliation}
                    onChange={handleInputChange}
                    placeholder="Enter your college or company name"
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200 text-gray-800 placeholder-gray-400"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>

              {/* Designation Field */}
              <div className="space-y-2">
                <label
                  htmlFor="designation"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Designation
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="e.g., Student, Professor, Researcher"
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200 text-gray-800 placeholder-gray-400"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 absolute left-3 top-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8m0 0V4"
                    />
                  </svg>
                </div>
              </div>

              {/* Custom Message */}
              <div className="space-y-3">
                <label
                  htmlFor="customMessage"
                  className="block text-sm font-semibold text-gray-700"
                >
                  💬 Custom Message (Optional)
                </label>
                <div className="relative">
                  <textarea
                    id="customMessage"
                    name="customMessage"
                    value={formData.customMessage}
                    onChange={handleInputChange}
                    placeholder="e.g., Excited to share my research at IPC 2025!"
                    maxLength={100}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {formData.customMessage.length}/100
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Leave empty to use default message: &quot;Hey! I&apos;m
                  Attending 74th IPC 2025&quot;
                </p>
              </div>

              {/* Modern Image Upload Field */}
              <div className="space-y-4">
                <label
                  htmlFor="image"
                  className="flex items-center text-sm font-semibold text-gray-700"
                >
                  <span className="bg-gradient-to-r from-[#021373] to-[#D94814] bg-clip-text text-transparent">
                    Profile Image
                  </span>
                  <span className="text-red-500 ml-1">*</span>
                </label>

                {!imagePreview ? (
                  <div
                    className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group overflow-hidden ${
                      isDragOver
                        ? "border-indigo-500 bg-indigo-50 scale-102"
                        : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <div className="px-8 py-12 text-center">
                      <div className="mx-auto w-16 h-16 mb-4 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#021373] to-[#D94814] rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center w-full h-full">
                          <svg
                            className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
                          {isDragOver
                            ? "Drop your image here"
                            : "Upload Profile Image"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Drag and drop your image here, or{" "}
                          <span className="text-indigo-600 font-medium group-hover:text-indigo-700">
                            click to browse
                          </span>
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-xs text-gray-400 mt-4">
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Max 5MB
                          </span>
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            JPG, PNG, GIF, WebP
                          </span>
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h12a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 010 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 010 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            1:1 aspect ratio
                          </span>
                        </div>
                      </div>
                    </div>

                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      required
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 transition-all duration-300">
                    <div className="flex items-start space-x-6">
                      <div className="relative group flex-shrink-0">
                        <div className="relative">
                          <Image
                            src={imagePreview}
                            alt="Profile Preview"
                            width={100}
                            height={100}
                            className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl ring-2 ring-green-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-200"></div>
                        </div>
                        <button
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow-lg transform hover:scale-110 transition-all duration-200 ring-2 ring-white"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <h4 className="text-green-800 font-semibold text-sm">
                            Image uploaded successfully
                          </h4>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-green-700 font-medium truncate">
                            {imageFile?.name}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-green-600">
                            <span className="flex items-center">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                              </svg>
                              {(imageFile?.size || 0) / 1024 / 1024 < 1
                                ? `${Math.round(
                                    (imageFile?.size || 0) / 1024
                                  )} KB`
                                : `${(
                                    (imageFile?.size || 0) /
                                    1024 /
                                    1024
                                  ).toFixed(1)} MB`}
                            </span>
                            <span className="flex items-center">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {imageFile?.type.split("/")[1]?.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            document.getElementById("image")?.click()
                          }
                          className="mt-3 inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors duration-200"
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            />
                          </svg>
                          Change Image
                        </button>
                      </div>
                    </div>

                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="text-center space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8">
            <button
              onClick={handleDownload}
              disabled={isLoading || !formData.name.trim() || !imageFile}
              className={`group relative px-8 py-4 bg-gradient-to-r from-[#021373] to-[#D94814] text-white font-bold rounded-2xl hover:from-[#D94814] hover:to-[#021373] transition-all duration-300 flex items-center space-x-3 shadow-xl mx-auto transform hover:scale-105 disabled:hover:scale-100 mb-8 ${
                isLoading || !formData.name.trim() || !imageFile
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-2xl"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#021373] to-[#D94814] rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-3">
                {isLoading ? (
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
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
                <span className="text-lg">
                  {isLoading ? "Generating..." : "Download Social Media Post"}
                </span>
              </div>
            </button>

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#021373] to-[#D94814] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      Share & Win Prizes!
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Download and share this image on LinkedIn to showcase your
                      participation in 74th Indian Pharmaceutical Congress 2025!
                    </p>
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">
                      Don&apos;t forget to tag:
                    </span>{" "}
                    <span className="font-bold text-[#021373]">
                      Association of Pharmaceutical Teachers of India
                    </span>{" "}
                    and{" "}
                    <span className="font-bold text-[#D94814]">
                      Operant Pharmacy Federation
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Use hashtags:</span>{" "}
                    <span className="font-bold text-[#D94814]">#IPC2025</span>{" "}
                    <span className="font-bold text-[#021373]">#OPF</span>
                  </p>
                  <p className="text-sm font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full inline-block">
                    🎁 Lucky participants who share will be eligible for
                    exciting prizes on the day of the conference!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPostGenerator;
