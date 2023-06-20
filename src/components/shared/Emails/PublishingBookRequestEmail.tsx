import { Button } from "@react-email/button";
import { Column } from "@react-email/column";
import { Hr } from "@react-email/hr";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

import { BookBrief } from "@/types/nftBook";

import AuthorRegistrationLayout, {
  button,
  heading,
  hr,
  paragraph,
  paragraphContent
} from "./AuthorRegistrationLayout";

export default function PublishingBookRequestEmail(
  bookBrief: BookBrief,
  hash: string
) {
  return (
    <AuthorRegistrationLayout preview="Require review publishing book">
      <Section style={paragraphContent}>
        <Hr style={hr} />
        <Text style={paragraph}>Hi,</Text>
        <Text style={paragraph}>
          This email is to let you know that there is a request to review a new
          book just publishing.
        </Text>
        <Hr style={hr} />
      </Section>
      <Section style={paragraphContent}>
        <Text style={{ ...heading, marginLeft: 0 }}>
          Review request on book creating:
        </Text>
        <Text style={paragraph}>
          <b>Title: </b>
          {bookBrief.title}
        </Text>
        <Text style={paragraph}>
          <b>Book File: </b>
          Attached below
        </Text>
        <Text style={paragraph}>
          <b>Book Sample: </b>
          {bookBrief.bookSample}
        </Text>
        <Text style={paragraph}>
          <b>Book Cover: </b>
          {bookBrief.bookCover}
        </Text>
        <Text style={paragraph}>
          <b>Metadata: </b>
          {bookBrief.nftUri}
        </Text>
        <Text style={paragraph}>
          <b>Author: </b>
          {bookBrief.author}
        </Text>
        <Text style={paragraph}>
          <b>Timestamp: </b>
          {bookBrief.timestamp?.toLocaleString()}
        </Text>
        <Hr style={hr} />
      </Section>
      <Section style={paragraphContent}>
        <Text style={paragraph}>You can accept or refuse this request.</Text>
        <Row>
          <Column align="right">
            <Button
              pX={20}
              pY={12}
              style={button}
              href={`${process.env.BASE_URL}api/books/request/accept?hash=${hash}`}
            >
              Accept
            </Button>
          </Column>
          <Column align="center" style={{ width: "16px" }}></Column>
          <Column align="left">
            <Button
              pX={20}
              pY={12}
              style={{ ...button, backgroundColor: "#e00707" }}
              href={`${process.env.BASE_URL}api/books/request/refuse?hash=${hash}`}
            >
              Refuse
            </Button>{" "}
          </Column>
        </Row>
        <Hr style={hr} />
      </Section>
    </AuthorRegistrationLayout>
  );
}
