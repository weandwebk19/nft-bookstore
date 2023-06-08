import { Hr } from "@react-email/hr";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

import { BookBrief } from "@/types/nftBook";

import AuthorRegistrationLayout, {
  hr,
  paragraph,
  paragraphContent
} from "./AuthorRegistrationLayout";

export default function PublishingBookRegistrationFail(bookBrief: BookBrief) {
  return (
    <AuthorRegistrationLayout preview="Author Registration Failed">
      <Section style={paragraphContent}>
        <Hr style={hr} />
        <Text style={paragraph}>
          Hi <b>{bookBrief.author}</b>,
        </Text>
        <Text style={paragraph}>
          Your NFT Book <b>{bookBrief.title}</b> is not approved. Please try
          another version.
        </Text>
        <Hr style={hr} />
      </Section>
    </AuthorRegistrationLayout>
  );
}
