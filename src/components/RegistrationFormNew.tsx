import { useFirebaseStorage } from "@/app/hooks/useFirebaseStorage";
import { indianStates } from "@/data";
import { RegistrationFormData } from "@/lib/interface";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface RegistrationFormProps {
  formData: RegistrationFormData;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onImageUpload: (file: File) => Promise<void>;
  errors: { [key: string]: string };
  selectedPlanName?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  onInputChange,
  onImageUpload,
  errors,
  selectedPlanName,
}) => {
  const {
    uploadProgress,
    isUploading,
    error: uploadError,
    uploadFile,
  } = useFirebaseStorage();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleProfileImageUpload = async (file: File) => {
    try {
      setImageFile(file);
      setUploadingField("profileImage");
      await onImageUpload(file);
      setUploadingField(null);
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      setUploadingField(null);
      setImageFile(null);
      alert("Failed to upload profile image. Please try again.");
    }
  };

  const handlePaymentProofUpload = async (file: File) => {
    try {
      setPaymentProofFile(file);
      setUploadingField("paymentProof");
      const url = await uploadFile(file);
      onInputChange({
        target: { name: "paymentProofUrl", value: url },
      } as any);
      setUploadingField(null);
    } catch (error) {
      console.error("Failed to upload payment proof:", error);
      setUploadingField(null);
      setPaymentProofFile(null);
      alert("Failed to upload payment proof. Please try again.");
    }
  };

  const handleIdCardUpload = async (file: File) => {
    try {
      setIdCardFile(file);
      setUploadingField("idCard");
      const url = await uploadFile(file);
      onInputChange({
        target: { name: "idCardUrl", value: url },
      } as any);
      setUploadingField(null);
    } catch (error) {
      console.error("Failed to upload ID card:", error);
      setUploadingField(null);
      setIdCardFile(null);
      alert("Failed to upload ID card. Please try again.");
    }
  };

  const {
    getRootProps: getPaymentProofRootProps,
    getInputProps: getPaymentProofInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => handlePaymentProofUpload(acceptedFiles[0]),
    accept: { "image/*": [], "application/pdf": [] },
    multiple: false,
  });

  const {
    getRootProps: getIdCardRootProps,
    getInputProps: getIdCardInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => handleIdCardUpload(acceptedFiles[0]),
    accept: { "image/*": [], "application/pdf": [] },
    multiple: false,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        handleProfileImageUpload(acceptedFiles[0]);
      }
    },
    accept: { "image/*": [] },
    multiple: false,
  });

  const isForeignPlan = [
    "Foreign Delegates",
    "Foreign Presenter (Online)",
    "Accompanying Person (Foreign)",
  ].includes(selectedPlanName || "");

  const inputClasses =
    "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400";
  const labelClasses =
    "block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300";
  const sectionTitleClasses =
    "text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2";

  return (
    <form className="max-w-3xl mx-auto space-y-8">
      {/* Image Uploader */}
      <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
        <label className={labelClasses}>Profile Picture</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${imageFile
            ? "border-green-500 bg-green-50/50 dark:bg-green-900/20"
            : isDragActive
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
              : "border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
        >
          <input {...getInputProps()} />
          {imageFile ? (
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={URL.createObjectURL(imageFile)}
                  alt="Profile preview"
                  className="object-cover rounded-full border-4 border-white dark:border-slate-700 shadow-lg"
                  fill
                />
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Uploaded Successfully</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {imageFile.name}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-slate-900 dark:text-white font-medium">
                Click or drag image to upload
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                (JPEG, JPG, or PNG, max 5MB)
              </p>
            </div>
          )}
        </div>
        {uploadError && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="block w-1 h-1 bg-red-500 rounded-full" />
            {uploadError}
          </p>
        )}
        {errors.imageUrl && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
            <span className="block w-1 h-1 bg-red-500 rounded-full" />
            {errors.imageUrl}
          </p>
        )}
        {uploadingField === "profileImage" && isUploading && (
          <div className="mt-4">
            <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
              {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div>
        <h3 className={sectionTitleClasses}>Personal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-2">
            <label className={labelClasses}>Salutation</label>
            <select
              name="Salutations"
              value={formData.Salutations}
              onChange={onInputChange}
              required
              className={inputClasses}
            >
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
            </select>
          </div>

          <div className="md:col-span-5">
            <label className={labelClasses}>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={onInputChange}
              required
              className={inputClasses}
              placeholder="John"
            />
          </div>

          <div className="md:col-span-5">
            <label className={labelClasses}>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={onInputChange}
              required
              className={inputClasses}
              placeholder="Doe"
            />
          </div>
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label className={labelClasses}>Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={onInputChange}
          required
          className={inputClasses}
        />
        {errors.dob && (
          <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Applying as</label>
          <select
            name="applyingAs"
            value={formData.applyingAs}
            onChange={onInputChange}
            required
            className={inputClasses}
          >
            <option value="Individual">Individual</option>
            <option value="Group">Group</option>
          </select>
        </div>

        <div>
          <label className={labelClasses}>Registering as</label>
          <select
            name="registeringAs"
            value={formData.registeringAs}
            onChange={onInputChange}
            required
            className={inputClasses}
          >
            <option value="Delegate">Delegate (without Presentation)</option>
            <option value="Delegate as Presenter">
              Delegate as Presenter (First Author only)
            </option>
          </select>
        </div>
      </div>

      {(selectedPlanName?.includes("Student") ||
        selectedPlanName?.includes("UG") ||
        selectedPlanName?.includes("PG")) && (
          <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <label className={labelClasses}>
              Upload ID Card or Letter from Institute
            </label>
            <div
              {...getIdCardRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${formData.idCardUrl
                ? "border-green-500 bg-green-50/50 dark:bg-green-900/20"
                : "border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
            >
              <input {...getIdCardInputProps()} />
              {formData.idCardUrl ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Uploaded Successfully</span>
                  </div>
                  {idCardFile && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {idCardFile.name}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="w-8 h-8 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                  <p className="text-slate-600 dark:text-slate-300">
                    Drag & drop ID card here, or click to select
                  </p>
                </div>
              )}
            </div>
            {uploadingField === "idCard" && isUploading && (
              <div className="mt-4">
                <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            {errors.idCardUrl && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <span className="block w-1 h-1 bg-red-500 rounded-full" />
                {errors.idCardUrl}
              </p>
            )}
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            required
            className={inputClasses}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>WhatsApp Number</label>
          <input
            type="tel"
            name="whatsappNumber"
            value={formData.whatsappNumber}
            onChange={onInputChange}
            required
            className={inputClasses}
            maxLength={10}
            placeholder="1234567890"
          />
          {errors.whatsappNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.whatsappNumber}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Gender</label>
        <div className="grid grid-cols-3 gap-4">
          {["Male", "Female", "Other"].map((option) => (
            <label
              key={option}
              className={`cursor-pointer border rounded-xl p-3 text-center transition-all ${formData.gender === option
                ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
            >
              <input
                type="radio"
                name="gender"
                value={option}
                checked={formData.gender === option}
                onChange={onInputChange}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
        )}
      </div>

      <div>
        <h3 className={sectionTitleClasses}>Professional Details</h3>

        <div className="space-y-6">
          <div>
            <label className={labelClasses}>
              Affiliation/Organization/Institution
            </label>
            <input
              type="text"
              name="affiliation"
              value={formData.affiliation}
              onChange={onInputChange}
              className={inputClasses}
              placeholder="University Name"
            />
            {errors.affiliation && (
              <p className="text-red-500 text-sm mt-1">{errors.affiliation}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={onInputChange}
              className={inputClasses}
              placeholder="Professor / Student"
            />
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h3 className={sectionTitleClasses}>Address Information</h3>

        <div className="space-y-6">
          <div>
            <label className={labelClasses}>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={onInputChange}
              required
              className={inputClasses}
              placeholder="Street Address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={onInputChange}
                required
                className={inputClasses}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>State</label>
              <select
                name="state"
                value={formData.state}
                onChange={onInputChange}
                required
                className={inputClasses}
              >
                <option value="" disabled>
                  Select your state
                </option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={onInputChange}
                required
                className={inputClasses}
                maxLength={6}
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={onInputChange}
                required
                className={inputClasses}
                defaultValue="India"
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details Section */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
        <h3 className={sectionTitleClasses}>Payment Details</h3>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl mb-8 border border-indigo-100 dark:border-indigo-800/30">
          <h4 className="font-bold mb-4 text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {isForeignPlan
              ? "International Payment Instructions (USD)"
              : "Bank Account Details"}
          </h4>
          {isForeignPlan ? (
            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50 space-y-3">
                <p className="font-semibold text-indigo-700 dark:text-indigo-300 text-base border-b border-indigo-100 dark:border-indigo-800/50 pb-2">
                  Payment Instruction for US Dollar (USD)
                </p>

                <div className="space-y-2">
                  <p className="font-medium">Please Remit Proceeds to:</p>
                  <div className="pl-3 border-l-2 border-indigo-200 dark:border-indigo-700 space-y-1">
                    <p className="font-bold">HABIB AMERICAN BANK, NEW YORK</p>
                    <p>
                      SWIFT ID:{" "}
                      <span className="font-mono bg-indigo-50 dark:bg-indigo-900/40 px-1 rounded select-all">
                        HANYUS33
                      </span>
                    </p>
                    <p>
                      CHIPS ABA:{" "}
                      <span className="font-mono bg-indigo-50 dark:bg-indigo-900/40 px-1 rounded select-all">
                        0736
                      </span>
                    </p>
                    <p>
                      FED ABA Number:{" "}
                      <span className="font-mono bg-indigo-50 dark:bg-indigo-900/40 px-1 rounded select-all">
                        026007362
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">For Credit to Account of:</p>
                  <div className="pl-3 border-l-2 border-indigo-200 dark:border-indigo-700 space-y-1">
                    <p className="font-bold">
                      THE KALUPUR COMMERCIAL CO-OPERATIVE BANK LTD.
                    </p>
                    <p>
                      Account Number:{" "}
                      <span className="font-mono bg-indigo-50 dark:bg-indigo-900/40 px-1 rounded select-all">
                        20729115
                      </span>
                    </p>
                    <p>
                      SWIFT ID:{" "}
                      <span className="font-mono bg-indigo-50 dark:bg-indigo-900/40 px-1 rounded select-all">
                        KALUINAAXXX
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">For further credit to:</p>
                  <div className="pl-3 border-l-2 border-indigo-200 dark:border-indigo-700 space-y-1">
                    <p className="font-bold">
                      Institute of Pharmacy Under Nirma University
                    </p>
                    <p>
                      Account Number:{" "}
                      <span className="font-mono bg-indigo-50 dark:bg-indigo-900/40 px-1 rounded select-all">
                        09720180112
                      </span>
                    </p>
                    <p>Nirma University Branch</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Account Name:
                </span>{" "}
                Institute of Pharmacy, Nirma University
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Bank Name:
                </span>{" "}
                The Kalupur Commercial Co-Operative Bank Ltd.
              </p>
              <p className="md:col-span-2">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Branch:
                </span>{" "}
                Nirma University Campus, S.G. Highway, Ahmedabad
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">
                  Account No.:
                </span>{" "}
                09720180112
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">
                  IFSC CODE:
                </span>{" "}
                KCCB0NRM097
              </p>
              <p>
                <span className="font-semibold text-slate-900 dark:text-white">
                  MICR Code:
                </span>{" "}
                380126029
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className={labelClasses}>Amount Paid</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                ₹
              </span>
              <input
                type="number"
                name="paymentAmount"
                value={formData.paymentAmount || ""}
                onChange={onInputChange}
                required
                className={`${inputClasses} pl-8`}
                placeholder="0.00"
              />
            </div>
            {errors.paymentAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentAmount}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Transaction UTR / Ref No.</label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={onInputChange}
              required
              className={inputClasses}
              placeholder="Enter UTR number"
            />
            {errors.transactionId && (
              <p className="text-red-500 text-sm mt-1">{errors.transactionId}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Name of Bank</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={onInputChange}
              required
              className={inputClasses}
              placeholder="Your bank name"
            />
            {errors.bankName && (
              <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Name of Branch</label>
            <input
              type="text"
              name="branchName"
              value={formData.branchName}
              onChange={onInputChange}
              required
              className={inputClasses}
              placeholder="Your bank branch"
            />
            {errors.branchName && (
              <p className="text-red-500 text-sm mt-1">{errors.branchName}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClasses}>Date of Payment</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={onInputChange}
              required
              className={inputClasses}
            />
            {errors.paymentDate && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentDate}</p>
            )}
          </div>
        </div>

        <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <label className={labelClasses}>
            Upload Proof of Online Transaction
          </label>
          <div
            {...getPaymentProofRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${formData.paymentProofUrl
              ? "border-green-500 bg-green-50/50 dark:bg-green-900/20"
              : "border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
          >
            <input {...getPaymentProofInputProps()} />
            {formData.paymentProofUrl ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Uploaded Successfully</span>
                </div>
                {paymentProofFile && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {paymentProofFile.name}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg
                  className="w-8 h-8 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-slate-600 dark:text-slate-300">
                  Drag & drop payment proof here, or click to select
                </p>
              </div>
            )}
          </div>
          {uploadingField === "paymentProof" && isUploading && (
            <div className="mt-4">
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          {errors.paymentProofUrl && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <span className="block w-1 h-1 bg-red-500 rounded-full" />
              {errors.paymentProofUrl}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;
