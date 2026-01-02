import Link from "next/link";
import React, { useState } from "react";

interface Registration {
  _id: string;
  name: string;
  email: string;
  registrationType: string;
  paymentStatus: string;
  registrationStatus: string;
  createdAt: string;
  updatedAt: string;
  registrationCode: string;
  affiliation: string;
  whatsappNumber: string;
  includeGalaDinner: boolean;
  paymentProofUrl?: string;
  transactionId?: string;
  utrNumber?: string;
  paymentAmount?: number;
  bankName?: string;
}

interface RegistrationTableProps {
  registrations: Registration[];
  onConfirm?: (id: string) => Promise<void>;
  onReject?: (id: string, reason: string) => Promise<void>;
  showActions?: boolean;
}

const RegistrationTable: React.FC<RegistrationTableProps> = ({
  registrations,
  onConfirm,
  onReject,
  showActions = false,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState<string | null>(null);

  const handleConfirm = async (id: string) => {
    if (onConfirm) {
      setProcessingId(id);
      try {
        await onConfirm(id);
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleReject = async (id: string) => {
    if (onReject && rejectionReason.trim()) {
      setProcessingId(id);
      try {
        await onReject(id, rejectionReason);
        setRejectingId(null);
        setRejectionReason("");
      } finally {
        setProcessingId(null);
      }
    }
  };

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-blue-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Regn ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Registration Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                College Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Mobile No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Creation Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Last Updated
              </th>
              {showActions && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations.length === 0 ? (
              <tr>
                <td
                  colSpan={showActions ? 9 : 8}
                  className="px-4 py-4 text-center text-gray-900"
                >
                  No matching registrations found.
                </td>
              </tr>
            ) : (
              registrations.map((registration) => (
                <React.Fragment key={registration._id}>
                  <tr
                    className={`hover:bg-gray-50 cursor-pointer ${registration.includeGalaDinner ? "bg-pink-50" : "bg-white"
                      } ${expandedRow === registration._id ? "bg-blue-50" : ""}`}
                    onClick={() =>
                      setExpandedRow(
                        expandedRow === registration._id
                          ? null
                          : registration._id
                      )
                    }
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {registration.registrationCode || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/abstractForm/${registration._id}`}
                        className="text-blue-600 hover:underline font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {registration.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {registration.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {registration.registrationType}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(
                          registration.paymentStatus
                        )}`}
                      >
                        {registration.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {registration.affiliation}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {registration.whatsappNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {new Date(registration.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {registration.updatedAt
                        ? new Date(registration.updatedAt).toLocaleString()
                        : "-"}
                    </td>
                    {showActions && (
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {registration.paymentStatus === "Pending" ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleConfirm(registration._id)}
                              disabled={processingId === registration._id}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {processingId === registration._id
                                ? "..."
                                : "Confirm"}
                            </button>
                            <button
                              onClick={() => setRejectingId(registration._id)}
                              disabled={processingId === registration._id}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusColor(
                              registration.registrationStatus
                            )}`}
                          >
                            {registration.registrationStatus}
                          </span>
                        )}
                      </td>
                    )}
                  </tr>

                  {/* Expanded Payment Details Row */}
                  {expandedRow === registration._id && (
                    <tr className="bg-gray-50">
                      <td colSpan={showActions ? 9 : 8} className="px-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                              Payment Details
                            </h4>
                            <div className="space-y-1">
                              <p>
                                <span className="text-gray-600">Amount:</span>{" "}
                                <span className="font-medium text-gray-900">
                                  ₹{registration.paymentAmount || "N/A"}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-600">
                                  Transaction ID:
                                </span>{" "}
                                <span className="font-mono text-gray-900">
                                  {registration.transactionId || "N/A"}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-600">
                                  UTR Number:
                                </span>{" "}
                                <span className="font-mono text-gray-900">
                                  {registration.utrNumber || "N/A"}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-600">Bank:</span>{" "}
                                <span className="text-gray-900">
                                  {registration.bankName || "N/A"}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                              Payment Proof
                            </h4>
                            {registration.paymentProofUrl ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowImageModal(
                                    registration.paymentProofUrl!
                                  );
                                }}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                View Payment Proof
                              </button>
                            ) : (
                              <p className="text-gray-500 italic">
                                No payment proof uploaded
                              </p>
                            )}
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-gray-800 mb-2 border-b pb-1">
                              Status
                            </h4>
                            <div className="space-y-2">
                              <p>
                                <span className="text-gray-600">Payment:</span>{" "}
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(registration.paymentStatus)}`}
                                >
                                  {registration.paymentStatus}
                                </span>
                              </p>
                              <p>
                                <span className="text-gray-600">
                                  Registration:
                                </span>{" "}
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${getRegistrationStatusColor(registration.registrationStatus)}`}
                                >
                                  {registration.registrationStatus}
                                </span>
                              </p>
                              {registration.registrationCode && (
                                <p>
                                  <span className="text-gray-600">Code:</span>{" "}
                                  <span className="font-mono font-bold text-green-700">
                                    {registration.registrationCode}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Rejection Reason Modal Row */}
                  {rejectingId === registration._id && (
                    <tr className="bg-red-50">
                      <td colSpan={showActions ? 9 : 8} className="px-4 py-4">
                        <div className="flex items-center space-x-4">
                          <label className="text-sm font-medium text-gray-700">
                            Rejection Reason:
                          </label>
                          <input
                            type="text"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter reason for rejection..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={() => handleReject(registration._id)}
                            disabled={
                              !rejectionReason.trim() ||
                              processingId === registration._id
                            }
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingId === registration._id
                              ? "Rejecting..."
                              : "Submit Rejection"}
                          </button>
                          <button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectionReason("");
                            }}
                            className="px-4 py-2 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 z-10"
            >
              ✕
            </button>
            <img
              src={showImageModal}
              alt="Payment Proof"
              className="max-w-full max-h-[85vh] object-contain"
            />
            <div className="p-4 bg-gray-100 text-center">
              <a
                href={showImageModal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function getPaymentStatusColor(status: string): string {
  switch (status) {
    case "Completed":
      return "bg-green-600 text-white";
    case "Pending":
      return "bg-yellow-500 text-white";
    case "Failed":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

function getRegistrationStatusColor(status: string): string {
  switch (status) {
    case "Confirmed":
      return "bg-green-600 text-white";
    case "Pending":
      return "bg-yellow-500 text-white";
    case "Rejected":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

export default RegistrationTable;
