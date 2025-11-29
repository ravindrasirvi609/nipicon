"use client";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <header className="bg-white text-black px-4 py-4 fixed w-full z-40 top-0 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href={"/"}>
            <h1 className="font-black text-3xl text-black">NIPiCON 2026</h1>
          </Link>

          <button className="lg:hidden focus:outline-none" onClick={toggleMenu}>
            {menuOpen ? (
              <AiOutlineClose size={24} />
            ) : (
              <AiOutlineMenu size={24} />
            )}
          </button>

          <nav className="hidden lg:flex">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className="hover:text-ochre transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/abstractForm"
                  className="hover:text-ochre transition duration-300"
                >
                  Abstract Submission
                </Link>
              </li>
              <li>
                <Link
                  href="/Registration"
                  className="hover:text-ochre transition duration-300"
                >
                  Registration
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {menuOpen && (
          <nav className="lg:hidden mt-4 bg-white shadow-md rounded-lg">
            <ul className="flex flex-col space-y-4 px-4 py-2">
              <li>
                <Link
                  href="/"
                  className="block hover:text-ochre transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/abstractForm"
                  className="block hover:text-ochre transition duration-300"
                >
                  Abstract Submission
                </Link>
              </li>
              <li>
                <Link
                  href="/Registration"
                  className="block hover:text-ochre transition duration-300"
                >
                  Registration
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
};

export default Navbar;
