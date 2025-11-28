import Image from "next/image";
import React from "react";

const AboutHost = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-primary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Host</h1>

        <div className="flex flex-col items-center mb-12">
          <Image
            src="https://opf.org.in/wp-content/uploads/2019/07/Final-OPF-1-1.png"
            alt="Operant Pharmacy Federation Logo"
            className="w-32 h-32 mb-6"
            width={128}
            height={128}
          />
          <h2 className="text-3xl font-semibold mb-4 text-secondary">
            Operant Pharmacy Federation (OPF)
          </h2>
          <p className="text-lg leading-relaxed text-justify">
            Operant Pharmacy Federation (OPF) aims to spread more about the
            Pharmacy Profession by organising different exhibitions,
            conferences, workshops, seminars, and camps. We feel proud that OPF
            is one of the internationally recognised easels for Biomedical and
            Pharmaceutical study. With high-quality reviews, original research
            work, short communications, Ethics Forum, case report, Education
            Forum, and others, we aim to contribute our best efforts in the
            field of Pharmacy & Biomedical.
          </p>
        </div>

        <div className="mb-12">
          <p className="text-lg leading-relaxed text-justify">
            At Operant Pharmacy Federation (OPF), we are working hard to create
            a positive impact in the field of global healthcare. We are focusing
            on research works, wellness, community pharmacy, along with the
            arrangement of national and international conventions, promotions of
            causes related to the pharmaceutical industry and ethical business
            practices, that are essential to ensure the success of our pharmacy
            profession.
          </p>
        </div>

        <div>
          <p className="text-lg leading-relaxed text-justify">
            We are extremely glad to help the researchers in their dissertation
            works as we believe that all the researchers are contributing
            equally to the field of Pharmacy and Biomedical. Our editors help
            them in their works and honour them for their efforts in the same
            field. The research papers are also made available online which
            helps the students and other researchers in knowing more about the
            industry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutHost;
