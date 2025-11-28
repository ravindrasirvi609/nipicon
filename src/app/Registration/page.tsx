import InfiniteRibbon from "@/components/InfiniteRibbon";
import RegistrationPlans from "@/components/RegistrationPlans";
import Link from "next/link";
import React from "react";

const Registration = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-primary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Registration</h1>
        <div className="mb-12">
          <p className="text-lg leading-relaxed text-justify mb-4">
            Registrations For Pharmanecia 4.E started from 1st August 2024.
          </p>
          <h2 className="text-3xl font-semibold mb-4 text-secondary">
            Registration Option
          </h2>
          <p className="text-lg leading-relaxed text-justify mb-4">
            Online Registration started from 1st August 2024. Registration is
            compulsory to participate in Pharmanecia 4.E. Online: Candidates
            have to register online by filling the form at our website.
          </p>
          <h3 className="text-2xl font-semibold mb-4 text-secondary">
            Cancellation and Refund Policy
          </h3>
          <p className="text-lg leading-relaxed text-justify mb-4">
            Amount paid for registration is non-refundable and non-transferable.
          </p>
          <h3 className="text-2xl font-semibold mb-4 text-secondary">
            Important Instructions
          </h3>
          <p className="text-lg leading-relaxed text-justify mb-4">
            Registration fee includes entry to all scientific sessions,
            conference kit, lunch, and refreshment.
          </p>
          <h3 className="text-2xl font-semibold mb-4 text-secondary">
            Mode of Payment
          </h3>
          <p className="text-lg leading-relaxed text-justify mb-4">
            Participants and paper presentation aspirants are required to make
            all online payments through the website payment gateway only.
          </p>
          <h3 className="text-2xl font-semibold mb-4 text-secondary">
            Accommodation
          </h3>
          <p className="text-lg leading-relaxed text-justify mb-4">
            Accommodation will be arranged on request in dormitories, hotels on
            additional charges. For more details, write to us at:
            <Link
              href="mailto:info@pharmanecia.org"
              className="text-accent ml-2"
            >
              info@pharmanecia.org
            </Link>
          </p>
        
          <p className="text-lg leading-relaxed text-justify mb-4">
            All prices mentioned are inclusive of GST.{" "}
          </p>
        </div>
        
        {/* Registration Plans */}
        <RegistrationPlans />
      </div>
    </div>
  );
};

export default Registration;
