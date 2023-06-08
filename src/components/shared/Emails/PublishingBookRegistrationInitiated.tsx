import { Hr } from "@react-email/hr";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

import { BookBrief } from "@/types/nftBook";

import AuthorRegistrationLayout, {
  hr,
  paragraph,
  paragraphContent
} from "./AuthorRegistrationLayout";

export default function PublishingBookRegistrationInitiated(
  bookBrief: BookBrief
) {
  return (
    <AuthorRegistrationLayout preview="Publish Book Registration Initiated">
      <Section style={paragraphContent}>
        <Hr style={hr} />
        <Text style={paragraph}>
          Hi <b>{bookBrief.author}</b>,
        </Text>
        <Text style={paragraph}>
          Thank you for publishing books on our app. You are on your way to
          reviewing by our admin. Your book will be reviewed for 1-3 business
          days before you can start sale your book on our platform.
        </Text>
        <Hr style={hr} />
      </Section>
    </AuthorRegistrationLayout>
  );
}
