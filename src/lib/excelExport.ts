import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getCategoryCode, getTrackCode } from "@/data";

export interface Registration {
  _id: string;
  email: string;
  whatsappNumber: string;
  Salutations: string;
  firstName: string;
  lastName: string;
  name: string;
  affiliation: string;
  designation: string;
  imageUrl: string;
  gender: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  institute: string;
  registrationType: string;
  applyingAs: string;
  registeringAs: string;
  abstractSubmitted: boolean;
  abstractId: string;
  paymentStatus: string;
  paymentAmount: number;
  paymentDate: string;
  transactionId: string;
  utrNumber: string;
  bankName: string;
  branchName: string;
  paymentProofUrl: string;
  idCardUrl: string;
  registrationStatus: string;
  registrationCode: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullAddress: string;
  id: string;
}

export const exportToExcel = (
  registrationData: Registration[],
  fileName: string
) => {
  // Prepare the data for export
  const exportData = registrationData.map((item) => ({
    "Registration Code": item.registrationCode,
    "Category Code": getCategoryCode(item.registrationType),
    Category: item.registrationType,
    "Applying As": item.applyingAs || "Individual",
    "Registering As": item.registeringAs || "Delegate",
    Salutation: item.Salutations,
    "First Name": item.firstName,
    "Last Name": item.lastName,
    "Full Name (Certificate)": item.name,
    Email: item.email,
    "WhatsApp Number": item.whatsappNumber,
    Designation: item.designation,
    Affiliation: item.affiliation,
    Address: item.address,
    City: item.city,
    State: item.state,
    "PIN Code": item.pincode,
    Country: item.country,
    "Payment Status": item.paymentStatus,
    "Payment Amount": item.paymentAmount,
    "UTR Number": item.transactionId || item.utrNumber,
    "Bank Name": item.bankName,
    "Branch Name": item.branchName,
    "Payment Date": item.paymentDate
      ? new Date(item.paymentDate).toLocaleDateString()
      : "",
    "Payment Proof URL": item.paymentProofUrl,
    "ID Card URL": item.idCardUrl,
    "Abstract Submitted": item.abstractSubmitted ? "Yes" : "No",
    "Registration Status": item.registrationStatus,
    "Registration Date": new Date(item.createdAt).toLocaleDateString(),
  }));

  // Create a new workbook and add the data
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Registrations");

  // Generate the Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Save the file
  saveAs(data, `${fileName}.xlsx`);
};

export interface Abstract {
  _id: string;
  title: string;
  subject: string;
  name: string;
  email: string;
  designation: string;
  temporyAbstractCode: string;
  AbstractCode: string;
  registrationCompleted: boolean;
  registrationCode: string;
  Status: string;
  abstractFileUrl: string;
  presentationType: string;
  whatsappNumber: string;
  affiliation: string;
  coAuthor: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  qrCodeUrl: string;
  rejectionComment: string;
  articleType: string;
  paperType: string;
  createdAt: string;
  updatedAt: string;
  presentationFileUrl: string;
  presentationFileStatus: string;
  isForeignDelegate: boolean;
  isPharmaInnovatorAward: boolean;
  declarationAccepted: boolean;
  // Supervisor fields for Pharma Innovator Award
  supervisorName: string;
  supervisorDesignation: string;
  supervisorAffiliation: string;
  supervisorAddress: string;
  supervisorEmail: string;
  supervisorContact: string;
  declarationFormUrl: string;
  briefProfileUrl: string;
  isAbstractRevisionRequested?: boolean;
  isDeclarationRevisionRequested?: boolean;
  isProfileRevisionRequested?: boolean;
}

export const exportAbstractsToExcel = (
  abstractData: Abstract[],
  fileName: string
) => {
  // Prepare the data for export
  const exportData = abstractData.map((item) => ({
    "Track Code": getTrackCode(item.subject),
    Track: item.subject,
    "Temp Abstract Code": item.temporyAbstractCode,
    "Final Abstract Code": item.AbstractCode,
    Title: item.title,
    "Paper Type": item.articleType || item.paperType,
    "Presentation Type": item.presentationType,
    "Author Name": item.name,
    Email: item.email,
    WhatsApp: item.whatsappNumber,
    Designation: item.designation,
    Affiliation: item.affiliation,
    "Co-Authors": item.coAuthor,
    City: item.city,
    State: item.state,
    "PIN Code": item.pincode,
    "Foreign Delegate": item.isForeignDelegate ? "Yes" : "No",
    "Pharma Innovator Award": item.isPharmaInnovatorAward ? "Yes" : "No",
    "Declaration Accepted": item.declarationAccepted ? "Yes" : "No",
    "Abstract Status": item.Status,
    "Registration Completed": item.registrationCompleted ? "Yes" : "No",
    "Registration Code": item.registrationCode,
    "Abstract File URL": item.abstractFileUrl,
    "Presentation File URL": item.presentationFileUrl,
    "Presentation Status": item.presentationFileStatus,
    "Revision Comment": item.rejectionComment,
    // Supervisor details (for PIA)
    "Supervisor Name": item.supervisorName || "",
    "Supervisor Designation": item.supervisorDesignation || "",
    "Supervisor Affiliation": item.supervisorAffiliation || "",
    "Supervisor Email": item.supervisorEmail || "",
    "Supervisor Contact": item.supervisorContact || "",
    "Declaration Form URL": item.declarationFormUrl || "",
    "Brief Profile URL": item.briefProfileUrl || "",
    "Submission Date": new Date(item.createdAt).toLocaleDateString(),
    "Last Updated": new Date(item.updatedAt).toLocaleDateString(),
  }));

  // Create a new workbook and add the data
  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Abstracts");

  // Generate the Excel file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Save the file
  saveAs(data, `${fileName}.xlsx`);
};
