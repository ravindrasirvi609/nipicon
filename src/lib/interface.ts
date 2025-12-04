export interface RegistrationFormData {
  email: string;
  whatsappNumber: string;
  Salutations: "Mr." | "Ms." | "Mrs." | "Dr." | "Prof.";
  firstName: string;
  lastName: string;
  name: string; // Full Name for Certificate
  affiliation: string;
  designation: string;
  gender: "Male" | "Female" | "Other";
  imageUrl: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  institute: string;
  memberId: string;
  registrationType: string;
  applyingAs: "Individual" | "Group";
  registeringAs: "Delegate" | "Delegate as Presenter";
  idCardUrl?: string;
  abstractSubmitted: boolean;
  abstractId: string | null;

  // Payment Details
  paymentAmount: number;
  transactionId: string; // UTR
  bankName: string;
  branchName: string;
  paymentDate: string;
  paymentProofUrl: string;
}

export interface RegistrationInfo {
  abstract: {
    _id?: string;
    url?: string;
    qrCodeUrl?: string;
    temporyAbstractCode?: string;
    AbstractCode?: string;
    Status?: string;
    title?: string;
    name?: string;
    email?: string;
    affiliation?: string;
    coAuthor?: string;
    presentationType?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    whatsappNumber?: string;
    abstractFileUrl?: string;
    rejectionComment?: string;
    createdAt?: string;
    updatedAt?: string;
    articleType?: string;
    presentationFileStatus?: string;
    presentationFileUrl?: string;
  };

  registration: {
    _id?: string;
    email?: string;
    whatsappNumber?: string;
    Salutations?: string;
    name?: string;
    affiliation?: string;
    designation?: string;
    imageUrl?: string;
    gender?: string;
    dob?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    institute?: string;
    registrationType?: string;
    abstractSubmitted?: boolean;
    abstractId?: string;
    paymentStatus?: string;
    registrationStatus?: string;
    createdAt?: string;
    updatedAt?: string;
    paymentAmount?: number;
    paymentDate?: string;
    registrationCode?: string;
    transactionId?: string;
    qrCodeUrl?: string;
    presentationType?: string;
    articleType?: string;
    feesReceiptUrl?: string;
    bankName?: string;
    branchName?: string;
    utrNumber?: string;
    paymentProofUrl?: string;
    memberId?: string;
    rejectionReason?: string;
    includeGalaDinner?: boolean;
    idCardUrl?: string;
    groupCode?: string;
    applyingAs?: string;
    registeringAs?: string;
  };
}

export interface Plan {
  name: string;
  description: string;
  spot: number;
  currency?: string;
}

export interface Abstract {
  presentationFileUrl?: string;
  presentationFileStatus?: string;
  presentationRejectionComment?: string;
}
