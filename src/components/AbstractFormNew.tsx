"use client";

import { useFirebaseStorage } from "@/app/hooks/useFirebaseStorage";
import { designationOptions, indianStates, tracks } from "@/data";
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
  paperType?: string;
  presentationType?: string;
  declaration?: string;
  supervisorName?: string;
  supervisorDesignation?: string;
  supervisorAffiliation?: string;
  supervisorAddress?: string;
  supervisorEmail?: string;
  supervisorContact?: string;
  declarationForm?: string;
  briefProfile?: string;
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
  const [isLoading, setIsLoading] = useState(false);

  // New Fields
  const [paperType, setPaperType] = useState("");
  const [presentationType, setPresentationType] = useState("");
  const [isForeignDelegate, setIsForeignDelegate] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Pharma Innovator Award
  const [isPharmaInnovatorAward, setIsPharmaInnovatorAward] = useState(false);
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorDesignation, setSupervisorDesignation] = useState("");
  const [supervisorAffiliation, setSupervisorAffiliation] = useState("");
  const [supervisorAddress, setSupervisorAddress] = useState("");
  const [supervisorEmail, setSupervisorEmail] = useState("");
  const [supervisorContact, setSupervisorContact] = useState("");
  const [declarationForm, setDeclarationForm] = useState<File | null>(null);
  const [briefProfile, setBriefProfile] = useState<File | null>(null);

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

  const {
    getRootProps: getDeclarationRootProps,
    getInputProps: getDeclarationInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => setDeclarationForm(acceptedFiles[0]),
    accept: { "application/pdf": [] },
    multiple: false,
  });

  const {
    getRootProps: getProfileRootProps,
    getInputProps: getProfileInputProps,
  } = useDropzone({
    onDrop: (acceptedFiles) => setBriefProfile(acceptedFiles[0]),
    accept: { "application/pdf": [] },
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
    if (!subject && !isPharmaInnovatorAward) {
      newErrors.subject = "Paper Track is required";
    }
    if (!presentationType) {
      newErrors.presentationType = "Presentation Type is required";
    }
    if (!paperType) {
      newErrors.paperType = "Paper Type is required";
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
    if (!declarationAccepted) {
      newErrors.declaration = "You must accept the declaration";
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

    if (isPharmaInnovatorAward) {
      if (!supervisorName)
        newErrors.supervisorName = "Supervisor Name is required";
      if (!supervisorDesignation)
        newErrors.supervisorDesignation = "Supervisor Designation is required";
      if (!supervisorAffiliation)
        newErrors.supervisorAffiliation = "Supervisor Affiliation is required";
      if (!supervisorAddress)
        newErrors.supervisorAddress = "Supervisor Address is required";
      if (!supervisorEmail)
        newErrors.supervisorEmail = "Supervisor Email is required";
      if (!supervisorContact)
        newErrors.supervisorContact = "Supervisor Contact is required";
      if (!declarationForm)
        newErrors.declarationForm = "Declaration Form is required";
      if (!briefProfile) newErrors.briefProfile = "Brief Profile is required";
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

      // Paper Details
      formData.append("paperType", paperType);
      formData.append("presentationType", presentationType);
      formData.append("isForeignDelegate", isForeignDelegate.toString());
      formData.append("declarationAccepted", declarationAccepted.toString());
      formData.append(
        "isPharmaInnovatorAward",
        isPharmaInnovatorAward.toString()
      );

      if (isPharmaInnovatorAward) {
        formData.append("supervisorName", supervisorName);
        formData.append("supervisorDesignation", supervisorDesignation);
        formData.append("supervisorAffiliation", supervisorAffiliation);
        formData.append("supervisorAddress", supervisorAddress);
        formData.append("supervisorEmail", supervisorEmail);
        formData.append("supervisorContact", supervisorContact);
        if (declarationForm) {
          const url = await uploadFile(declarationForm);
          formData.append("declarationFormUrl", url);
        }
        if (briefProfile) {
          const url = await uploadFile(briefProfile);
          formData.append("briefProfileUrl", url);
        }
      }

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

  const inputClasses =
    "w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400";
  const labelClasses =
    "block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300";
  const sectionTitleClasses =
    "text-xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2";

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/30">
      <h1 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-2">
        Conference Abstract Submission
      </h1>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-12">
        Please fill out the form below to submit your abstract.
      </p>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={inputClasses}
              placeholder="Enter your email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="whatsappNumber" className={labelClasses}>
              WhatsApp Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-sm text-slate-500 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
                +91
              </span>
              <input
                id="whatsappNumber"
                type="tel"
                className={`${inputClasses} rounded-l-none`}
                placeholder="Enter your WhatsApp number"
                value={whatsappNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setWhatsappNumber(e.target.value)
                }
                maxLength={10}
              />
            </div>
            {errors.whatsappNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.whatsappNumber}
              </p>
            )}
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPharmaInnovatorAward}
              onChange={(e) => setIsPharmaInnovatorAward(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
            />
            <span className="text-indigo-900 dark:text-indigo-300 font-bold text-lg">
              Apply for Pharma Innovator Award
            </span>
          </label>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 ml-8">
            Note: You can apply either for "Pharma Innovator Award" or "Any one
            Track out of Five".
          </p>
        </div>

        {!isPharmaInnovatorAward && (
          <div>
            <label htmlFor="subject" className={labelClasses}>
              Paper Track
            </label>
            <select
              id="subject"
              className={inputClasses}
              value={subject}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSubject(e.target.value)
              }
            >
              <option value="">Select a Track</option>
              {tracks.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="name" className={labelClasses}>
            Author Full Name
          </label>
          <input
            id="name"
            type="text"
            className={inputClasses}
            placeholder="Enter your name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="Designation" className={labelClasses}>
            Designation
          </label>
          <select
            id="Designation"
            className={inputClasses}
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
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label htmlFor="affiliation" className={labelClasses}>
            Institute Name
          </label>
          <input
            id="affiliation"
            type="text"
            className={inputClasses}
            placeholder="Enter your Institute name"
            value={affiliation}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAffiliation(e.target.value)
            }
          />
          {errors.affiliation && (
            <p className="text-red-500 text-sm mt-1">{errors.affiliation}</p>
          )}
        </div>

        <div>
          <label htmlFor="coAuthor" className={labelClasses}>
            Co-Author (if any)
          </label>
          <input
            id="coAuthor"
            type="text"
            className={inputClasses}
            placeholder="Enter co-author's name"
            value={coAuthor}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCoAuthor(e.target.value)
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Presentation Type</label>
            <select
              className={inputClasses}
              value={presentationType}
              onChange={(e) => setPresentationType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Poster">Poster</option>
              <option value="Oral">Oral</option>
            </select>
            {errors.presentationType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.presentationType}
              </p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Paper Type</label>
            <select
              className={inputClasses}
              value={paperType}
              onChange={(e) => setPaperType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Review">Review</option>
              <option value="Research">Research</option>
            </select>
            {errors.paperType && (
              <p className="text-red-500 text-sm mt-1">{errors.paperType}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClasses}>
            Are you Foreign Delegate for Online Oral Presentation?
          </label>
          <select
            className={inputClasses}
            value={isForeignDelegate ? "Yes" : "No"}
            onChange={(e) => setIsForeignDelegate(e.target.value === "Yes")}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div>
          <label htmlFor="title" className={labelClasses}>
            Title of Paper (Short Statement)
          </label>
          <input
            id="title"
            type="text"
            className={inputClasses}
            placeholder="Enter abstract title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="space-y-4 bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <label htmlFor="abstractFile" className={labelClasses}>
            Upload Abstract File
          </label>
          <div
            {...getRootProps()}
            className={`w-full p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                : "border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <input {...getInputProps()} id="abstractFile" />
            <div className="flex flex-col items-center gap-3">
              <svg
                className="w-10 h-10 text-slate-400"
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
              <p className="text-slate-900 dark:text-white font-medium">
                {isDragActive
                  ? "Drop the file here..."
                  : "Drag & drop your abstract file here, or click to select"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Supported formats: .doc, .docx (Max size: 5MB)
              </p>
            </div>
          </div>
          {abstractFile && (
            <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
              <svg
                className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-indigo-900 dark:text-indigo-300 font-medium">
                {abstractFile.name}
              </span>
            </div>
          )}
          {errors.abstractFile && (
            <p className="text-red-500 text-sm mt-1">{errors.abstractFile}</p>
          )}
          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-indigo-900 dark:text-indigo-300">
                  Uploading
                </span>
                <span className="text-sm font-medium text-indigo-900 dark:text-indigo-300">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          {uploadError && (
            <div className="flex items-center space-x-2 text-red-500 mt-2">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{uploadError}</span>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="address" className={labelClasses}>
            Address for Communication
          </label>
          <textarea
            id="address"
            className={inputClasses}
            rows={3}
            placeholder="Enter your address"
            value={address}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setAddress(e.target.value)
            }
          ></textarea>
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="city" className={labelClasses}>
              City
            </label>
            <input
              id="city"
              type="text"
              className={inputClasses}
              placeholder="Enter your city"
              value={city}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCity(e.target.value)
              }
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <label htmlFor="state" className={labelClasses}>
              State
            </label>
            <select
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
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

          <div>
            <label htmlFor="pincode" className={labelClasses}>
              Pincode
            </label>
            <input
              id="pincode"
              type="text"
              className={inputClasses}
              placeholder="Enter your pincode"
              value={pincode}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPincode(e.target.value)
              }
              maxLength={6}
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
            )}
          </div>
        </div>

        {submitError && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-center gap-2">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {submitError}
          </div>
        )}

        {isPharmaInnovatorAward && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-8 mt-8">
            <h3 className={sectionTitleClasses}>Supervisor Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Name</label>
                <input
                  type="text"
                  className={inputClasses}
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                />
                {errors.supervisorName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.supervisorName}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClasses}>Designation</label>
                <input
                  type="text"
                  className={inputClasses}
                  value={supervisorDesignation}
                  onChange={(e) => setSupervisorDesignation(e.target.value)}
                />
                {errors.supervisorDesignation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.supervisorDesignation}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClasses}>Affiliation</label>
                <input
                  type="text"
                  className={inputClasses}
                  value={supervisorAffiliation}
                  onChange={(e) => setSupervisorAffiliation(e.target.value)}
                />
                {errors.supervisorAffiliation && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.supervisorAffiliation}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClasses}>Postal Address</label>
                <input
                  type="text"
                  className={inputClasses}
                  value={supervisorAddress}
                  onChange={(e) => setSupervisorAddress(e.target.value)}
                />
                {errors.supervisorAddress && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.supervisorAddress}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClasses}>Email Address</label>
                <input
                  type="email"
                  className={inputClasses}
                  value={supervisorEmail}
                  onChange={(e) => setSupervisorEmail(e.target.value)}
                />
                {errors.supervisorEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.supervisorEmail}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClasses}>Contact Number</label>
                <input
                  type="tel"
                  className={inputClasses}
                  value={supervisorContact}
                  onChange={(e) => setSupervisorContact(e.target.value)}
                />
                {errors.supervisorContact && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.supervisorContact}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className={labelClasses}>Upload Declaration Form</label>
              <div
                {...getDeclarationRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                  declarationForm
                    ? "border-green-500 bg-green-50/50 dark:bg-green-900/20"
                    : "border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <input {...getDeclarationInputProps()} />
                {declarationForm ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
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
                    <span className="font-medium">{declarationForm.name}</span>
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
                      Upload Declaration Form (PDF)
                    </p>
                  </div>
                )}
              </div>
              {errors.declarationForm && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.declarationForm}
                </p>
              )}
            </div>

            <div className="mt-6">
              <label className={labelClasses}>
                Upload Brief Profile (CV, Research Output, etc.)
              </label>
              <div
                {...getProfileRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                  briefProfile
                    ? "border-green-500 bg-green-50/50 dark:bg-green-900/20"
                    : "border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <input {...getProfileInputProps()} />
                {briefProfile ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
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
                    <span className="font-medium">{briefProfile.name}</span>
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
                      Upload Brief Profile (PDF)
                    </p>
                  </div>
                )}
              </div>
              {errors.briefProfile && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.briefProfile}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mb-6 mt-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={declarationAccepted}
              onChange={(e) => setDeclarationAccepted(e.target.checked)}
              className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
            />
            <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              I hereby declare that this is my original work and it is not
              plagiarised. I understand that plagiarism will lead to rejection
              of the abstract.
            </span>
          </label>
          {errors.declaration && (
            <p className="text-red-500 text-sm mt-2 ml-8">
              {errors.declaration}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
            isSubmitting || isLoading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white"
          }`}
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              <span>{isSubmitting ? "Submitting..." : "Loading..."}</span>
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
