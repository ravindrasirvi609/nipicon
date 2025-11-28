import mongoose, { Schema, Document } from "mongoose";

export interface IPageView extends Document {
  timestamp: Date;
  // Basic Info
  page: string;
  userAgent: string;
  country?: string;
  ip?: string;
  referrer?: string;
  language?: string;

  // Device Information
  deviceType?: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  screenResolution?: string;

  // Session Information
  sessionId?: string;
  isNewVisitor: boolean;
  visitCount: number;

  // Page Performance
  loadTime?: number;
  firstPaint?: number;
  firstContentfulPaint?: number;

  // User Behavior
  timeOnPage?: number;
  scrollDepth?: number;
  exitPage?: string;

  // Campaign Tracking
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;

  // Technical Details
  connectionType?: string;
  effectiveBandwidth?: number;

  createdAt: Date;
  updatedAt: Date;
}

const PageViewSchema = new Schema<IPageView>(
  {
    timestamp: { type: Date, default: Date.now },

    // Basic Info
    page: { type: String, required: true },
    userAgent: { type: String, required: true },
    country: String,
    ip: String,
    referrer: String,
    language: String,

    // Device Information
    deviceType: String,
    browser: String,
    browserVersion: String,
    os: String,
    osVersion: String,
    screenResolution: String,

    // Session Information
    sessionId: String,
    isNewVisitor: { type: Boolean, default: false },
    visitCount: { type: Number, default: 1 },

    // Page Performance
    loadTime: Number,
    firstPaint: Number,
    firstContentfulPaint: Number,

    // User Behavior
    timeOnPage: Number,
    scrollDepth: Number,
    exitPage: String,

    // Campaign Tracking
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmTerm: String,
    utmContent: String,

    // Technical Details
    connectionType: String,
    effectiveBandwidth: Number,
  },
  {
    timestamps: true,
  }
);

// models/UserClick.ts
export interface IUserClick extends Document {
  pageViewId: mongoose.Types.ObjectId;
  elementId?: string;
  elementClass?: string;
  elementText?: string;
  xPosition: number;
  yPosition: number;
  timestamp: Date;
}

const UserClickSchema = new Schema<IUserClick>({
  pageViewId: { type: Schema.Types.ObjectId, ref: "PageView", required: true },
  elementId: String,
  elementClass: String,
  elementText: String,
  xPosition: { type: Number, required: true },
  yPosition: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// models/UserEvent.ts
export interface IUserEvent extends Document {
  pageViewId: mongoose.Types.ObjectId;
  eventType: string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
  eventValue?: number;
  timestamp: Date;
}

const UserEventSchema = new Schema<IUserEvent>({
  pageViewId: { type: Schema.Types.ObjectId, ref: "PageView", required: true },
  eventType: { type: String, required: true },
  eventCategory: String,
  eventAction: String,
  eventLabel: String,
  eventValue: Number,
  timestamp: { type: Date, default: Date.now },
});

// Export models
export const PageView =
  mongoose.models.PageView ||
  mongoose.model<IPageView>("PageView", PageViewSchema);
export const UserClick =
  mongoose.models.UserClick ||
  mongoose.model<IUserClick>("UserClick", UserClickSchema);
export const UserEvent =
  mongoose.models.UserEvent ||
  mongoose.model<IUserEvent>("UserEvent", UserEventSchema);
