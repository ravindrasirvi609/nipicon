// utils/tracking.ts
import UAParser from "ua-parser-js";
import { v4 as uuidv4 } from "uuid";

export interface TrackingData {
  page: string;
  userAgent: string;
  deviceType?: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  screenResolution?: string;
  sessionId?: string;
  isNewVisitor: boolean;
  visitCount: number;
  loadTime?: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  connectionType?: string;
  effectiveBandwidth?: number;
}

export const getDeviceInfo = (userAgent: string) => {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  return {
    deviceType: device.type || "desktop",
    browser: browser.name,
    browserVersion: browser.version,
    os: os.name,
    osVersion: os.version,
  };
};

export const getSessionId = () => {
  if (typeof window === "undefined") return null;

  let sessionId = sessionStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem("session_id", sessionId);
  }
  return sessionId;
};

export const getVisitorInfo = () => {
  if (typeof window === "undefined")
    return { isNewVisitor: true, visitCount: 1 };

  const visitCount =
    parseInt(localStorage.getItem("visit_count") || "0", 10) + 1;
  localStorage.setItem("visit_count", visitCount.toString());

  return {
    isNewVisitor: visitCount === 1,
    visitCount,
  };
};

export const getPerformanceMetrics = () => {
  if (typeof window === "undefined") return {};

  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType("paint");

  return {
    loadTime: navigation?.loadEventEnd - navigation?.startTime,
    firstPaint: paint.find((p) => p.name === "first-paint")?.startTime,
    firstContentfulPaint: paint.find((p) => p.name === "first-contentful-paint")
      ?.startTime,
  };
};

export const getConnectionInfo = () => {
  if (typeof window === "undefined") return {};

  const connection = (navigator as any).connection;

  return {
    connectionType: connection?.effectiveType,
    effectiveBandwidth: connection?.downlink,
  };
};
