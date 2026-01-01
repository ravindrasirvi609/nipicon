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

        {/* Deadline Notification */}
        <div className="max-w-4xl mx-auto mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-amber-800">
                Submission Update
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p className="font-medium">
                  Abstract Submission Deadline: <span className="font-bold underline">31st Dec 2025 (Expired)</span>
                </p>
                <p className="mt-1 text-red-600 font-bold uppercase tracking-wider">
                  New submissions are now closed.
                </p>
                <p className="mt-2">
                  <span className="font-semibold text-amber-900">Note:</span> If you have already submitted, <span className="font-semibold">Resubmission / Revision</span> is still possible up to <span className="font-bold">5th Jan 2026</span> via your unique abstract link.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Visibility Logic */}
        <div className="max-w-4xl mx-auto transition-all duration-500">
          {new Date() > new Date("2026-01-01T00:00:00") ? (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m11 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Submission Closed</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-8">
                The window for submitting new abstracts for NIPiCON 2026 has officially closed. We thank all participants for their contributions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/"
                  className="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg hover:shadow-indigo-500/25"
                >
                  Return to Home
                </a>
              </div>
            </div>
          ) : (
            <AbstractForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default AbstractFormPage;
