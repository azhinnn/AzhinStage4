import {
  Body,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
  Font,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

export const ResetPasswordTemplate = ({
  name,
  token,
  companyName,
  companyImage,
}: {
  name: string;
  token: string;
  companyName: string;
  companyImage: string;
}) => {
  const LOCALHOST = process.env.LOCALHOST;

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrJJfedw.ttf",
            format: "truetype",
          }}
          fontWeight={500}
          fontStyle="normal"
        />
      </Head>
      <Tailwind>
        <Body>
          <Section className="min-h-screen bg-green-500 flex items-center justify-center px-4">
            <Section className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
              <Img
                src={companyImage || ""}
                alt="Company Logo"
                className="w-24 h-24 mx-auto object-cover rounded-md"
              />
              <Heading className="text-2xl font-bold text-center mb-4">
                Password Reset
              </Heading>
              <Text className="text-2xl text-center font-extrabold">
                Hi {name}!
              </Text>
              <Text className="text-gray-600 text-center mb-10 text-lg">
                Please click the button below to reset your password.
              </Text>
              <Section className="flex justify-center">
                <Link
                  className="w-full bg-green-500 text-white rounded-lg py-3 px-6 text-center"
                  href={`${LOCALHOST}/reset-password?token=${token}`}>
                  Reset Password
                </Link>
              </Section>
              <Text className="text-gray-500 text-sm text-center mt-6">
                If you didn&apos;t request this email, you can safely ignore it.
              </Text>
              <Section className="mt-6 text-center">
                <span className="text-sm text-gray-600">{companyName}</span>
              </Section>
            </Section>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPasswordTemplate;
