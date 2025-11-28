"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";

interface Nomination {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  aadharNumber: string;
  organization: string;
  position: string;
  email: string;
  whatsappNumber: string;
  category: string;
  subCategory: string;
  nominatorName: string;
  nominatorContact: string;
  membershipNumber: string;
  professionalAchievements: string;
  nominationStatement: string;
}

interface NominationsResponse {
  nominations: Nomination[];
}

const NominationsList: React.FC = () => {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchNominations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<NominationsResponse>(
        "/api/nominationsList"
      );
      setNominations(response.data.nominations);
    } catch (err) {
      setError("Failed to fetch nominations. Please try again later.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNominations();
  }, []);

  const filteredNominations = nominations.filter(
    (nomination) =>
      nomination.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "" || nomination.category === selectedCategory)
  );

  const categories = Array.from(new Set(nominations.map((n) => n.category)));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center font-semibold text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">
        Nominations
      </h1>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
          />
        </div>
        <div className="flex items-center w-full md:w-auto">
          <FaFilter className="text-gray-400 mr-2" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredNominations.map((nomination) => (
          <motion.div
            key={nomination._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className="bg-gradient-to-r from-primary to-secondary text-white p-4">
              <h2 className="text-xl font-semibold">{nomination.fullName}</h2>
              <p className="text-sm opacity-80">
                {nomination.organization} - {nomination.position}
              </p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Category:</span>{" "}
                {nomination.category}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Sub-category:</span>{" "}
                {nomination.subCategory}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Email:</span> {nomination.email}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">WhatsApp:</span>{" "}
                {nomination.whatsappNumber}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">Nominator:</span>{" "}
                {nomination.nominatorName}
              </p>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Professional Achievements:
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {nomination.professionalAchievements}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Nomination Statement:
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {nomination.nominationStatement}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default NominationsList;
