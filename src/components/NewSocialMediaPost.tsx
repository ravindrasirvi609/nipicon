import React from "react";

// Theme presets for different post styles
const themes = {
  default: {
    gradientStart: "#F5F5F5",
    gradientEnd: "#FFFFFF",
    titleColor: "#1e40af",
    accentColor: "#3730a3",
    textColor: "#1e40af",
  },
  pharmaBlue: {
    gradientStart: "#E0F7FA",
    gradientEnd: "#B2EBF2",
    titleColor: "#0c4a6e",
    accentColor: "#0369a1",
    textColor: "#0c4a6e",
  },
  medicalGreen: {
    gradientStart: "#E8F5E8",
    gradientEnd: "#C8E6C9",
    titleColor: "#166534",
    accentColor: "#15803d",
    textColor: "#166534",
  },
  innovationOrange: {
    gradientStart: "#FFF3E0",
    gradientEnd: "#FFE0B2",
    titleColor: "#ea580c",
    accentColor: "#c2410c",
    textColor: "#ea580c",
  },
  royal: {
    gradientStart: "#F3E5F5",
    gradientEnd: "#E1BEE7",
    titleColor: "#7c3aed",
    accentColor: "#6d28d9",
    textColor: "#7c3aed",
  },
};

// Layout configurations
const layouts = {
  classic: "classic",
  modern: "modern",
  minimal: "minimal",
  featured: "featured",
  compact: "compact",
} as const;

// Badge types
const badgeTypes = {
  speaker: "Keynote Speaker",
  panelist: "Panelist",
  moderator: "Moderator",
  organizer: "Organizer",
  sponsor: "Sponsor",
  attendee: "Attendee",
  student: "Student",
  researcher: "Researcher",
} as const;

// Background patterns
const backgroundPatterns = {
  none: "",
  dots: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
  lines:
    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)",
  hexagon:
    'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><polygon points="50,5 85,25 85,75 50,95 15,75 15,25" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></svg>\')',
  molecules:
    'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.1)"/><circle cx="60" cy="60" r="3" fill="rgba(255,255,255,0.1)"/><line x1="20" y1="20" x2="60" y2="60" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></svg>\')',
};

interface SocialMediaPostProps {
  name: string;
  affiliation: string;
  designation?: string;
  imageUrl: string;
  theme?: keyof typeof themes;
  layout?: keyof typeof layouts;
  badge?: keyof typeof badgeTypes;
  backgroundPattern?: keyof typeof backgroundPatterns;
  customMessage?: string;
  showQRCode?: boolean;
  qrCodeUrl?: string;
  aspectRatio?: "square" | "story" | "banner";
  showAnimations?: boolean;
  customColors?: {
    gradientStart?: string;
    gradientEnd?: string;
    titleColor?: string;
    accentColor?: string;
    textColor?: string;
  };
}

const SocialMediaPost = ({
  name = "Dr. John Doe",
  affiliation = "XYZ University",
  designation = "Professor",
  imageUrl = "https://via.placeholder.com/300",
  theme = "default",
  layout = "classic",
  badge,
  backgroundPattern = "none",
  customMessage,
  showQRCode = false,
  qrCodeUrl,
  aspectRatio = "square",
  showAnimations = false,
  customColors,
}: SocialMediaPostProps) => {
  const selectedTheme = customColors
    ? { ...themes[theme], ...customColors }
    : themes[theme];

  // Aspect ratio dimensions
  const dimensions = {
    square: { width: "1080px", height: "1080px" },
    story: { width: "1080px", height: "1920px" },
    banner: { width: "1920px", height: "1080px" },
  };

  // Animation styles
  const animationStyle = showAnimations
    ? {
        animation: "float 3s ease-in-out infinite",
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      }
    : {};

  // Layout-specific styles
  const getLayoutStyles = () => {
    switch (layout) {
      case "modern":
        return {
          padding: "60px",
          justifyContent: "center",
          gap: "30px",
        };
      case "minimal":
        return {
          padding: "80px",
          justifyContent: "space-around",
          gap: "40px",
        };
      case "featured":
        return {
          padding: "40px",
          justifyContent: "flex-start",
          gap: "20px",
        };
      case "compact":
        return {
          padding: "30px",
          justifyContent: "space-between",
          gap: "15px",
        };
      default:
        return {
          padding: "40px",
          justifyContent: "space-between",
          gap: "20px",
        };
    }
  };

  const layoutStyles = getLayoutStyles();

  // Combine gradient and pattern for background
  const backgroundStyle = {
    background: `
      ${
        backgroundPattern !== "none"
          ? backgroundPatterns[backgroundPattern] + ","
          : ""
      }
      url('/IPC Post.png')
    `,
    backgroundSize:
      backgroundPattern !== "none" ? "100px 100px, cover" : "cover",
    backgroundPosition: "center, center",
    backgroundBlendMode: "normal, normal",
  };

  return (
    <div
      style={{
        width: dimensions[aspectRatio].width,
        height: dimensions[aspectRatio].height,
        ...backgroundStyle,
        fontFamily: "Arial, sans-serif",
        color: selectedTheme.textColor,
        textAlign: "center",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        ...layoutStyles,
        ...animationStyle,
      }}
    >
      {/* Header Content */}
      <div style={{ zIndex: 5, position: "relative" }}>
        <h1
          style={{
            fontSize:
              layout === "compact"
                ? "48px"
                : layout === "minimal"
                ? "72px"
                : "60px",
            margin: "0 0 28px",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            lineHeight: "1.2",
            visibility: "hidden",
          }}
        >
          <span style={{ color: "#ea580c" }}>74th</span>{" "}
          <span style={{ color: "#ea580c" }}>Indian</span>{" "}
          <span style={{ color: "#ea580c" }}>Pharmaceutical</span>{" "}
          <span style={{ color: "#ea580c" }}>Congress</span>{" "}
          <span style={{ color: "#ea580c" }}>2025</span>
        </h1>

        <p
          style={{
            fontSize: layout === "compact" ? "28px" : "32px",
            margin: "0 0 8px",
            fontWeight: "800",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            color: "#15803d",
          }}
        >
          AI &amp; TECHNOLOGY IN PHARMA: EDUCATE, INNOVATE, EMPOWER
        </p>

        <h2
          style={{
            fontSize: layout === "compact" ? "24px" : "28px",
            margin: "0 0 10px",
            padding: "0 100px",
            lineHeight: "1.4",
            fontWeight: "bold",
            color: "#1e3a8a",
          }}
        >
          Venue: BIEC Bengaluru
        </h2>

        <p
          style={{
            fontSize: layout === "compact" ? "20px" : "24px",
            margin: "0 0 14px",
            fontWeight: "600",
            color: "#1e3a8a",
          }}
        >
          Dec 19-21, 2025
          <br />
          Friday-Sunday
        </p>
      </div>

      {/* Middle Section with Image on Left and Details on Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: layout === "compact" ? "30px" : "50px",
          margin: "20px 0",
          zIndex: 5,
          position: "relative",
          flex: 1,
        }}
      >
        {/* Profile Image on Left - Fixed to prevent stretching */}
        <div
          style={{
            width:
              layout === "compact"
                ? "250px"
                : layout === "featured"
                ? "350px"
                : "300px",
            height:
              layout === "compact"
                ? "250px"
                : layout === "featured"
                ? "350px"
                : "300px",
            position: "relative",
            border: `4px solid ${selectedTheme.titleColor}`,
            padding: "4px",
            backgroundColor: selectedTheme.titleColor,
            boxShadow: `0 8px 16px rgba(0,0,0,0.3), 0 0 0 8px ${selectedTheme.accentColor}40`,
            flexShrink: 0,
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
              borderRadius: "4px",
              backgroundColor: "#f3f4f6",
            }}
          >
            <img
              src={imageUrl}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // Changed from 'contain' to 'cover'
                objectPosition: "center", // Centers the image
                display: "block",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>

        {/* Name and Details on Right */}
        <div
          style={{
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h3
            style={{
              color: "#b91c1c",
              fontSize:
                layout === "compact"
                  ? "36px"
                  : layout === "featured"
                  ? "56px"
                  : "48px",
              margin: "0 0 10px",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {name}
          </h3>

          {designation && (
            <p
              style={{
                color: "#b91c1c",
                fontSize: layout === "compact" ? "20px" : "24px",
                margin: "0 0 10px",
                fontWeight: "bold",
              }}
            >
              {designation}
            </p>
          )}

          <p
            style={{
              color: "#b91c1c",
              fontSize: layout === "compact" ? "18px" : "20px",
              margin: "0",
              maxWidth: "400px",
            }}
          >
            {affiliation}
          </p>
        </div>
      </div>

      {/* Bottom Content */}
      <div style={{ zIndex: 5, position: "relative", marginTop: "auto" }}>
        <p
          style={{
            color: "#15803d",
            fontSize: layout === "compact" ? "32px" : "40px",
            fontWeight: "900",
            margin: "0 0 12px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          {customMessage || "Hey! I'm Attending 74th IPC 2025"}
        </p>

        {/* Footer Information */}
        <div
          style={{
            fontSize: layout === "compact" ? "14px" : "16px",
            marginTop: "12px",
            color: "#4b5563",
          }}
        >
          <p style={{ margin: "3px 0", opacity: 0.9 }}>
            Organized by: Indian Pharmaceutical Congress Association
          </p>
          <p style={{ margin: "3px 0", opacity: 0.9 }}>
            Hosted by: Association of Pharmaceutical Teachers of India
          </p>
        </div>

        {/* Hashtags */}
        <p
          style={{
            fontSize: layout === "compact" ? "14px" : "16px",
            marginTop: "8px",
            color: "#15803d",
            fontWeight: "600",
          }}
        >
          #IPC2025 #PharmaTech #AIinPharma #PharmaceuticalCongress
          #PharmaInnovation
        </p>
      </div>

      {/* Powered By Text */}
      <div
        style={{
          position: "absolute",
          bottom: "150px",
          right: "22px",
          color: selectedTheme.titleColor,
          fontSize: "14px",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          zIndex: 10,
          textAlign: "center",
          width: "120px",
        }}
      >
        Powered By
      </div>

      {/* OPF Logo */}
      <img
        src="/opflogo.png"
        alt="OPF Logo"
        style={{
          position: "absolute",
          backgroundColor: "white",
          borderRadius: "10px",
          bottom: "20px",
          right: "20px",
          width: "120px",
          height: "120px",
          objectFit: "contain",
          zIndex: 10,
          opacity: 0.9,
        }}
      />
    </div>
  );
};

export default SocialMediaPost;
