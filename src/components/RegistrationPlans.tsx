"use client";
import React, { useState, useEffect } from "react";
import RegistrationForm from "./RegistrationForm";
import { Plan, RegistrationFormData } from "@/lib/interface";
import { useFirebaseStorage } from "@/app/hooks/useFirebaseStorage";
import axios from "axios";
import Link from "next/link";
import { plans } from "@/data";

const RegistrationPlans: React.FC = () => {
  const { uploadFile } = useFirebaseStorage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [includeGalaDinner, setIncludeGalaDinner] = useState(false);
  const [isProcessingTransaction, setIsProcessingTransaction] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    whatsappNumber: "",
    name: "",
    affiliation: "",
    designation: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    registrationType: "",
    needAccommodation: false,
    dietaryRequirements: "",
    specialAssistance: "",
    Salutations: "Mr.",
    imageUrl: "",
    dob: "",
    AadharNumber: "",
    memberId: "",
    institute: "",
    gender: "Male",
    abstractSubmitted: false,
    abstractId: null,
    includeGalaDinner: false,
  });
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (isProcessingTransaction && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isProcessingTransaction, countdown]);

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

  const handleGalaDinnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeGalaDinner(e.target.checked);
    setFormData((prevState) => ({
      ...prevState,
      includeGalaDinner: e.target.checked,
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

    if (selectedPlan?.name === "OPF/OBRF Members" && !formData.memberId) {
      errors.memberId = "Member ID is required for OPF/OBRF Members";
    }

    // Add more validations as needed

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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
        const registration = await registrationResponse.json();
        await makePayment(selectedPlan, registration.registration);
      } else {
        throw new Error("Failed to save registration");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setSubmitError(
        "Failed to submit registration. Please check the form and try again."
      );
    }
  };

  let totalAmount = 0;
  const makePayment = async (plan: Plan, registration: any) => {
    const res = await initializeRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      totalAmount = includeGalaDinner ? plan.spot + 1500 : plan.spot;

      // Create Razorpay order
      const orderResponse = await fetch("/api/razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalAmount }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const orderData = await orderResponse.json();

      const options = {
        name: "Operant Pharmacy Federation",
        currency: orderData.currency,
        amount: orderData.amount,
        order_id: orderData.id,
        description: `Payment for ${plan.name}`,
        handler: async function (response: any) {
          try {
            setIsProcessingTransaction(true);

            const transactionResponse = await axios.post(
              "/api/save-transaction",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: orderData.amount / 100,
                currency: orderData.currency,
                planName: plan.name,
                customerName: registration.name,
                customerEmail: registration.email,
                customerPhone: registration.whatsappNumber,
              }
            );

            window.location.href = `/abstractForm/${transactionResponse.data.registration._id}`;
          } catch (error) {
            console.error("Failed to save transaction:", error);
          } finally {
            setIsProcessingTransaction(false);

            closeModal();
          }
        },
        prefill: {
          name: registration.name,
          email: registration.email,
          contact: registration.whatsappNumber,
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Failed to initiate payment. Please try again.");
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
    className,
  }: {
    label: string;
    price: number;
    className?: string;
  }) => (
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium">{label}:</span>
      <span className={`text-lg font-bold ${className}`}>₹{price}</span>
    </div>
  );

  const RegistrationCard = ({ plan }: { plan: Plan }) => (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="bg-primary text-white py-4 px-6">
        <h3 className="text-2xl font-semibold">{plan.name}</h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{plan.description}</p>
        
        <PriceDisplay label="Spot" price={plan.spot} />
        <div className="mt-6">
          <button
            onClick={() => openModal(plan)}
            className="w-full bg-accent text-white font-semibold py-3 px-4 rounded-md hover:bg-secondary transition duration-300"
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
        <h2 className="text-4xl font-bold mb-8 text-center text-primary">
          Registration Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <RegistrationCard key={index} plan={plan} />
          ))}
          <div className="bg-white shadow-xl rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="bg-primary text-white py-4 px-6">
              <h3 className="text-2xl font-semibold">Accompanying Person</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Access Food Area and lunch, No Entry for scientific session
              </p>
              
              <PriceDisplay label="Spot" price={1770} />
              <div className="mt-6">
                <Link href={"https://rzp.io/l/g60dnQz"}>
                  <button className="w-full bg-accent text-white font-semibold py-3 px-4 rounded-md hover:bg-secondary transition duration-300">
                    Register Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {isProcessingTransaction ? (
              <div className="flex flex-col items-center justify-center h-64 p-6 bg-white shadow-lg rounded-lg">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-primary mb-4"></div>
                <p className="mt-2 text-xl font-semibold text-primary">
                  Please keep this window open. You will be automatically
                  redirected. Your transaction is being processed... Do not
                  refresh the page.
                </p>
                <p className="mt-1 text-md font-medium text-gray-600">
                  Please wait for{" "}
                  <span id="countdown" className="font-bold">
                    {countdown}
                  </span>{" "}
                  seconds...
                </p>
                <div className="mt-4">
                  <span className="text-lg font-semibold text-primary">
                    {countdown}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  Register for {selectedPlan?.name}
                </h2>
                <RegistrationForm
                  formData={formData}
                  onInputChange={handleInputChange}
                  onImageUpload={handleImageUpload}
                  errors={formErrors}
                  includeGalaDinner={includeGalaDinner}
                  handleGalaDinnerChange={handleGalaDinnerChange}
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
                      : "bg-accent text-white hover:bg-secondary"
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
                    `Register and Pay (₹${selectedPlan?.spot})`
                  )}
                </button>
                <button
                  onClick={closeModal}
                  className="mt-4 w-full bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationPlans;
