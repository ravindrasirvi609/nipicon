import InfiniteRibbon from "@/components/InfiniteRibbon";
import RegistrationPlans from "@/components/RegistrationPlans";
import Link from "next/link";
import React from "react";

const Registration = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-primary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Registration Plans */}
        <RegistrationPlans />
      </div>
    </div>
  );
};

export default Registration;
