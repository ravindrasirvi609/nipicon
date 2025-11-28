"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import InstallPWA from "./InstallPWA";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
      // setShowInstallPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleInstall = () => {
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  return (
    <>
      <header className="bg-white text-black px-4 py-4 fixed w-full z-40 top-0 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href={"/"}>
            <h1 className="font-black text-3xl text-black">PHARMANECIA 4.E</h1>
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
              <li className="relative group">
                <Link
                  href="#"
                  className="hover:text-ochre transition duration-300"
                >
                  About
                </Link>
                <ul className="absolute left-0 mt-2 space-y-2 bg-white text-black border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <li>
                    <Link
                      href="/host"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      About Host
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/organization"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      About Organisation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/organisingCommittee"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Organising Committee
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ooty"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      About Ooty
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href="/Schedule"
                  className="hover:text-ochre transition duration-300"
                >
                  Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/speaker"
                  className="hover:text-ochre transition duration-300"
                >
                  Speakers
                </Link>
              </li>
              <li>
                <Link
                  href="/Sponsors"
                  className="hover:text-ochre transition duration-300"
                >
                  Sponsors
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
              <li>
                <Link
                  href="/Contact"
                  className="hover:text-ochre transition duration-300"
                >
                  Contact
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
              <li className="relative group">
                <Link
                  href="#"
                  className="block hover:text-ochre transition duration-300"
                >
                  About
                </Link>
                <ul className="mt-2 space-y-2 bg-white text-black border border-gray-200 rounded-md shadow-lg">
                  <li>
                    <Link
                      href="/host"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      About Host
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/organization"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      About Organisation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/organisingCommittee"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Organising Committee
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ooty"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      About Ooty
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link
                  href="/speaker"
                  className="hover:text-ochre transition duration-300"
                >
                  Speakers
                </Link>
              </li>
              <li>
                <Link
                  href="/Schedule"
                  className="block hover:text-ochre transition duration-300"
                >
                  Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/Sponsors"
                  className="block hover:text-ochre transition duration-300"
                >
                  Sponsors
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
              <li>
                <Link
                  href="/Contact"
                  className="block hover:text-ochre transition duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>

            <InstallPWA />
          </nav>
        )}
      </header>

      {showInstallPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black  p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Install Pharmanecia APP</h2>
            <p className="mb-6">
              Would you like to install the Pharmanecia APP for a better
              experience?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
              >
                Dismiss
              </button>
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
