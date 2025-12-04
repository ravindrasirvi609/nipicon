"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useFirebaseStorage } from "@/app/hooks/useFirebaseStorage";
import { useDropzone } from "react-dropzone";
import { formatDate } from "@/lib/utils";
import { RegistrationInfo } from "@/lib/interface";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaFileDownload } from "react-icons/fa";

const AbstractForm: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;
  const [registrationInfo, setRegistrationInfo] =
    useState<RegistrationInfo | null>(null);
  const [abstractFile, setAbstractFile] = useState<File | null>(null);
  const [presentationFile, setPresentationFile] = useState<File | null>(null);

  const {
    uploadFile,
    uploadProgress,
    isUploading,
    error: uploadError,
  } = useFirebaseStorage();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/qrcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      setRegistrationInfo(data.props);
    };

    fetchData();
  }, [id]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setAbstractFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps: getRootPropsAbstract,
    getInputProps: getInputPropsAbstract,
    isDragActive: isDragActiveAbstract,
  } = useDropzone({
    onDrop,
    accept: {
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: 5 * 1024 * 1024,
  });

  const {
    getRootProps: getRootPropsPpt,
    getInputProps: getInputPropsPpt,
    isDragActive: isDragActivePpt,
  } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setPresentationFile(acceptedFiles[0]);
    },
    accept: {
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    },
    maxSize: 5 * 1024 * 1024,
  });

  const handleFileUpload = async () => {
    if (!abstractFile || !registrationInfo) return;

    try {
      const downloadURL = await uploadFile(abstractFile);
      const updateRes = await fetch("/api/updateAbstract", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, abstractFileUrl: downloadURL }),
      });

      if (updateRes.ok) {
        const updatedData = await updateRes.json();
        setRegistrationInfo((prevState) => ({
          ...prevState!,
          abstract: updatedData.abstract,
        }));
      } else {
        throw new Error("Failed to update abstract");
      }
    } catch (error) {
      console.error("Failed to upload file or update abstract:", error);
    }
  };

  const handlePresentationUpload = async () => {
    if (!presentationFile || !registrationInfo) return;

    try {
      const downloadURL = await uploadFile(presentationFile);
      const updateRes = await fetch("/api/updatePresentation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, presentationFileUrl: downloadURL }),
      });

      if (updateRes.ok) {
        const updatedData = await updateRes.json();
        setRegistrationInfo((prevState) => ({
          ...prevState!,
          abstract: updatedData.abstract,
        }));

        alert("Your file has been uploaded successfully!");
      } else {
        throw new Error("Failed to update presentation");
      }
    } catch (error) {
      console.error("Failed to upload file or update presentation:", error);
    }
  };

  if (!registrationInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  const { abstract, registration } = registrationInfo;

  const InfoItem = ({
    label,
    value,
    fullWidth = false,
  }: {
    label: string;
    value: React.ReactNode;
    fullWidth?: boolean;
  }) => (
    <div
      className={`mb-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${fullWidth ? "col-span-full" : ""
        }`}
    >
      <span className="block text-sm font-medium text-gray-500 mb-1">
        {label}
      </span>
      <div className="text-gray-900 font-medium break-words">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </div>
    </div>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
      {children}
    </h2>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-10 text-white">
            <h1 className="text-4xl font-bold text-center tracking-tight">
              Participant Details
            </h1>
            <p className="text-center mt-2 text-purple-100 text-lg">
              {registration?.registrationCode || "Registration Details"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {registration?.imageUrl && (
                <div className="mb-8 flex justify-center">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-white ring-4 ring-purple-50">
                    <Image
                      src={registration.imageUrl}
                      alt="Participant"
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <InfoItem
                  label="Full Name"
                  value={`${registration?.Salutations || ""} ${registration?.name || abstract?.name
                    }`}
                  fullWidth
                />
                <InfoItem
                  label="Email"
                  value={registration?.email || abstract?.email}
                  fullWidth
                />
                <InfoItem
                  label="WhatsApp Number"
                  value={registration?.whatsappNumber}
                  fullWidth
                />
                <InfoItem
                  label="Gender"
                  value={registration?.gender}
                  fullWidth
                />
                <InfoItem
                  label="Date of Birth"
                  value={registration?.dob && formatDate(registration.dob)}
                  fullWidth
                />
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <SectionTitle>Address Details</SectionTitle>
              <div className="space-y-4">
                <InfoItem
                  label="Institute/Organization"
                  value={registration?.institute}
                  fullWidth
                />
                <InfoItem
                  label="Address"
                  value={registration?.address}
                  fullWidth
                />
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="City" value={registration.city} />
                  <InfoItem label="State" value={registration.state} />
                  <InfoItem label="Pincode" value={registration.pincode} />
                  <InfoItem label="Country" value={registration.country} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Registration & Abstract Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Registration Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <SectionTitle>Registration Information</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  label="Registration Code"
                  value={registration?.registrationCode}
                />
                <InfoItem
                  label="Registration Type"
                  value={registration?.registrationType}
                />
                <InfoItem
                  label="Applying As"
                  value={registration?.applyingAs}
                />
                <InfoItem
                  label="Registering As"
                  value={registration?.registeringAs}
                />
                <InfoItem
                  label="Affiliation"
                  value={registration?.affiliation}
                />
                <InfoItem
                  label="Designation"
                  value={registration?.designation}
                />
                {registration?.groupCode && (
                  <InfoItem label="Group Code" value={registration.groupCode} />
                )}
                {registration?.memberId && (
                  <InfoItem label="Member ID" value={registration.memberId} />
                )}
                {registration?.idCardUrl && (
                  <div className="col-span-full">
                    <span className="block text-sm font-medium text-gray-500 mb-2">
                      ID Card
                    </span>
                    <a
                      href={registration.idCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FaFileDownload className="mr-2" />
                      View ID Card
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <SectionTitle>Payment Information</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  label="Status"
                  value={
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${registration?.paymentStatus === "Completed"
                          ? "bg-green-100 text-green-800"
                          : registration?.paymentStatus === "Failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {registration?.paymentStatus}
                    </span>
                  }
                />
                <InfoItem
                  label="Amount"
                  value={
                    registration?.paymentAmount
                      ? `₹${registration.paymentAmount}`
                      : null
                  }
                />
                <InfoItem
                  label="Payment Date"
                  value={
                    registration?.paymentDate &&
                    formatDate(registration.paymentDate)
                  }
                />
                <InfoItem
                  label="Transaction ID"
                  value={registration?.transactionId}
                />
                <InfoItem label="Bank Name" value={registration?.bankName} />
                <InfoItem
                  label="Branch Name"
                  value={registration?.branchName}
                />
                <InfoItem label="UTR Number" value={registration?.utrNumber} />
                {registration?.paymentProofUrl && (
                  <div className="col-span-full">
                    <span className="block text-sm font-medium text-gray-500 mb-2">
                      Payment Proof
                    </span>
                    <a
                      href={registration.paymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FaFileDownload className="mr-2" />
                      View Payment Proof
                    </a>
                  </div>
                )}
                {registration?.feesReceiptUrl && (
                  <div className="col-span-full">
                    <span className="block text-sm font-medium text-gray-500 mb-2">
                      Registration Receipt
                    </span>
                    <a
                      href={registration.feesReceiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <FaFileDownload className="mr-2" />
                      Download Receipt
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Abstract Details */}
            {abstract && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <SectionTitle>Scientific Abstract</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-full">
                    <InfoItem
                      label="Title"
                      value={abstract.title}
                      fullWidth
                    />
                  </div>
                  <InfoItem
                    label="Status"
                    value={
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${abstract.Status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : abstract.Status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {abstract.Status}
                      </span>
                    }
                  />
                  <InfoItem
                    label="Abstract Code"
                    value={
                      abstract.AbstractCode || abstract.temporyAbstractCode
                    }
                  />
                  <InfoItem label="Co-Author" value={abstract.coAuthor} />
                  <InfoItem
                    label="Presentation Type"
                    value={abstract.presentationType}
                  />
                  <InfoItem
                    label="Article Type"
                    value={abstract.articleType}
                  />
                  <InfoItem
                    label="Submitted On"
                    value={
                      abstract.createdAt && formatDate(abstract.createdAt)
                    }
                  />

                  {/* Abstract File Download */}
                  <div className="col-span-full">
                    <span className="block text-sm font-medium text-gray-500 mb-2">
                      Abstract File
                    </span>
                    {abstract.abstractFileUrl ? (
                      <a
                        href={abstract.abstractFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <FaFileDownload className="mr-2" />
                        Download Abstract
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">
                        Not uploaded
                      </span>
                    )}
                  </div>

                  {/* Rejection/Revision Logic */}
                  {(abstract.Status === "Revision" ||
                    abstract.Status === "Rejected") && (
                      <div className="col-span-full mt-6 p-6 bg-red-50 rounded-xl border border-red-100">
                        <h3 className="text-lg font-bold text-red-800 mb-4">
                          Re-upload Abstract
                        </h3>
                        <div
                          {...getRootPropsAbstract()}
                          className={`w-full p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 ${isDragActiveAbstract
                              ? "border-red-500 bg-red-100"
                              : "border-red-300 hover:border-red-500 hover:bg-white"
                            }`}
                        >
                          <input {...getInputPropsAbstract()} />
                          <p className="text-gray-700 font-medium">
                            {isDragActiveAbstract
                              ? "Drop the file here..."
                              : "Drag & drop your revised abstract file here"}
                          </p>
                        </div>

                        {abstractFile && (
                          <div className="mt-3 text-sm text-gray-600 font-medium">
                            Selected: {abstractFile.name}
                          </div>
                        )}

                        <button
                          onClick={handleFileUpload}
                          disabled={!abstractFile || isUploading}
                          className="mt-4 w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                        >
                          {isUploading ? "Uploading..." : "Upload Revision"}
                        </button>
                      </div>
                    )}

                  {/* Presentation File Logic */}
                  {abstract.Status === "Accepted" &&
                    registration?.paymentStatus === "Completed" && (
                      <div className="col-span-full mt-6 pt-6 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                          Presentation Details
                        </h3>

                        <div className="mb-6">
                          <InfoItem
                            label="Presentation Status"
                            value={
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${!abstract.presentationFileStatus
                                    ? "bg-yellow-100 text-yellow-800"
                                    : abstract.presentationFileStatus ===
                                      "Approved"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                              >
                                {abstract.presentationFileStatus ||
                                  "Not Uploaded"}
                              </span>
                            }
                            fullWidth
                          />
                        </div>

                        {abstract.presentationFileUrl && (
                          <div className="mb-6">
                            <span className="block text-sm font-medium text-gray-500 mb-2">
                              Current Presentation
                            </span>
                            <a
                              href={abstract.presentationFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                              <FaFileDownload className="mr-2" />
                              Download Presentation
                            </a>
                          </div>
                        )}

                        {abstract.presentationFileStatus !== "InReview" &&
                          abstract.presentationFileStatus !== "Approved" && (
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                              <h4 className="text-md font-bold text-gray-700 mb-3">
                                Upload Presentation
                              </h4>
                              <div
                                {...getRootPropsPpt()}
                                className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ${isDragActivePpt
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "border-gray-300 hover:border-indigo-500 hover:bg-white"
                                  }`}
                              >
                                <input {...getInputPropsPpt()} />
                                <p className="text-gray-600">
                                  {isDragActivePpt
                                    ? "Drop the file here..."
                                    : "Drag & drop your presentation file here"}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  .ppt, .pptx (Max 5MB)
                                </p>
                              </div>

                              {presentationFile && (
                                <div className="mt-2 text-sm text-gray-600">
                                  {presentationFile.name}
                                </div>
                              )}

                              <button
                                onClick={handlePresentationUpload}
                                disabled={!presentationFile || isUploading}
                                className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                              >
                                {isUploading
                                  ? "Uploading..."
                                  : "Upload Presentation"}
                              </button>
                            </div>
                          )}
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center pt-8 pb-4">
          <p className="text-gray-500">
            For queries, contact us at{" "}
            <a
              href="mailto:psc@pharmanecia.org"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              psc@pharmanecia.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AbstractForm;
