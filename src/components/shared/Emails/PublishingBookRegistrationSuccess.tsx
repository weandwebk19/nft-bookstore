import { Hr } from "@react-email/hr";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

import { BookBrief } from "@/types/nftBook";

import AuthorRegistrationLayout, {
  hr,
  paragraph,
  paragraphContent
} from "./AuthorRegistrationLayout";

export default function PublishingBookRegistrationSuccess(
  bookBrief: BookBrief
) {
  return (
    <AuthorRegistrationLayout preview=" Publishing Book Registration Successful">
      <Section style={paragraphContent}>
        <Hr style={hr} />
        <Text style={paragraph}>
          Hi <b>{bookBrief.author}</b>,
        </Text>
        <Text style={paragraph}>
          The book<b>{bookBrief.title}</b> is approved. You can start sale your
          own books on our platform. Thank you very much. The NFTBOOKS team.
        </Text>
        <Hr style={hr} />
      </Section>
    </AuthorRegistrationLayout>
  );
}
