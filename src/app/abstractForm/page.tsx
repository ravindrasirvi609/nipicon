"use client";
import React from "react";
import AbstractForm from "@/components/AbstractFormNew";
import { Sparkles } from "lucide-react";

const AbstractFormPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-fuchsia-400/20 to-pink-400/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-indigo-100 dark:border-indigo-900/30 mb-6">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              NIPiCON 2026
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="block text-slate-900 dark:text-white">
              Abstract
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Submission
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Submit your research and contribute to the scientific community.
          </p>
        </div>

        <AbstractForm />
      </div>
    </div>
  );
};

export default AbstractFormPage;
