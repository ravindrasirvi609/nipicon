import React from "react";
import SocialMediaPost from "./SocialMediaPost";

const PostExamples = () => {
  const sampleData = {
    name: "Dr. Sarah Johnson",
    affiliation: "Harvard Medical School, Boston, USA",
    designation: "Professor of Pharmaceutical Sciences",
    imageUrl: "/profile/Basavanna.jpeg", // Using an existing image from public folder
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        74th IPC 2025 - Dynamic Social Media Post Examples
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "30px",
        }}
      >
        {/* Default Theme */}
        <div style={{ textAlign: "center" }}>
          <h3>Default Theme - Classic Layout</h3>
          <div
            style={{ transform: "scale(0.35)", transformOrigin: "top center" }}
          >
            <SocialMediaPost {...sampleData} theme="default" layout="classic" />
          </div>
        </div>

        {/* Pharma Blue Theme with Speaker Badge */}
        <div style={{ textAlign: "center" }}>
          <h3>Pharma Blue - Keynote Speaker</h3>
          <div
            style={{ transform: "scale(0.35)", transformOrigin: "top center" }}
          >
            <SocialMediaPost
              {...sampleData}
              theme="pharmaBlue"
              layout="modern"
              badge="speaker"
              backgroundPattern="molecules"
            />
          </div>
        </div>

        {/* Medical Green Theme with Researcher Badge */}
        <div style={{ textAlign: "center" }}>
          <h3>Medical Green - Researcher</h3>
          <div
            style={{ transform: "scale(0.35)", transformOrigin: "top center" }}
          >
            <SocialMediaPost
              {...sampleData}
              theme="medicalGreen"
              layout="featured"
              badge="researcher"
              backgroundPattern="hexagon"
              customMessage="Excited to share my research at IPC 2025!"
            />
          </div>
        </div>

        {/* Innovation Orange Theme */}
        <div style={{ textAlign: "center" }}>
          <h3>Innovation Orange - Compact Layout</h3>
          <div
            style={{ transform: "scale(0.35)", transformOrigin: "top center" }}
          >
            <SocialMediaPost
              {...sampleData}
              theme="innovationOrange"
              layout="compact"
              badge="panelist"
              backgroundPattern="lines"
            />
          </div>
        </div>

        {/* Royal Theme with Custom Colors */}
        <div style={{ textAlign: "center" }}>
          <h3>Royal Theme - Custom Message</h3>
          <div
            style={{ transform: "scale(0.35)", transformOrigin: "top center" }}
          >
            <SocialMediaPost
              {...sampleData}
              theme="royal"
              layout="minimal"
              badge="organizer"
              backgroundPattern="dots"
              customMessage="Looking forward to revolutionary discussions!"
              showQRCode={true}
              qrCodeUrl="https://ipc2025.com"
            />
          </div>
        </div>

        {/* Custom Colors Example */}
        <div style={{ textAlign: "center" }}>
          <h3>Custom Colors - Student</h3>
          <div
            style={{ transform: "scale(0.35)", transformOrigin: "top center" }}
          >
            <SocialMediaPost
              {...sampleData}
              name="Alex Chen"
              affiliation="Delhi University, India"
              designation="PhD Student"
              theme="default"
              layout="modern"
              badge="student"
              customColors={{
                gradientStart: "#1A237E",
                gradientEnd: "#3F51B5",
                titleColor: "#FFC107",
                accentColor: "#FF5722",
              }}
              customMessage="Ready to learn from the best minds in pharma!"
            />
          </div>
        </div>
      </div>

      {/* Story Format Example */}
      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <h2>Instagram Story Format</h2>
        <div
          style={{
            transform: "scale(0.25)",
            transformOrigin: "top center",
            display: "inline-block",
          }}
        >
          <SocialMediaPost
            {...sampleData}
            theme="pharmaBlue"
            layout="featured"
            aspectRatio="story"
            badge="speaker"
            backgroundPattern="molecules"
            customMessage="See you at IPC 2025! 🚀"
          />
        </div>
      </div>

      {/* Banner Format Example */}
      <div style={{ marginTop: "50px", textAlign: "center" }}>
        <h2>LinkedIn Banner Format</h2>
        <div
          style={{
            transform: "scale(0.2)",
            transformOrigin: "top center",
            display: "inline-block",
          }}
        >
          <SocialMediaPost
            {...sampleData}
            theme="innovationOrange"
            layout="compact"
            aspectRatio="banner"
            badge="moderator"
            backgroundPattern="hexagon"
          />
        </div>
      </div>

      {/* Usage Guide */}
      <div
        style={{
          marginTop: "50px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <h2>Available Customization Options</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          <div>
            <h3>🎨 Themes</h3>
            <ul>
              <li>
                <strong>default</strong> - Purple gradient with gold accents
              </li>
              <li>
                <strong>pharmaBlue</strong> - Professional blue with cyan
                highlights
              </li>
              <li>
                <strong>medicalGreen</strong> - Medical green with bright
                accents
              </li>
              <li>
                <strong>innovationOrange</strong> - Bold orange innovation theme
              </li>
              <li>
                <strong>royal</strong> - Elegant royal purple with gold
              </li>
            </ul>
          </div>

          <div>
            <h3>📐 Layouts</h3>
            <ul>
              <li>
                <strong>classic</strong> - Traditional balanced layout
              </li>
              <li>
                <strong>modern</strong> - Contemporary centered design
              </li>
              <li>
                <strong>minimal</strong> - Clean spacious layout
              </li>
              <li>
                <strong>featured</strong> - Emphasis on profile image
              </li>
              <li>
                <strong>compact</strong> - Space-efficient design
              </li>
            </ul>
          </div>

          <div>
            <h3>🏷️ Badges</h3>
            <ul>
              <li>speaker, panelist, moderator</li>
              <li>organizer, sponsor, attendee</li>
              <li>student, researcher</li>
            </ul>
          </div>

          <div>
            <h3>🎭 Background Patterns</h3>
            <ul>
              <li>
                <strong>none</strong> - Clean gradient background
              </li>
              <li>
                <strong>dots</strong> - Subtle dot pattern
              </li>
              <li>
                <strong>lines</strong> - Diagonal line pattern
              </li>
              <li>
                <strong>hexagon</strong> - Scientific hexagon pattern
              </li>
              <li>
                <strong>molecules</strong> - Molecular structure pattern
              </li>
            </ul>
          </div>

          <div>
            <h3>📱 Aspect Ratios</h3>
            <ul>
              <li>
                <strong>square</strong> - 1080x1080 (Instagram post)
              </li>
              <li>
                <strong>story</strong> - 1080x1920 (Instagram/Facebook story)
              </li>
              <li>
                <strong>banner</strong> - 1920x1080 (LinkedIn banner)
              </li>
            </ul>
          </div>

          <div>
            <h3>✨ Extra Features</h3>
            <ul>
              <li>Custom messages</li>
              <li>QR code integration</li>
              <li>Custom color overrides</li>
              <li>Gradient animations</li>
              <li>Enhanced shadows and effects</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostExamples;
