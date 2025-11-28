"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Linkedin, Send } from "lucide-react";

interface SocialLink {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    href: "https://www.facebook.com/operantpharmacyfederation/",
    icon: <Facebook className="w-5 h-5" />,
    label: "Facebook",
  },
  {
    href: "https://www.linkedin.com/company/operantpharmacyfederation/",
    icon: <Linkedin className="w-5 h-5" />,
    label: "LinkedIn",
  },
  {
    href: "https://whatsapp.com/channel/0029Va93LYsA89MpBKbv992x",
    icon: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
    label: "WhatsApp",
  },
];

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Successfully subscribed to the newsletter!");
        setEmail("");
      } else {
        setMessage(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-primary text-light px-6 py-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Contact Information</h2>
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <a
              href="mailto:info@pharmanecia.org"
              className="hover:text-accent transition-colors"
            >
              info@pharmanecia.org
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5" />
            <a
              href="tel:+91 94609-71652"
              className="hover:text-accent transition-colors"
            >
              +91 94609-71652
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>JSS College of Pharmacy, Ooty</span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Follow Us</h2>
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-light hover:text-accent transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </Link>
            ))}
          </div>
          <Link
            href="https://www.ravindrachoudhary.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ochre font-bold block hover:text-white transition-colors"
          >
            Designed by Ravindra Choudhary
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Newsletter Signup</h2>
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 pr-10 rounded-md border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-accent transition-colors"
                disabled={isLoading}
                aria-label="Subscribe"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            {message && (
              <p
                className={`text-sm ${
                  message.includes("Successfully")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Legal</h2>
          <ul className="space-y-2">
            {["Terms Of Service", "Privacy Policy", "Refund Policy"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href={`/${item.replace(/\s+/g, "")}`}
                    className="text-light hover:text-accent transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} Pharmanecia. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
