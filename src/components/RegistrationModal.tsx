"use client";
import React, { useState } from "react";
import RegistrationForm from "./RegistrationFormNew";
import { Plan, RegistrationFormData } from "@/lib/interface";
import { useFirebaseStorage } from "@/app/hooks/useFirebaseStorage";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";

interface RegistrationModalProps {
  selectedPlan: Plan;
  onClose: () => void;
  onSuccess: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  selectedPlan,
  onClose,
  onSuccess,
}) => {
  const { uploadFile } = useFirebaseStorage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
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

    if (!formData.firstName) {
      errors.firstName = "First Name is required";
    }

    if (!formData.lastName) {
      errors.lastName = "Last Name is required";
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

    if (!formData.country) {
      errors.country = "Country is required";
    }

    if (!formData.gender) {
      errors.gender = "Gender is required";
    }

    if (!formData.paymentAmount) {
      errors.paymentAmount = "Payment Amount is required";
    }

    if (!formData.transactionId) {
      errors.transactionId = "Transaction ID / UTR is required";
    }

    if (!formData.bankName) {
      errors.bankName = "Bank Name is required";
    }

    if (!formData.branchName) {
      errors.branchName = "Branch Name is required";
    }

    if (!formData.paymentDate) {
      errors.paymentDate = "Payment Date is required";
    }

    if (!formData.paymentProofUrl) {
      errors.paymentProofUrl = "Payment Proof is required";
    }

    const isStudentPlan =
      selectedPlan.name.includes("Student") ||
      selectedPlan.name.includes("UG") ||
      selectedPlan.name.includes("PG");

    if (isStudentPlan && !formData.idCardUrl) {
      errors.idCardUrl = "ID Card / Letter from Institute is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const registrationType = selectedPlan.name;
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const newFormData = { ...formData, registrationType, name: fullName };

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
        onSuccess();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Register for{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              {selectedPlan.name}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <RegistrationForm
            formData={formData}
            onInputChange={handleInputChange}
            onImageUpload={handleImageUpload}
            errors={formErrors}
            selectedPlanName={selectedPlan.name}
          />

          {submitError && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
              <X className="w-5 h-5 flex-shrink-0" />
              <p>{submitError}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl z-10 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Submit Registration</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationModal;
