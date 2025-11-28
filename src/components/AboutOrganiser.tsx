import Image from "next/image";
import React from "react";

const AboutOrganiser = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-primary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          About Organisers
        </h1>

        <div className="flex flex-col items-center mb-12">
          <Image
            src="/jsslogo.png"
            alt="JSS College of Pharmacy Logo"
            className="w-72 h-32 mb-6"
            width={158}
            height={128}
          />
          <h2 className="text-3xl font-semibold mb-4 text-secondary">
            ABOUT JSS COLLEGE OF PHARMACY, OOTY
          </h2>
          <p className="text-lg leading-relaxed text-justify">
            JSS College of Pharmacy, Ooty was Established in 1980. It is one of
            the pioneering research institutions in the country imparting
            quality pharmacy education at Diploma, graduate, post graduate and
            doctoral levels. The college is affiliated to JSS Academy of Higher
            Education & Research, Mysuru, which is accredited A++ Grade by NAAC.
            The College is ranked 4th in India by NIRF, MHRD, Govt. of India.
            The institution is accredited ‘A++’ grade by the National Assessment
            and Accreditation Council, New Dehli, for Pharm D Program and
            certified by ACPE, USA and approved by AICTE and Pharmacy Council of
            India. The institution deepened its roots by its state-of-the-art
            laboratories.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4 text-secondary">
            ABOUT DEPARTMENT OF PHARMACEUTICAL CHEMISTRY
          </h2>
          <p className="text-lg leading-relaxed text-justify">
            The Department of Pharmaceutical Chemistry was established in the
            year 1988. Several research projects has been sanctioned by the
            different government agencies like DBT, AICTE, UGC, CSIR, ICMR, DST
            etc. worth more than 300 Lakhs. The Department has been well
            equipped research laboratories with several advanced instruments
            like Microwave synthesizer, FT-IR Perkin Elmer Spectrum-2, Mini
            Block Parallel Synthesizer, Buchi Rotary Evaporator and Schrodinger
            Molecular Modeling Suit 2021, The Acclerys - Discovery studio etc.
            The overall aim of the Department is to provide highest quality
            pharmaceutical education at all levels and to provide a rich and
            conducive research environment to the students.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutOrganiser;
