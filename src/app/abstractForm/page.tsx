"use client";
import React, { useState } from "react";
import AbstractForm from "@/components/abstract-form";
import { FaWhatsapp } from "react-icons/fa";
import InfiniteRibbon from "@/components/InfiniteRibbon";

const AbstractFormPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmitClick = () => {
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#034C8C] to-[#022873] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-[#F2F2F2] rounded-lg shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl font-extrabold text-[#021373] text-center mb-8">
            Pharmanecia 4.E International Research Conference
          </h1>
          <h2 className="text-2xl font-bold text-[#022873] text-center mb-6">
            &quot;Recent Advances in Artificial Intelligence and Machine
            Learning Driven Drug Discovery&quot;
          </h2>
          <section className="mt-8 bg-[#D94814] p-6 my-2 rounded-lg shadow-md text-white">
            <p className="mb-4">
              The Pharmanecia Scientific Committee (PSC) invites delegates to
              submit their original scientific work as abstracts for
              presentation during the Congress as Poster and/or Oral
              presentations.
            </p>
          </section>
          <InfiniteRibbon text="Abstact Submission Closed" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <section className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#021373] mb-4">
                  Areas of Specialization
                </h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Pharmaceutical Technology</li>
                  <li>Medicinal Chemistry</li>
                  <li>
                    Pharmacognosy, Indigenous Drugs, Herbal Formulations, and
                    Phytochemistry
                  </li>
                  <li>
                    Pharmacology and Toxicology, Clinical Research &
                    Pharmacovigilance
                  </li>
                  <li>Pharmaceutical Analysis and Quality Assurance</li>
                  <li>Biopharmaceutics, Pharmacokinetics & Drug Metabolism</li>
                  <li>Biotechnology and Biotherapeutics</li>
                  <li>Hospital, Community, and Clinical Pharmacy</li>
                  <li>Pharmaceutical Education and Professional Pharmacy</li>
                  <li>Drug Regulatory Affairs & Pharmaceutical Management</li>
                  <li>Pharmacoeconomics and Pharmacoepidemiology</li>
                  <li>
                    Artificial Intelligence / Bioinformatics / Data Analytics
                  </li>
                </ul>
              </section>

              <section className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#021373] mb-4">
                  Abstract Content
                </h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>
                    The abstract should summarize the work proposed to be
                    presented, including the objectives, methods, results, and
                    conclusions.
                  </li>
                  <li>
                    Abstracts must be original and not previously published or
                    presented at another conference.
                  </li>
                  <li>Font: Times New Roman</li>
                  <li>Title: Font Size 14 + Bold</li>
                  <li>Abstract Body Content: Justified</li>
                  <li>
                    Author Name, Affiliation & Abstract Body: Font Size 12
                  </li>
                  <li>Word Limit: Between 250 - 350</li>
                </ul>
              </section>
            </div>

            <div className="space-y-8">
              <section className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#021373] mb-4">
                  <span className="mb-2 text-danger">*</span>{" "}
                  <span className="underline font-extrabold">
                    Presentation Guidelines & Rewards{" "}
                  </span>
                  <span className="mb-2 text-danger">*</span>{" "}
                  <span className="text-rose-700 font-black">NEW</span>
                </h3>
                <ul className="list-disc pl-5 text-gray-900 font-bold space-y-2">
                  <li>
                    Detailed guidelines for Poster and Oral presentations will
                    be provided upon acceptance of the abstract.
                  </li>
                  <li>
                    Presenters must be registered delegates of Pharmanecia 4.E.
                  </li>
                  <li>
                    The best Poster and/or Oral presentations in each category
                    will receive a certificate and a memento.
                  </li>
                </ul>
                <div className="mt-4 space-x-4">
                  <div className="space-x-4">
                    <a
                      href="https://drive.google.com/file/d/1snS7wVgvWNMpYcspm64NGdut7Scaw4EH/view?usp=drive_link"
                      className="text-[#034C8C] hover:text-[#000000] font-bold underline transition duration-300"
                      target="_blank"
                    >
                      E-Poster Guidelines
                    </a>
                    <a
                      href="https://drive.google.com/file/d/1Il3gOfu8gX08YNSMIYg-5BvhBHF2xIjC/view?usp=drive_link"
                      className="text-[#034C8C] hover:text-[#000000] font-bold underline transition duration-300"
                      target="_blank"
                    >
                      Oral Presentation Guidelines
                    </a>
                  </div>
                  <div className="space-x-4">
                    <a
                      href="https://docs.google.com/presentation/d/1pkbJpXhOLFmKiG9b6LShlvDu5yk-pmDH/edit?usp=drive_link&ouid=103671804461735791187&rtpof=true&sd=true"
                      className="text-[#034C8C] hover:text-[#000000] font-bold underline transition duration-300"
                      target="_blank"
                    >
                      E-Poster Template
                    </a>
                    <a
                      href="https://docs.google.com/presentation/d/102BO878wzDGZkZrsZOegjKnE57GtOqEv/edit?usp=drive_link&ouid=103671804461735791187&rtpof=true&sd=true"
                      className="text-[#034C8C] hover:text-[#000000] font-bold underline transition duration-300"
                      target="_blank"
                    >
                      Oral Presentation Template
                    </a>
                  </div>
                </div>
              </section>
              <section className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#021373] mb-4">
                  Submission Instructions
                </h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>
                    The abstract should be prepared according to the guidelines
                    provided on the website.
                  </li>
                  <li>
                    Submit the abstract in the prescribed format and paste it
                    into the designated space on the submission portal.
                  </li>
                  <li>Abstracts must be submitted online only.</li>
                  <li>
                    {" "}
                    <strong>
                      The deadline for submission is 31 January, 2025.
                    </strong>
                  </li>
                  <li>
                    A model abstract is available for reference on the website.
                  </li>
                </ul>
                <div className="mt-4 space-x-4">
                  <a
                    href="https://docs.google.com/document/d/1XNRgI2o0S6oaC0quxcxj0Aw0CVV93Ft3/edit?usp=sharing&ouid=108384988200604232400&rtpof=true&sd=true"
                    className="text-[#034C8C] hover:text-[#000000] font-bold underline transition duration-300"
                  >
                    PHARMANECIA MODEL ABSTRACT
                  </a>
                </div>
              </section>

              <section className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-[#021373] mb-4">
                  Review Process
                </h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>All submitted abstracts will be reviewed by the PSC.</li>
                  <li>
                    Selected abstracts will be notified for Poster and/or Oral
                    presentation.
                  </li>
                  <li>
                    The best Poster and/or Oral presentations will be selected
                    from each category and announced during the valedictory
                    function.
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* <section className="mt-8 bg-[#D94814] p-6 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-semibold mb-4">Submit Abstract</h3>
            <button
              onClick={handleSubmitClick}
              className="bg-white text-[#D94814] hover:bg-[#F2F2F2] font-bold py-2 px-4 rounded transition duration-300"
            >
              Submit Abstract
            </button>
          </section> */}

          {showDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full text-black">
                <h2 className="text-xl font-semibold mb-4">
                  Important Instructions
                </h2>
                <div className="mb-4">
                  <p className="mb-2">
                    Please read the following instructions carefully before
                    submitting your abstract:
                  </p>
                  <ul className="list-disc pl-5 mb-4">
                    <li>
                      Ensure your abstract is original and not previously
                      published.
                    </li>
                    <li>
                      Follow the guidelines provided on the website for abstract
                      preparation.
                    </li>
                    <li>Submit only one abstract per presenting author.</li>
                    <li>Double-check all information before submission.</li>
                    <li className="font-bold">
                      Please note that if you have submitted multiple abstracts,
                      you will not be eligible for conference registration.{" "}
                    </li>
                  </ul>
                  <p className="mb-2">
                    If you encounter any technical issues, please contact our
                    support team:
                  </p>
                  <div className="flex items-center">
                    <FaWhatsapp className="mr-2" size={24} />
                    <a
                      href="https://wa.me/918107199052"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      +91 8107199052
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleDialogClose}
                  className="bg-[#D94814] text-white hover:bg-[#C13700] font-bold py-2 px-4 rounded transition duration-300"
                >
                  Proceed to Submit
                </button>
              </div>
            </div>
          )}

          {showForm && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <AbstractForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbstractFormPage;
