import React from "react";
import { GetServerSideProps } from "next";
import RegistrationModel from "@/Model/RegistrationModel";
import AbstractModel from "@/Model/AbstractModel";
import { FaUsers, FaFileAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface DashboardProps {
  registrations: any[];
  abstracts: any[];
}

export default function Dashboard({
  registrations,
  abstracts,
}: DashboardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-200">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl"
            variants={itemVariants}
          >
            <div className="px-4 py-5 sm:p-6 flex items-center">
              <FaUsers className="text-4xl text-blue-500 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Registrations
                </h3>
                <p className="mt-1 text-3xl font-semibold text-blue-600">
                  {registrations.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl"
            variants={itemVariants}
          >
            <div className="px-4 py-5 sm:p-6 flex items-center">
              <FaFileAlt className="text-4xl text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Abstracts</h3>
                <p className="mt-1 text-3xl font-semibold text-green-600">
                  {abstracts.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl"
            variants={itemVariants}
          >
            <div className="px-4 py-5 sm:p-6 flex items-center">
              <FaMoneyCheckAlt className="text-4xl text-yellow-500 mr-4" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Completed Payments
                </h3>
                <p className="mt-1 text-3xl font-semibold text-yellow-600">
                  {
                    registrations.filter((r) => r.paymentStatus === "Completed")
                      .length
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Registrations
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Registration Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.slice(0, 5).map((registration) => (
                  <motion.tr
                    key={registration._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {registration.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registration.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {registration.registrationType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          registration.registrationStatus === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {registration.registrationStatus}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const registrations = await RegistrationModel.find()
    .sort({ createdAt: -1 })
    .limit(100);
  const abstracts = await AbstractModel.find()
    .sort({ createdAt: -1 })
    .limit(100);

  return {
    props: {
      registrations: JSON.parse(JSON.stringify(registrations)),
      abstracts: JSON.parse(JSON.stringify(abstracts)),
    },
  };
};
