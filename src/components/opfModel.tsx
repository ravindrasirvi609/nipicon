import Image from "next/image";
import Link from "next/link";
import React from "react";

const OpfModel: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full">
      <Link href="https://opf.org.in/" target="_blank" rel="noreferrer">
        <div className="inline-block transform transition duration-300 hover:scale-110">
          <span className="text-gray-500 pl-4 font-bold text-sm">
            Powered by
          </span>
          <Image src="/opflogo.png" alt="Logo" width={100} height={100} />
        </div>
      </Link>
    </div>
  );
};

export default OpfModel;
