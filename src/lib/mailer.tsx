import { render } from "@react-email/render";
import { Text } from "@react-email/components";
import AbstractModel from "@/Model/AbstractModel";
import RegistrationModel from "@/Model/RegistrationModel";

type EmailType =
  | "SUBMITTED"
  | "UPDATE_STATUS"
  | "REGISTRATION_SUCCESS"
  | "UPDATE_PERSENTATION_STATUS"
  | "ABSTRACT_CODE_UPDATE";

interface SendEmailParams {
  _id: string;
  emailType: EmailType;
}

export const sendEmail = async ({
  _id,
  emailType,
}: SendEmailParams): Promise<any> => {
  try {
    if (
      ![
        "SUBMITTED",
        "UPDATE_STATUS",
        "REGISTRATION_SUCCESS",
        "UPDATE_PERSENTATION_STATUS",
        "ABSTRACT_CODE_UPDATE",
      ].includes(emailType)
    ) {
      throw new Error("Invalid emailType");
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("Missing Resend API key");
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const infoUrl = "http://pharmacy.nirmauni.ac.in/nipicon";

    let abstract;
    let registration;
    let submissionDetailsUrl: string;
    let EMAIL: string;
    let signature: React.ReactNode;

    if (emailType === "REGISTRATION_SUCCESS") {
      registration = await RegistrationModel.findOne({ _id });
      if (!registration) {
        throw new Error(`No registration found for id ${_id}`);
      }
      submissionDetailsUrl = `${baseUrl}/abstractForm/${registration._id}`;
      EMAIL = registration.email;
      signature = (
        <>
          <Text>
            Best Regards,<br />
            <strong>Registration Committee - NIPiCON 2026</strong><br />
            Email: <a href="mailto:regis.nipicon@nirmauni.ac.in">regis.nipicon@nirmauni.ac.in</a>
          </Text>
        </>
      );
    } else {
      abstract = await AbstractModel.findOne({ _id });
      if (!abstract) {
        throw new Error(`No abstract found for id ${_id}`);
      }
      submissionDetailsUrl = `${baseUrl}/abstractForm/${abstract._id}`;
      EMAIL = abstract.email;
      signature = (
        <>
          <Text>
            Best Regards,<br />
            <strong>Abstract Committee - NIPiCON 2026</strong><br />
            Email: <a href="mailto:abs.nipicon@nirmauni.ac.in">abs.nipicon@nirmauni.ac.in</a>
          </Text>
        </>
      );
    }

    let content: React.ReactNode;
    let subject: string = "";
    let buttonText: string = "";
    let buttonUrl: string = "";

    if (emailType === "SUBMITTED") {
      content = (
        <>
          <Text>Greeting from Institute of Pharmacy, Nirma University...!!!</Text>
          <Text>Thanks for Submitting Abstract for 8th NIPiCON 2026.</Text>
          <Text>
            Your abstract has been successfully submitted. Your temporary
            abstract code is: <strong>{abstract.temporyAbstractCode}</strong>
          </Text>
          <Text>
            Our team will verify your submission and provide confirmation
            shortly.
          </Text>
          <Text>
            If you need to make any changes or have any questions, please
            don&apos;t hesitate to contact us.
          </Text>
          <Text>
            You can view your submission details here:{" "}
            <a href={submissionDetailsUrl}>{submissionDetailsUrl}</a>
          </Text>
          <Text>
            Stay updated with more information - <a href={infoUrl}>{infoUrl}</a>
          </Text>
          <Text>
            You will receive an email notification whenever there is an update
            to your abstract status.
          </Text>
          {signature}
        </>
      );
      subject = `Abstract Submission Confirmation - ${abstract.temporyAbstractCode}`;
      buttonText = "View Submission Details";
      buttonUrl = submissionDetailsUrl;
    } else if (emailType === "UPDATE_STATUS") {
      let statusSpecificContent: React.ReactNode = null;
      let codeToShow = abstract.temporyAbstractCode;
      let statusForSubject =
        abstract.Status === "Revision" ? "Revision required" : abstract.Status;
      if (abstract.Status === "Accepted") {
        codeToShow = abstract.AbstractCode;
        statusSpecificContent = (
          <>
            <Text>Congratulations! Your abstract has been accepted.</Text>
            <Text>Complete your registration at the earliest.</Text>
            <Text>
              Your official abstract Presentation code is:{" "}
              <strong>{abstract.AbstractCode}</strong>
            </Text>
            <Text>
              Presentation Type :{" "}
              <strong>{abstract.presentationType} presentation</strong>
            </Text>
          </>
        );
      } else if (abstract.Status === "Revision" && abstract.rejectionComment) {
        statusSpecificContent = (
          <>
            <Text>
              We regret to inform you that your abstract does not fully comply
              with the NIPiCON 2026 International Research Conference
              guidelines. Kindly revise your abstract according to the provided
              guidelines and reviewer comments. Please resubmit the abstract by
              clicking View Submission Details.
            </Text>
            <Text>Submit your revised abstract in 2 days.</Text>
            {abstract.isDeclarationRevisionRequested && (
              <Text>
                Dr. Niyati has observed that Many Applicants of PIA had NOT
                uploaded Declaration Form as per Format & Guidelines - And,
                Hence, Please resubmit the Declaration Form As per Guideline &
                Format.
              </Text>
            )}
            {abstract.isProfileRevisionRequested && (
              <Text>
                Please resubmit your Brief Profile/CV in the prescribed format.
              </Text>
            )}
            {abstract.isAbstractRevisionRequested && (
              <Text>
                Please resubmit your abstract in WORD File format as per
                guidelines.
              </Text>
            )}
            <Text>
              <strong>
                Reviewer Committee Comments: {abstract.rejectionComment}
              </strong>
            </Text>
          </>
        );
      }

      content = (
        <>
          <Text>Greeting from Institute of Pharmacy, Nirma University...!!!</Text>
          <Text>
            There has been an update to your abstract submission (Code:{" "}
            <strong>{codeToShow}</strong>).
          </Text>
          <Text>
            Current Status:{" "}
            <strong>
              {abstract.Status === "Revision"
                ? "Revision required"
                : abstract.Status}
            </strong>
          </Text>
          {statusSpecificContent}
          <Text>
            If you have any questions about this update, please contact our
            support team.
          </Text>
          <Text>
            You can view your submission details here:{" "}
            <a href={submissionDetailsUrl}>{submissionDetailsUrl}</a>
          </Text>
          <Text>
            Stay updated with more information - <a href={infoUrl}>{infoUrl}</a>
          </Text>
          <Text>
            You will receive an email notification whenever there is an update
            to your abstract status.
          </Text>
          {signature}
        </>
      );
      subject = `Abstract ${statusForSubject} - ${codeToShow}`;
      buttonText = "View Submission Details";
      buttonUrl = submissionDetailsUrl;
    } else if (emailType === "REGISTRATION_SUCCESS") {
      content = (
        <>
          <Text>Greeting from Institute of Pharmacy, Nirma University...!!!</Text>
          <Text>Dear {registration.name},</Text>
          <Text>Thanks for Registration for 8th NIPiCON 2026.</Text>
          {registration.registrationStatus === "Confirmed" ||
            registration.paymentStatus === "Completed" ? (
            <Text>
              We are pleased to inform you that your registration for the
              conference has been successfully confirmed.
            </Text>
          ) : (
            <Text>
              Your registration has been received. Our team will verify the
              details and confirm your registration shortly.
            </Text>
          )}
          <Text>Your registration details:</Text>
          <ul>
            {registration.registrationCode && (
              <li>
                Registration Code:{" "}
                <strong>{registration.registrationCode}</strong>
              </li>
            )}
            <li>
              Registration Type:{" "}
              <strong>{registration.registrationType}</strong>
            </li>
            <li>
              Payment Status: <strong>{registration.paymentStatus}</strong>
            </li>
          </ul>
          <Text>
            If you have any questions or need further assistance, please
            don&apos;t hesitate to contact us.
          </Text>
          <Text>We look forward to seeing you at the conference!</Text>
          <Text>
            You can view your registration details here:{" "}
            <a href={submissionDetailsUrl}>{submissionDetailsUrl}</a>
          </Text>
          <Text>
            Stay updated with more information - <a href={infoUrl}>{infoUrl}</a>
          </Text>
          <Text>
            You will receive an email notification whenever there is an update
            to your registration status.
          </Text>
          {signature}
        </>
      );
      subject = `Registration Successful${registration.registrationCode ? ` - ${registration.registrationCode}` : ""}`;
      buttonText = "View Registration Details";
      buttonUrl = submissionDetailsUrl;
    } else if (emailType === "UPDATE_PERSENTATION_STATUS") {
      let statusSpecificContent: React.ReactNode = null;
      let codeToShow = abstract.AbstractCode || abstract.temporyAbstractCode;

      if (abstract.presentationFileStatus === "Approved") {
        statusSpecificContent = (
          <>
            <Text>
              Congratulations! Your presentation file has been approved.
            </Text>
            <Text>
              You are now ready to present at the conference. Please make sure
              to check the conference schedule for your presentation time slot.
            </Text>
          </>
        );
      } else if (
        abstract.presentationFileStatus === "Revision" &&
        abstract.presentationRejectionComment
      ) {
        statusSpecificContent = (
          <>
            <Text>
              We regret to inform you that your presentation file needs
              revision. Please review the following comments and submit an
              updated version.
            </Text>
            <Text>
              <strong>
                Reviewer Comments: {abstract.presentationRejectionComment}
              </strong>
            </Text>
          </>
        );
      } else if (abstract.presentationFileStatus === "InReview") {
        statusSpecificContent = (
          <Text>
            Your presentation file is currently under review. We will notify you
            once the review is complete.
          </Text>
        );
      }

      content = (
        <>
          <Text>Greeting from Institute of Pharmacy, Nirma University...!!!</Text>
          <Text>
            There has been an update to your presentation submission (Abstract
            Code: <strong>{codeToShow}</strong>).
          </Text>
          <Text>
            Current Status: <strong>{abstract.presentationFileStatus}</strong>
          </Text>
          {statusSpecificContent}
          <Text>
            If you have any questions about this update, please contact our
            support team.
          </Text>
          <Text>
            You can view your submission details here:{" "}
            <a href={submissionDetailsUrl}>{submissionDetailsUrl}</a>
          </Text>
          <Text>
            Stay updated with more information - <a href={infoUrl}>{infoUrl}</a>
          </Text>
          <Text>
            You will receive an email notification whenever there is an update
            to your abstract status.
          </Text>
          {signature}
        </>
      );
      subject = `Presentation Status Update - ${codeToShow}`;
      buttonText = "View Submission Details";
      buttonUrl = submissionDetailsUrl;
    } else if (emailType === "ABSTRACT_CODE_UPDATE") {
      content = (
        <>
          <Text>Greeting from Institute of Pharmacy, Nirma University...!!!</Text>
          <Text>
            <strong>Important Update Regarding Your Abstract Code</strong>
          </Text>
          <Text>
            Your main Final Abstract Code has been updated. Please note your
            NEW official Abstract Code:
          </Text>
          <Text>
            New Abstract Code: <strong>{abstract.AbstractCode}</strong>
          </Text>
          <Text>
            Please use this new code for all future correspondence and
            reference. The previous code is no longer valid for official
            purposes.
          </Text>
          <Text>
            Presentation Type: <strong>{abstract.presentationType}</strong>
          </Text>
          <Text>
            You can view your submission details here:{" "}
            <a href={submissionDetailsUrl}>{submissionDetailsUrl}</a>
          </Text>
          <Text>
            Stay updated with more information - <a href={infoUrl}>{infoUrl}</a>
          </Text>
          {signature}
        </>
      );
      subject = `Important: New Abstract Code Updated - ${abstract.AbstractCode}`;
      buttonText = "View Submission Details";
      buttonUrl = submissionDetailsUrl;
    }

    // Validate required fields before sending
    if (!EMAIL || !subject || !content) {
      throw new Error(
        `Missing required email fields - to: ${EMAIL}, subject: ${subject}, content: ${!!content}`
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(EMAIL)) {
      throw new Error(`Invalid email format: ${EMAIL}`);
    }

    const emailHtml = await render(content as React.ReactElement);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "NIPiCON <no-reply@opf.org.in>",
        to: [EMAIL],
        subject: subject,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Resend API error:", response.status, errorBody);
      throw new Error(`Error sending email: ${response.status} - ${errorBody}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
