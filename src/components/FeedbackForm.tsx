"use client";
import React, { useState, FormEvent } from "react";
import axios from "axios";

interface FeedbackFormData {
  email: string;
  name: string;
  overallSatisfaction: number;
  wouldRecommend: number;
  sessionQuality: number;
  keynoteSpeakers: number;
  panelDiscussions: number;
  workshopsAttended: Array<{
    workshopName: string;
    workshopRating: number;
    workshopComments?: string;
  }>;
  venueRating: number;
  foodAndBeverageRating: number;
  registrationProcessRating: number;
  networkingOpportunitiesRating: number;
  valueForMoneyRating: number;
  intendToAttendNextYear: string;
  howHeardAboutConference: string;
}

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    email: "",
    name: "",
    overallSatisfaction: 0,
    wouldRecommend: 0,
    sessionQuality: 0,
    keynoteSpeakers: 0,
    panelDiscussions: 0,
    workshopsAttended: [],
    venueRating: 0,
    foodAndBeverageRating: 0,
    registrationProcessRating: 0,
    networkingOpportunitiesRating: 0,
    valueForMoneyRating: 0,
    intendToAttendNextYear: "",
    howHeardAboutConference: "",
  });

  const [workshopInput, setWorkshopInput] = useState({
    name: "",
    rating: 0,
    comments: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("Rating") || name === "wouldRecommend"
          ? Number(value)
          : value,
    }));
  };

  const addWorkshop = () => {
    if (workshopInput.name && workshopInput.rating) {
      setFormData((prev) => ({
        ...prev,
        workshopsAttended: [
          ...prev.workshopsAttended,
          {
            workshopName: workshopInput.name,
            workshopRating: workshopInput.rating,
            workshopComments: workshopInput.comments || undefined,
          },
        ],
      }));
      setWorkshopInput({ name: "", rating: 0, comments: "" });
    }
  };

  const removeWorkshop = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workshopsAttended: prev.workshopsAttended.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/feedbackSubmit", formData);
      setMessage("Feedback submitted successfully! Thank you for your time.");
      alert("Feedback submitted successfully! Thank you for your time.");
      // Redirect to home page after successful submission
      window.location.href = "/";
      // Reset form
      setFormData({
        email: "",
        name: "",
        overallSatisfaction: 0,
        wouldRecommend: 0,
        sessionQuality: 0,
        keynoteSpeakers: 0,
        panelDiscussions: 0,
        workshopsAttended: [],
        venueRating: 0,
        foodAndBeverageRating: 0,
        registrationProcessRating: 0,
        networkingOpportunitiesRating: 0,
        valueForMoneyRating: 0,
        intendToAttendNextYear: "",
        howHeardAboutConference: "",
      });
      setStep(1);
    } catch (error) {
      setMessage("Error submitting feedback. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setStep((prevStep) => Math.min(prevStep + 1, totalSteps));
  };

  const prevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const RatingStars = ({
    name,
    value,
    max = 5,
    onChange,
  }: {
    name: string;
    value: number;
    max?: number;
    onChange: (name: string, value: number) => void;
  }) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(name, star)}
            className={`text-2xl ${
              star <= value ? "text-yellow-400" : "text-gray-300"
            } transition-colors duration-200 hover:text-yellow-400 focus:outline-none`}
            aria-label={`Rate ${star} out of ${max}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const handleStarRating = (name: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkshopStarRating = (rating: number) => {
    setWorkshopInput((prev) => ({
      ...prev,
      rating,
    }));
  };

  const renderProgressBar = () => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>
    );
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.email.trim() !== "" && formData.name.trim() !== "";
      case 2:
        return (
          formData.overallSatisfaction > 0 &&
          formData.sessionQuality > 0 &&
          formData.keynoteSpeakers > 0 &&
          formData.panelDiscussions > 0
        );
      case 3:
        return (
          formData.venueRating > 0 &&
          formData.foodAndBeverageRating > 0 &&
          formData.registrationProcessRating > 0 &&
          formData.networkingOpportunitiesRating > 0 &&
          formData.valueForMoneyRating > 0
        );
      case 4:
        return (
          formData.wouldRecommend > 0 &&
          formData.intendToAttendNextYear !== "" &&
          formData.howHeardAboutConference !== ""
        );
      default:
        return false;
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
      style={{
        backgroundImage: "url('/abstract-bg.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden backdrop-blur-lg border border-white/20 shadow-xl"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800 text-center">
            Conference Feedback
          </h1>
          <p className="mt-2 text-center text-gray-600">
            We value your opinion! Please share your thoughts on the conference.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {renderProgressBar()}

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Tell us about yourself
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/30 border border-white/40 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 backdrop-blur-sm transition"
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/30 border border-white/40 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 backdrop-blur-sm transition"
                    required
                    placeholder="John Doe"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Session Ratings */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Rate the Sessions
              </h2>

              <div className="space-y-6">
                {[
                  {
                    label: "Overall Satisfaction",
                    name: "overallSatisfaction",
                  },
                  { label: "Session Quality", name: "sessionQuality" },
                  { label: "Keynote Speakers", name: "keynoteSpeakers" },
                  { label: "Panel Discussions", name: "panelDiscussions" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-0">
                      {item.label} <span className="text-red-500">*</span>
                    </label>
                    <RatingStars
                      name={item.name}
                      value={
                        formData[item.name as keyof FeedbackFormData] as number
                      }
                      onChange={handleStarRating}
                    />
                  </div>
                ))}

                {/* Workshops Section */}
                {/* <div className="mt-8 p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Workshops Attended
                  </h3>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Workshop Name"
                        value={workshopInput.name}
                        onChange={(e) =>
                          setWorkshopInput((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="flex-1 px-4 py-2 rounded-lg bg-white/40 border border-white/40 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 backdrop-blur-sm transition"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <RatingStars
                          name="workshopRating"
                          value={workshopInput.rating}
                          onChange={(_, value) =>
                            handleWorkshopStarRating(value)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addWorkshop}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-200 whitespace-nowrap"
                        disabled={
                          !workshopInput.name || workshopInput.rating === 0
                        }
                      >
                        Add Workshop
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comments (Optional)
                      </label>
                      <textarea
                        placeholder="Share your thoughts about this workshop..."
                        value={workshopInput.comments}
                        onChange={(e) =>
                          setWorkshopInput((prev) => ({
                            ...prev,
                            comments: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 rounded-lg bg-white/40 border border-white/40 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 backdrop-blur-sm transition"
                        rows={2}
                      ></textarea>
                    </div>
                  </div>

                  {formData.workshopsAttended.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Added Workshops:
                      </h4>
                      <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                        {formData.workshopsAttended.map((workshop, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 rounded-lg bg-white/30 backdrop-blur-sm"
                          >
                            <div>
                              <p className="font-medium">
                                {workshop.workshopName}
                              </p>
                              <div className="flex items-center mt-1">
                                <span className="text-yellow-500 mr-1">
                                  {"★".repeat(workshop.workshopRating)}
                                  {"☆".repeat(5 - workshop.workshopRating)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({workshop.workshopRating}/5)
                                </span>
                              </div>
                              {workshop.workshopComments && (
                                <p className="text-sm text-gray-600 mt-1">
                                  &quot;{workshop.workshopComments}&quot;
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeWorkshop(index)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              aria-label="Remove workshop"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          )}

          {/* Step 3: Venue and Organization Ratings */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Rate the Venue & Organization
              </h2>

              <div className="space-y-6">
                {[
                  { label: "Venue & Facilities", name: "venueRating" },
                  { label: "Food & Beverage", name: "foodAndBeverageRating" },
                  {
                    label: "Registration Process",
                    name: "registrationProcessRating",
                  },
                  {
                    label: "Networking Opportunities",
                    name: "networkingOpportunitiesRating",
                  },
                  { label: "Value for Money", name: "valueForMoneyRating" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 px-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-0">
                      {item.label} <span className="text-red-500">*</span>
                    </label>
                    <RatingStars
                      name={item.name}
                      value={
                        formData[item.name as keyof FeedbackFormData] as number
                      }
                      onChange={handleStarRating}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Final Questions */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Just a Few More Questions
              </h2>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How likely are you to recommend this conference to others?
                    (0-10) <span className="text-danger">*</span>
                  </label>
                  <div className="flex flex-wrap justify-between gap-1">
                    {Array.from({ length: 11 }, (_, i) => i).map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleStarRating("wouldRecommend", num)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                          formData.wouldRecommend === num
                            ? num <= 3
                              ? "bg-danger text-white"
                              : num <= 7
                              ? "bg-yellow-500 text-white"
                              : "bg-green text-white"
                            : "bg-white/40 hover:bg-white/60"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>Not likely at all</span>
                    <span>Extremely likely</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you plan to attend next year?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="intendToAttendNextYear"
                    value={formData.intendToAttendNextYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/30 border border-white/40 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 backdrop-blur-sm transition"
                    required
                  >
                    <option value="">Select your answer</option>
                    {[
                      "Definitely",
                      "Probably",
                      "Unsure",
                      "Probably Not",
                      "Definitely Not",
                    ].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How did you hear about this conference?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="howHeardAboutConference"
                    value={formData.howHeardAboutConference}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/30 border border-white/40 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 backdrop-blur-sm transition"
                    required
                  >
                    <option value="">Select your answer</option>
                    {[
                      "Email",
                      "Social Media",
                      "Colleague",
                      "Website",
                      "Professional Organization",
                      "Other",
                    ].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Form navigation and submission */}
          <div className="mt-10 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Previous
              </button>
            ) : (
              <div></div>
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 flex items-center gap-2 ${
                  !isStepValid() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!isStepValid()}
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !isStepValid()}
                className={`px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition duration-200 flex items-center gap-2 ${
                  loading || !isStepValid()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
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
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Feedback
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-xl text-center ${
                message.includes("Error")
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-green-100 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Step indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(s)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                    step === s
                      ? "bg-blue-500 text-white"
                      : s < step
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  aria-label={`Go to step ${s}`}
                  disabled={s > step && !isStepValid()}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="px-8 py-4 bg-white/10 border-t border-white/20 text-center text-sm text-gray-500">
          Thank you for your feedback! All responses are confidential.
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
