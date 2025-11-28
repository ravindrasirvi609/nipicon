"use client";

import { useFirebaseStorage } from "@/app/hooks/useFirebaseStorage";
import { designationOptions, indianStates, subjectOptions } from "@/data";
import axios from "axios";
import { useState, ChangeEvent, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Errors {
  email?: string;
  whatsappNumber?: string;
  name?: string;
  affiliation?: string;
  Designation?: string;
  title?: string;
  subject?: string;
  abstractFile?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  articleType?: string;
}

export function AbstractForm() {
  const {
    uploadFile,
    uploadProgress,
    isUploading,
    error: uploadError,
  } = useFirebaseStorage();

  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [Designation, setDesignation] = useState("");
  const [coAuthor, setCoAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [abstractFile, setAbstractFile] = useState<File | null>(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [articleType, setArticleType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setAbstractFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsLoading(true);
    setSubmitError("");
    const newErrors: Errors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!whatsappNumber) {
      newErrors.whatsappNumber = "WhatsApp number is required";
    } else if (!/^[1-9]\d{9}$/.test(whatsappNumber)) {
      newErrors.whatsappNumber = "Invalid WhatsApp number format";
    }
    if (!name) {
      newErrors.name = "Name is required";
    }
    if (!affiliation) {
      newErrors.affiliation = "Affiliation is required";
    }
    if (!title) {
      newErrors.title = "Title is required";
    }
    if (!subject) {
      newErrors.subject = "Subject is required";
    }
    if (!articleType) {
      newErrors.articleType = "Article Type is required";
    }
    if (!abstractFile) {
      newErrors.abstractFile = "Abstract file is required";
    } else if (abstractFile.size > 5 * 1024 * 1024) {
      newErrors.abstractFile = "Abstract file must be less than 5 MB";
    } else if (
      ![
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(abstractFile.type)
    ) {
      newErrors.abstractFile = "Only document files are allowed";
    }
    if (!address) {
      newErrors.address = "Address is required";
    }
    if (!city) {
      newErrors.city = "City is required";
    }
    if (!state) {
      newErrors.state = "State is required";
    }
    if (!pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Invalid pincode format";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      let downloadURL;
      if (abstractFile) {
        downloadURL = await uploadFile(abstractFile);
        console.log("File uploaded successfully. URL:", downloadURL);
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("whatsappNumber", whatsappNumber);
      formData.append("name", name);
      formData.append("affiliation", affiliation);
      formData.append("designation", Designation);
      formData.append("coAuthor", coAuthor);
      formData.append("title", title);
      formData.append("subject", subject);
      if (downloadURL) {
        formData.append("abstractFile", downloadURL);
      }
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pincode", pincode);
      formData.append("articleType", articleType);

      try {
        const response = await axios.post("/api/submitAbstract", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          const result = response.data;
          if (result.abstract) {
            alert(
              "Your Abstract Submitted Successfully! You will be redirected to the abstract page"
            );
            window.location.href = `/abstractForm/${result.abstract._id}`;
          } else {
            throw new Error("Failed to submit abstract");
          }
        } else {
          throw new Error("Failed to submit abstract");
        }
      } catch (error: any) {
        console.log("Error:", error);

        if (error.response) {
          if (error.response.status === 409) {
            setSubmitError("An abstract with this email already exists");
          } else {
            setSubmitError(
              error.response.data.message || "Failed to submit abstract"
            );
          }
        } else if (error.request) {
          setSubmitError("No response received from server");
        } else {
          setSubmitError(error.message);
        }
      } finally {
        setIsSubmitting(false);
        setIsLoading(false);
      }
    } else {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-4xl font-bold text-center text-[#021373] mb-2">
        Conference Abstract Submission
      </h1>
      <p className="text-center text-[#CACACA] mb-8">
        Please fill out the form below to submit your abstract.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#022873] mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border text-black border-[#CACACA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
              placeholder="Enter your email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            {errors.email && (
              <p className="text-[#D94814] text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="whatsappNumber"
              className="block text-sm font-medium text-[#022873] mb-1"
            >
              WhatsApp Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-[#CACACA] bg-[#F2F2F2] border border-r-0 border-[#CACACA] rounded-l-md">
                +91
              </span>
              <input
                id="whatsappNumber"
                type="tel"
                className="flex-1 px-3 py-2 border text-black border-[#CACACA] rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
                placeholder="Enter your WhatsApp number"
                value={whatsappNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setWhatsappNumber(e.target.value)
                }
                maxLength={10}
              />
            </div>
            {errors.whatsappNumber && (
              <p className="text-[#D94814] text-sm mt-1">
                {errors.whatsappNumber}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#022873] mb-1"
          >
            Author Full Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-3 py-2 border text-black border-[#CACACA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
            placeholder="Enter your name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          {errors.name && (
            <p className="text-[#D94814] text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="Designation"
            className="block text-sm font-medium text-[#022873] mb-1"
          >
            Designation
          </label>
          <select
            id="Designation"
            className="w-full px-3 py-2 border border-[#CACACA] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
            value={Designation}
            onChange={(e) => setDesignation(e.target.value)}
          >
            <option value="">Select a Designation</option>
            {designationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="text-[#D94814] text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="affiliation"
            className="block text-sm font-medium text-[#022873] mb-1"
          >
            Institute Name
          </label>
          <input
            id="affiliation"
            type="text"
            className="w-full px-3 py-2 border text-black border-[#CACACA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
            placeholder="Enter your Institute name"
            value={affiliation}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAffiliation(e.target.value)
            }
          />
          {errors.affiliation && (
            <p className="text-[#D94814] text-sm mt-1">{errors.affiliation}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="coAuthor"
            className="block text-sm font-medium text-[#022873] mb-1"
          >
            Co-Author (if any)
          </label>
          <input
            id="coAuthor"
            type="text"
            className="w-full px-3 py-2 border text-black border-[#CACACA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
            placeholder="Enter co-author's name"
            value={coAuthor}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCoAuthor(e.target.value)
            }
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-[#022873] mb-1"
          >
            Select Presentation Subject
          </label>
          <select
            id="subject"
            className="w-full px-3 py-2 border text-black border-[#CACACA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select a subject</option>
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="text-[#D94814] text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="articleType"
            className="block text-sm font-medium text-[#022873] mb-1"
          >
            Article Type
          </label>
          <select
            id="articleType"
            className="w-full px-3 py-2 border border-[#CACACA] text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
            value={articleType}
            onChange={(e) => setArticleType(e.target.value)}
          >
            <option value="">Select a Article Types</option>
            <option value="reviewArticle">Review Article</option>
            <option value="researchArticle">Research Article</option>
          </select>
          {errors.articleType && (
            <p className="text-[#D94814] text-sm mt-1">{errors.articleType}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[#022873] mb-1"
          >
            Title of Abstract
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-3 py-2 border text-black border-[#CACACA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
            placeholder="Enter the title of your abstract"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
          {errors.title && (
            <p className="text-[#D94814] text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="space-y-4">
          <label
            htmlFor="abstractFile"
            className="block text-sm font-medium text-[#022873]"
          >
            Upload Abstract File
          </label>
          <div
            {...getRootProps()}
            className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ease-in-out ${
              isDragActive
                ? "border-[#034C8C] bg-[#F0F7FF]"
                : "border-[#CACACA] hover:border-[#034C8C] hover:bg-[#F7FAFC]"
            }`}
          >
            <input {...getInputProps()} id="abstractFile" />
            <p className="text-[#022873]">
              {isDragActive
                ? "Drop the file here..."
                : "Drag & drop your abstract file here, or click to select"}
            </p>
            <p className="text-sm text-[#6B7280] mt-2">
              Supported formats: .doc, .docx (Max size: 5MB)
            </p>
          </div>
          {abstractFile && (
            <div className="flex items-center space-x-2 text-sm text-[#022873]">
              <svg
                className="w-5 h-5 text-[#034C8C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{abstractFile.name}</span>
            </div>
          )}
          {errors.abstractFile && (
            <p className="text-[#D94814] text-sm mt-1">{errors.abstractFile}</p>
          )}
          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-[#022873]">
                  Uploading
                </span>
                <span className="text-sm font-medium text-[#022873]">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-[#F2F2F2] rounded-full h-2.5">
                <div
                  className="bg-[#034C8C] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          {uploadError && (
            <div className="flex items-center space-x-2 text-[#D94814] mt-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{uploadError}</span>
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-[#022873] mb-1"
          >
            Address for Communication
          </label>
          <textarea
            id="address"
            className="w-full px-3 py-2 border text-black border-[#CACACA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
            rows={3}
            placeholder="Enter your address"
            value={address}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setAddress(e.target.value)
            }
          ></textarea>
          {errors.address && (
            <p className="text-[#D94814] text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-[#022873] mb-1"
            >
              City
            </label>
            <input
              id="city"
              type="text"
              className="w-full px-3 py-2 border text-black border-[#CACACA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
              placeholder="Enter your city"
              value={city}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCity(e.target.value)
              }
            />
            {errors.city && (
              <p className="text-[#D94814] text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-[#022873] mb-1"
            >
              State
            </label>
            <select
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="w-full px-3 py-2 border text-black border-[#CACACA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
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
              <p className="text-[#D94814] text-sm mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="pincode"
              className="block text-sm font-medium text-[#022873] mb-1"
            >
              Pincode
            </label>
            <input
              id="pincode"
              type="text"
              className="w-full px-3 py-2 border text-black border-[#CACACA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#034C8C]"
              placeholder="Enter your pincode"
              value={pincode}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPincode(e.target.value)
              }
              max={6}
            />
            {errors.pincode && (
              <p className="text-[#D94814] text-sm mt-1">{errors.pincode}</p>
            )}
          </div>
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-[#fa9e9e] border border-red-400 text-red-700 rounded">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          className={`w-full font-bold py-3 px-4 rounded-md transition duration-300 ${
            isSubmitting || isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#021373] text-white hover:bg-[#022873]"
          }`}
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="transition-opacity duration-300 ease-in-out">
                {isSubmitting ? "Submitting..." : "Loading..."}
              </span>
            </div>
          ) : (
            "Submit Abstract"
          )}
        </button>
      </form>
    </div>
  );
}

export default AbstractForm;
