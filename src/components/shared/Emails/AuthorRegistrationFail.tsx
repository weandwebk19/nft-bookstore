import type { AuthorInfo } from "@_types/author";
import { Hr } from "@react-email/hr";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

import AuthorRegistrationLayout from "./AuthorRegistrationLayout";

const paragraphContent = {
  padding: "0 40px"
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#3c4043"
};

const hr = {
  borderColor: "#e8eaed",
  margin: "20px 0"
};

export default function AuthorRegistrationFail(authorInfo: AuthorInfo) {
  return (
    <AuthorRegistrationLayout preview="Author Registration Failed">
      <Section style={paragraphContent}>
        <Hr style={hr} />
        <Text style={paragraph}>
          Hi <b>{authorInfo.pseudonym}</b>,
        </Text>
        <Text style={paragraph}>Registration fail.</Text>
        <Hr style={hr} />
      </Section>
    </AuthorRegistrationLayout>
  );
}
