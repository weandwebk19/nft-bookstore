import type { AuthorInfo } from "@_types/author";
import { Hr } from "@react-email/hr";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

import AuthorRegistrationLayout, {
  hr,
  paragraph,
  paragraphContent
} from "./AuthorRegistrationLayout";

export default function AuthorRegistrationSuccess(authorInfo: AuthorInfo) {
  return (
    <AuthorRegistrationLayout preview="Author Registration Successful">
      <Section style={paragraphContent}>
        <Hr style={hr} />
        <Text style={paragraph}>
          Hi <b>{authorInfo.pseudonym}</b>,
        </Text>
        <Text style={paragraph}>
          Congratulations on becoming the author of NFTBOOKS. You can start
          using author features to self-publish your own books on our platform.
          Thank you very much. The NFTBOOKS team.
        </Text>
        <Hr style={hr} />
      </Section>
    </AuthorRegistrationLayout>
  );
}
