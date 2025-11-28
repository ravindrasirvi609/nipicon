import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  message = "Loading...",
  size = "default",
  showMessage = true,
}) => {
  // Calculate classes based on size prop
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-4 h-4";
      case "large":
        return "w-12 h-12";
      default:
        return "w-8 h-8";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-32 space-y-4">
      <div className="relative">
        {/* Primary spinner */}
        <Loader2 className={`animate-spin text-blue-500 ${getSizeClasses()}`} />

        {/* Background glow effect */}
        <div className="absolute inset-0 blur-lg bg-blue-400/20 rounded-full" />
      </div>

      {/* Loading message */}
      {showMessage && (
        <p className="text-gray-600 animate-pulse text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

// Usage example showing different variations
const LoadingExample = () => {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <LoadingSpinner size="large" message="Please wait..." />
      </div>
    </div>
  );
};

export default LoadingExample;
