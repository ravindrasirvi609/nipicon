"use client";
import React, { useState } from "react";
import { Plan } from "@/lib/interface";
import { plans } from "@/data";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import RegistrationModal from "./RegistrationModal";

const RegistrationPlans: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const openModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  const handleSuccess = () => {
    setShowModal(false);
    setShowSuccessModal(true);
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
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {label}:
      </span>
      <span
        className={`text-lg font-bold text-indigo-600 dark:text-indigo-400 ${className}`}
      >
        {currency === "USD" ? "$" : "₹"}
        {price}
      </span>
    </div>
  );

  const RegistrationCard = ({ plan, index }: { plan: Plan; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-slate-800/40 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6 flex-grow">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {plan.name}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {plan.description}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <PriceDisplay
            label="Fees (before 30-Dec-2025)"
            price={plan.spot}
            currency={plan.currency}
          />
        </div>
      </div>

      <div className="relative p-6 pt-0 mt-auto">
        <button
          onClick={() => openModal(plan)}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Register Now
        </button>
      </div>
    </motion.div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {plans.map((plan, index) => (
          <RegistrationCard key={index} plan={plan} index={index} />
        ))}
      </div>

      {showModal && selectedPlan && (
        <RegistrationModal
          selectedPlan={selectedPlan}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-800"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Registration Successful!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Thank you for your registration. Your payment details have been
              submitted and are pending verification. You will receive a
              confirmation email shortly.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default RegistrationPlans;
