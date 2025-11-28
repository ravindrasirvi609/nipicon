// EmailTemplate.tsx

import React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface EmailTemplateProps {
  content: React.ReactNode;
  subject: string;
  qrCodeUrl?: string;
  buttonText: string;
  buttonUrl: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  content,
  subject,
  qrCodeUrl,
  buttonText,
  buttonUrl,
}) => (
  <Html>
    <Head />
    <Preview>{subject}</Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="bg-white mx-auto p-4 my-8 rounded-lg shadow-lg">
          <Img
            src="/logoP.jpeg"
            width="170"
            height="50"
            alt="Pharmanecia"
            className="mx-auto"
          />
          <Heading className="text-3xl font-bold text-center text-[#021373] my-4">
            {subject}
          </Heading>
          <Section className="px-4">{content}</Section>
          {qrCodeUrl && (
            <Section className="text-center my-8">
              <Text className="text-sm text-gray-600">
                Scan QR code for quick access:
              </Text>
              <Img
                src={qrCodeUrl}
                width="150"
                height="150"
                alt="QR Code"
                className="mx-auto my-4"
              />
            </Section>
          )}
          <Button
            className="bg-[#D94814] py-2 rounded text-white font-bold no-underline text-center block w-full"
            href={buttonUrl}
          >
            {buttonText}
          </Button>
          <Hr className="border-gray-300 my-4" />
          <Text className="text-center text-gray-500 text-xs">
            © 2025 Operant Pharmacy Federation. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default EmailTemplate;
