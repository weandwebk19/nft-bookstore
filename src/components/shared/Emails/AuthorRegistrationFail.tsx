import type { AuthorInfo } from "@_types/author";
import { Hr } from "@react-email/hr";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

import AuthorRegistrationLayout, {
  hr,
  paragraph,
  paragraphContent
} from "./AuthorRegistrationLayout";

export default function AuthorRegistrationFail(authorInfo: AuthorInfo) {
  return (
    <AuthorRegistrationLayout preview="Author Registration Failed">
      <Section style={paragraphContent}>
        <Hr style={hr} />
        <Text style={paragraph}>
          Hi <b>{authorInfo.pseudonym}</b>,
        </Text>
        <Text style={paragraph}>
          Your NFTBooks author registration has failed. Please try again.
        </Text>
        <Hr style={hr} />
      </Section>
    </AuthorRegistrationLayout>
  );
}
