import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export interface Registration {
  _id: string;
  email: string;
  whatsappNumber: string;
  Salutations: string;
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
  abstractSubmitted: boolean;
  abstractId: string;
  paymentStatus: string;
  registrationStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  paymentAmount: number;
  paymentDate: string;
  registrationCode: string;
  transactionId: string;
  fullAddress: string;
  id: string;
}

export const exportToExcel = (
  registrationData: Registration[],
  fileName: string
) => {
  // Prepare the data for export
  const exportData = registrationData.map((item) => ({
    "Registration ID": item.registrationCode,
    Email: item.email,
    "WhatsApp Number": item.whatsappNumber,
    Salutation: item.Salutations,
    Name: item.name,
    Affiliation: item.affiliation,
    Designation: item.designation,
    "Image URL": item.imageUrl,
    Gender: item.gender,
    "Date of Birth": new Date(item.dob).toLocaleDateString(),
    Address: item.address,
    City: item.city,
    State: item.state,
    Pincode: item.pincode,
    Country: item.country,
    Institute: item.institute,
    "Registration Type": item.registrationType,
    "Abstract Submitted": item.abstractSubmitted ? "Yes" : "No",
    "Abstract ID": item.abstractId,
    "Payment Status": item.paymentStatus,
    paymentAmount: item.paymentAmount,
    "Payment Date": new Date(item.paymentDate).toLocaleString(),
    "Registration Status": item.registrationStatus,
    "Created At": new Date(item.createdAt).toLocaleString(),
    "Updated At": new Date(item.updatedAt).toLocaleString(),
    "Full Address": item.fullAddress,
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
  createdAt: string;
  updatedAt: string;
  presentationFileUrl: string;
  presentationFileStatus: string;
}

export const exportAbstractsToExcel = (
  abstractData: Abstract[],
  fileName: string
) => {
  // Prepare the data for export
  const exportData = abstractData.map((item) => ({
    "Abstract ID": item.AbstractCode,
    "Temporary Abstract Code": item.temporyAbstractCode,
    Title: item.title,
    Subject: item.subject,
    Name: item.name,
    Email: item.email,
    "WhatsApp Number": item.whatsappNumber,
    Designation: item.designation,
    Affiliation: item.affiliation,
    "Co-Author": item.coAuthor,
    "Registration Completed": item.registrationCompleted ? "Yes" : "No",
    "Registration Code": item.registrationCode,
    Status: item.Status,
    "Abstract File URL": item.abstractFileUrl,
    "Presentation Type": item.presentationType,
    presentationFileUrl: item.presentationFileUrl,
    presentationFileStatus: item.presentationFileStatus,
    Address: item.address,
    City: item.city,
    State: item.state,
    Pincode: item.pincode,
    "QR Code URL": item.qrCodeUrl,
    "Rejection Comment": item.rejectionComment,
    "Article Type": item.articleType,
    "Created At": new Date(item.createdAt).toLocaleString(),
    "Updated At": new Date(item.updatedAt).toLocaleString(),
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
