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

  return (
    <form className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4 text-indigo-900">
        Registration Form
      </h3>

      {/* Image Uploader */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-800 font-medium">
          Profile Picture
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            imageFile
              ? "border-green-500 bg-green-50"
              : isDragActive
                ? "border-amber-500 bg-amber-500 bg-opacity-10"
                : "border-gray-300 hover:border-amber-500"
          }`}
        >
          <input {...getInputProps()} />
          {imageFile ? (
            <div className="flex flex-col items-center">
              <Image
                src={URL.createObjectURL(imageFile)}
                alt="Profile preview"
                className="w-32 h-32 object-cover rounded-full mb-4"
                width={128}
                height={128}
              />
              <svg
                className="w-8 h-8 text-green-600 mb-2"
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
              <p className="text-green-600 font-medium">
                Profile Picture Uploaded Successfully
              </p>
              <p className="text-sm text-gray-600 mt-1">{imageFile.name}</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600">
                Drag & drop an image here, or click to select one
              </p>
              <p className="text-sm text-gray-500 mt-2">
                (JPEG, JPG, or PNG, max 5MB)
              </p>
            </div>
          )}
        </div>
        {uploadError && (
          <p className="text-red-600 text-sm mt-2">{uploadError}</p>
        )}
        {errors.imageUrl && (
          <p className="text-red-600 text-sm mt-1">{errors.imageUrl}</p>
        )}
        {uploadingField === "profileImage" && isUploading && (
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">
          Salutation
        </label>
        <select
          name="Salutations"
          value={formData.Salutations}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="Mr.">Mr.</option>
          <option value="Ms.">Ms.</option>
          <option value="Mrs.">Mrs.</option>
          <option value="Dr.">Dr.</option>
          <option value="Prof.">Prof.</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 text-gray-800 font-medium">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onInputChange}
            required
            className="w-full p-2 border rounded text-gray-900"
          />
        </div>
        <div>
          <label className="block mb-2 text-gray-800 font-medium">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">
          Full Name (for Certificate)
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">
          Spelling should be correct. The same name will be printed on the
          certificate and cannot be changed after submission.
        </p>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">
          Applying as
        </label>
        <select
          name="applyingAs"
          value={formData.applyingAs}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
        >
          <option value="Individual">Individual</option>
          <option value="Group">Group</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">
          Registering as
        </label>
        <select
          name="registeringAs"
          value={formData.registeringAs}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
        >
          <option value="Delegate">Delegate (without Presentation)</option>
          <option value="Delegate as Presenter">
            Delegate as Presenter (First Author only)
          </option>
        </select>
      </div>

      {(selectedPlanName?.includes("Student") ||
        selectedPlanName?.includes("UG") ||
        selectedPlanName?.includes("PG")) && (
        <div className="mb-6">
          <label className="block mb-2 text-gray-800 font-medium">
            Upload ID Card or Letter from Institute
          </label>
          <div
            {...getIdCardRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              formData.idCardUrl
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-amber-500"
            }`}
          >
            <input {...getIdCardInputProps()} />
            {formData.idCardUrl ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-8 h-8 text-green-600 mb-2"
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
                <p className="text-green-600 font-medium">
                  ID Card Uploaded Successfully
                </p>
                {idCardFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    {idCardFile.name}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600">
                Drag & drop ID card here, or click to select
              </p>
            )}
          </div>
          {uploadingField === "idCard" && isUploading && (
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">
          WhatsApp Number
        </label>
        <input
          type="tel"
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
          maxLength={10}
        />
        {errors.whatsappNumber && (
          <p className="text-red-600 text-sm mt-1">{errors.whatsappNumber}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
        />
        {errors.dob && (
          <p className="text-red-600 text-sm mt-1">{errors.dob}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">
          Kindly enter correct Date of Birth to receive E-Certificate of
          conference on your Digilocker account linked with your Aadhar.
        </p>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">
          Affiliation/Organization/Institution
        </label>
        <input
          type="text"
          name="affiliation"
          value={formData.affiliation}
          onChange={onInputChange}
          className="w-full p-2 border rounded text-gray-900"
        />
        {errors.affiliation && (
          <p className="text-red-600 text-sm mt-1">{errors.affiliation}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">
          Designation
        </label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={onInputChange}
          className="w-full p-2 border rounded text-gray-900"
        />
        {errors.designation && (
          <p className="text-red-600 text-sm mt-1">{errors.designation}</p>
        )}
      </div>

      {/* Address Information */}
      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
        />
        {errors.address && (
          <p className="text-red-600 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
        />
        {errors.city && (
          <p className="text-red-600 text-sm mt-1">{errors.city}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">State</label>
        <select
          name="state"
          value={formData.state}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
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
          <p className="text-red-600 text-sm mt-1">{errors.state}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">Pincode</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
          maxLength={6}
        />
        {errors.pincode && (
          <p className="text-red-600 text-sm mt-1">{errors.pincode}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-gray-800 font-medium">Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded text-gray-900"
        />
        {errors.country && (
          <p className="text-red-600 text-sm mt-1">{errors.country}</p>
        )}
      </div>

      {/* Payment Details Section */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-bold mb-4 text-indigo-900">
          Payment Details
        </h3>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h4 className="font-semibold mb-2 text-indigo-800">
            Account Details for Registration Fees Payment:
          </h4>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-medium">Account Name:</span> Institute of
              Pharmacy, Nirma University
            </p>
            <p>
              <span className="font-medium">Bank Name:</span> The Kalupur
              Commercial Co-Operative Bank Ltd.
            </p>
            <p>
              <span className="font-medium">Branch Name:</span> Nirma
              University, Nirma University Campus, S.G. Highway, Ahmedabad
            </p>
            <p>
              <span className="font-medium">Bank Account No.:</span> 09720180112
            </p>
            <p>
              <span className="font-medium">IFSC CODE:</span> KCCB0NRM097
            </p>
            <p>
              <span className="font-medium">MICR Code No.:</span> 380126029
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block mb-2 text-gray-800 font-medium">
              Amount Paid
            </label>
            <input
              type="number"
              name="paymentAmount"
              value={formData.paymentAmount || ""}
              onChange={onInputChange}
              required
              className="w-full p-2 border rounded text-gray-900"
              placeholder="Enter amount"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-800 font-medium">
              Transaction UTR / Ref No.
            </label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={onInputChange}
              required
              className="w-full p-2 border rounded text-gray-900"
              placeholder="Enter UTR number"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-800 font-medium">
              Name of Bank
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={onInputChange}
              required
              className="w-full p-2 border rounded text-gray-900"
              placeholder="Your bank name"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-800 font-medium">
              Name of Branch
            </label>
            <input
              type="text"
              name="branchName"
              value={formData.branchName}
              onChange={onInputChange}
              required
              className="w-full p-2 border rounded text-gray-900"
              placeholder="Your bank branch"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-800 font-medium">
              Date of Payment
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={onInputChange}
              required
              className="w-full p-2 border rounded text-gray-900"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-800 font-medium">
            Upload Proof of Online Transaction
          </label>
          <div
            {...getPaymentProofRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              formData.paymentProofUrl
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-amber-500"
            }`}
          >
            <input {...getPaymentProofInputProps()} />
            {formData.paymentProofUrl ? (
              <div className="flex flex-col items-center">
                <svg
                  className="w-8 h-8 text-green-600 mb-2"
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
                <p className="text-green-600 font-medium">
                  Payment Proof Uploaded Successfully
                </p>
                {paymentProofFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    {paymentProofFile.name}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600">
                Drag & drop payment proof here, or click to select
              </p>
            )}
          </div>
          {uploadingField === "paymentProof" && isUploading && (
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;
