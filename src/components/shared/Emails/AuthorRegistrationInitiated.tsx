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

export default function AuthorRegistrationInitiated(authorInfo: AuthorInfo) {
  return (
    <AuthorRegistrationLayout preview="Author Registration Initiated">
      <Section style={paragraphContent}>
        <Hr style={hr} />
        <Text style={paragraph}>
          Hi <b>{authorInfo.pseudonym}</b>,
        </Text>
        <Text style={paragraph}>
          Thank you for completing the NFTBOOKS author registration. You're on
          your way to joining millions of book-loving - authors, book lovers,
          readers and translators in the NFTBOOKS community. Your application
          will be reviewed for 1-3 business days before you can start
          self-publishing your book on our platform.
        </Text>
        <Hr style={hr} />
      </Section>
    </AuthorRegistrationLayout>
  );
}
