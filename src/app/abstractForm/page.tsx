"use client";
import React from "react";
import AbstractForm from "@/components/abstract-form";

const AbstractFormPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#034C8C] to-[#022873] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <AbstractForm />
      </div>
    </div>
  );
};

export default AbstractFormPage;
