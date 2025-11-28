import { useFirebaseStorage } from "@/app/hooks/useFirebaseStorage";
import { indianStates } from "@/data";
import { RegistrationFormData } from "@/lib/interface";
import axios from "axios";
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
  includeGalaDinner: boolean;
  handleGalaDinnerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedPlanName?: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  onInputChange,
  onImageUpload,
  errors,
  includeGalaDinner,
  handleGalaDinnerChange,
  selectedPlanName,
}) => {
  const {
    uploadProgress,
    isUploading,
    error: uploadError,
  } = useFirebaseStorage();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [abstractError, setAbstractError] = useState("");
  const [isAbstractFetching, setIsAbstractFetching] = useState(false);
  const [abstractSubmitted, setAbstractSubmitted] = useState(false);
  const [abstractCode, setAbstractCode] = useState("");
  const [abstractDetails, setAbstractDetails] = useState(null);

  const handleAbstractSubmission = async () => {
    setIsAbstractFetching(true);
    setAbstractError("");
    try {
      const response = await axios.get(`/api/abstract/${abstractCode}`);
      if (response.data) {
        setAbstractDetails(response.data);
        // Pre-fill form data
        onInputChange({
          target: { name: "email", value: response.data.email },
        } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({
          target: {
            name: "whatsappNumber",
            value: response.data.whatsappNumber,
          },
        } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({
          target: { name: "name", value: response.data.name },
        } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({
          target: { name: "affiliation", value: response.data.affiliation },
        } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({
          target: { name: "designation", value: response.data.designation },
        } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({
          target: { name: "address", value: response.data.address },
        } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({
          target: { name: "city", value: response.data.city },
        } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({
          target: { name: "state", value: response.data.state },
        } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({
          target: { name: "pincode", value: response.data.pincode },
        } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({
          target: { name: "abstractId", value: response.data._id },
        } as React.ChangeEvent<HTMLInputElement>);
        onInputChange({
          target: { name: "abstractSubmitted", value: true },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    } catch (error) {
      console.error("Error fetching abstract details:", error);
      setAbstractError(
        "Failed to fetch abstract details. Please check your abstract code."
      );
    } finally {
      setIsAbstractFetching(false);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        setImageFile(acceptedFiles[0]);
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <form className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4">Registration Form</h3>

      {/* Image Uploader */}
      <div className="mb-6">
        <label className="block mb-2">Profile Picture</label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-accent bg-accent bg-opacity-10"
              : "border-gray-300 hover:border-accent"
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
              <p className="text-sm text-gray-600">{imageFile.name}</p>
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
          <p className="text-danger text-sm mt-2">{uploadError}</p>
        )}
        {errors.imageUrl && (
          <p className="text-danger text-sm mt-1">{errors.imageUrl}</p>
        )}
        {isUploading && (
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-accent h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Uploading: {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Abstract Submission */}
      <div className="mb-6">
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={abstractSubmitted}
            onChange={(e) => setAbstractSubmitted(e.target.checked)}
            className="mr-2"
          />
          I have submitted an abstract
        </label>
        {abstractSubmitted && (
          <div>
            <input
              type="text"
              value={abstractCode}
              onChange={(e) => setAbstractCode(e.target.value)}
              placeholder="Enter your abstract code"
              className="w-full p-2 border rounded mb-2"
            />

            <button
              type="button"
              onClick={handleAbstractSubmission}
              disabled={isAbstractFetching}
              className={`bg-accent text-light px-4 py-2 rounded-md hover:bg-secondary transition duration-300 ${
                isAbstractFetching ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isAbstractFetching ? "Fetching..." : "Fetch Abstract Details"}
            </button>
            {abstractError && (
              <p className="text-danger mt-2">{abstractError}</p>
            )}
          </div>
        )}
      </div>

      {selectedPlanName === "OPF/OBRF Members" && (
        <div className="mb-4">
          <label className="block mb-2">OPF/OBRF Member Id</label>
          <input
            type="text"
            name="memberId"
            value={formData.memberId || ""}
            onChange={onInputChange}
            required
            className="w-full p-2 border rounded"
          />
          <p className="text-sm text-gray-600 mt-1">
            Enter Correct Membership No., Incorrect membership No is subjected
            to Rejection of Registration & payment will be nonrefundable.
          </p>
          {errors.memberId && (
            <p className="text-danger text-sm mt-1">{errors.memberId}</p>
          )}
        </div>
      )}

      {/* Personal Information */}
      <div className="mb-4">
        <label className="block mb-2">Salutation</label>
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

      <div className="mb-4">
        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded"
        />
        {errors.name && (
          <p className="text-danger text-sm mt-1">{errors.name}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">
          Spelling should be correct. The same name will be printed on the
          certificate and cannot be changed after submission.
        </p>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded"
        />
        {errors.email && (
          <p className="text-danger text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">WhatsApp Number</label>
        <input
          type="tel"
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded"
          maxLength={10}
        />
        {errors.whatsappNumber && (
          <p className="text-danger text-sm mt-1">{errors.whatsappNumber}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-danger text-sm mt-1">{errors.gender}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded"
        />
        {errors.dob && <p className="text-danger text-sm mt-1">{errors.dob}</p>}
        <p className="text-sm text-gray-600 mt-1">
          Kindly enter correct Date of Birth to receive E-Certificate of
          conference on your Digilocker account linked with your Aadhar.
        </p>
      </div>

      <div className="mb-6">
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            name="includeGalaDinner"
            checked={includeGalaDinner}
            onChange={handleGalaDinnerChange}
            value={includeGalaDinner ? "true" : "false"}
            className="mr-2"
          />
          Include Networking Cum Gala Dinner (Additional ₹1500)
        </label>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Aadhar Number</label>
        <input
          type="text"
          name="AadharNumber"
          value={formData.AadharNumber}
          onChange={onInputChange}
          className="w-full p-2 border rounded"
          maxLength={12}
        />
        {errors.AadharNumber && (
          <p className="text-danger text-sm mt-1">{errors.AadharNumber}</p>
        )}

        <p className="text-sm text-gray-600 mt-1">
          Kindly enter correct Aadhar Number to receive E-Certificate of
          conference on your Digilocker account linked with your Aadhar.
        </p>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Affiliation/Organization/Institution
        </label>
        <input
          type="text"
          name="affiliation"
          value={formData.affiliation}
          onChange={onInputChange}
          className="w-full p-2 border rounded"
        />
        {errors.affiliation && (
          <p className="text-danger text-sm mt-1">{errors.affiliation}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Designation</label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={onInputChange}
          className="w-full p-2 border rounded"
        />
        {errors.designation && (
          <p className="text-danger text-sm mt-1">{errors.designation}</p>
        )}
      </div>

      {/* Address Information */}
      <div className="mb-4">
        <label className="block mb-2">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded"
        />
        {errors.address && (
          <p className="text-danger text-sm mt-1">{errors.address}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">City</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded"
        />
        {errors.city && (
          <p className="text-danger text-sm mt-1">{errors.city}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">State</label>
        <select
          name="state"
          value={formData.state}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded"
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
          <p className="text-danger text-sm mt-1">{errors.state}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Pincode</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded"
          maxLength={6}
        />
        {errors.pincode && (
          <p className="text-danger text-sm mt-1">{errors.pincode}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-2">Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={onInputChange}
          required
          className="w-full p-2 border rounded"
        />
        {errors.country && (
          <p className="text-danger text-sm mt-1">{errors.country}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="needAccommodation"
            checked={formData.needAccommodation}
            onChange={onInputChange}
            className="mr-2"
          />
          Need Accommodation
        </label>
      </div>
    </form>
  );
};

export default RegistrationForm;
