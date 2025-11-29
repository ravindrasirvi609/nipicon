"use client";
import React, { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import { Plan, RegistrationFormData } from "@/lib/interface";
import { useFirebaseStorage } from "@/app/hooks/useFirebaseStorage";
import { plans } from "@/data";

const RegistrationPlans: React.FC = () => {
  const { uploadFile } = useFirebaseStorage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    whatsappNumber: "",
    name: "",
    firstName: "",
    lastName: "",
    affiliation: "",
    designation: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    registrationType: "",
    applyingAs: "Individual",
    registeringAs: "Delegate",
    Salutations: "Mr.",
    imageUrl: "",
    dob: "",
    memberId: "",
    institute: "",
    gender: "Male",
    abstractSubmitted: false,
    abstractId: null,
    paymentAmount: 0,
    transactionId: "",
    bankName: "",
    branchName: "",
    paymentDate: "",
    paymentProofUrl: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadFile(file);
      setFormData((prevState) => ({
        ...prevState,
        imageUrl: imageUrl,
      }));
    } catch (error) {
      console.error("Failed to upload image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.imageUrl) {
      errors.imageUrl = "Image is required";
    }

    if (!formData.dob) {
      errors.dob = "Date of birth is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.whatsappNumber) {
      errors.whatsappNumber = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(formData.whatsappNumber)) {
      errors.whatsappNumber = "WhatsApp number must be 10 digits";
    }

    if (!formData.name) {
      errors.name = "Name is required";
    }

    if (!formData.affiliation) {
      errors.affiliation = "Affiliation is required";
    }

    if (!formData.designation) {
      errors.designation = "Designation is required";
    }

    if (!formData.address) {
      errors.address = "Address is required";
    }

    if (!formData.city) {
      errors.city = "City is required";
    }

    if (!formData.state) {
      errors.state = "State is required";
    }

    if (!formData.pincode) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
    }

    // Add more validations as needed

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      alert("Please select a plan before submitting.");
      return;
    }

    const registrationType = selectedPlan.name;

    const newFormData = { ...formData, registrationType };

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const registrationResponse = await fetch("/api/save-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFormData),
      });

      if (registrationResponse.ok) {
        setShowModal(false);
        setShowSuccessModal(true);
      } else {
        throw new Error("Failed to save registration");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setSubmitError(
        "Failed to submit registration. Please check the form and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const PriceDisplay = ({
    label,
    price,
    currency = "INR",
    className,
  }: {
    label: string;
    price: number;
    currency?: string;
    className?: string;
  }) => (
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-gray-700">{label}:</span>
      <span className={`text-lg font-bold text-indigo-900 ${className}`}>
        {currency === "USD" ? "$" : "₹"}
        {price}
      </span>
    </div>
  );

  const RegistrationCard = ({ plan }: { plan: Plan }) => (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-gray-200">
      <div className="bg-indigo-600 text-white py-4 px-6">
        <h3 className="text-2xl font-semibold">{plan.name}</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-800 mb-4 font-medium">{plan.description}</p>

        <PriceDisplay
          label="Fees (before 30-Dec-2025)"
          price={plan.spot}
          currency={plan.currency}
        />
        <div className="mt-6">
          <button
            onClick={() => openModal(plan)}
            className="w-full bg-amber-500 text-white font-bold py-3 px-4 rounded-md hover:bg-amber-600 transition duration-300 shadow-md"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-indigo-900">
          Registration Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <RegistrationCard key={index} plan={plan} />
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Register for {selectedPlan?.name}
            </h2>
            <RegistrationForm
              formData={formData}
              onInputChange={handleInputChange}
              onImageUpload={handleImageUpload}
              errors={formErrors}
              selectedPlanName={selectedPlan?.name}
            />
            {submitError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {submitError}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full font-bold py-3 px-6 rounded-md transition duration-300 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-500 text-white hover:bg-amber-600"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </div>
              ) : (
                "Submit Registration"
              )}
            </button>
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Registration Submitted Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your registration. Your payment details have been
              submitted and are pending verification by the admin. Once
              confirmed, you will receive your registration code via email.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPlans;
