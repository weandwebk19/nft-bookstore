import type { AuthorInfo } from "@_types/author";
import { Button } from "@react-email/button";
import { Column } from "@react-email/column";
import { Hr } from "@react-email/hr";
import { Row } from "@react-email/row";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import { CldImage } from "next-cloudinary";

import AuthorRegistrationLayout from "./AuthorRegistrationLayout";

const heading = {
  fontSize: "18px",
  lineHeight: "32px",
  color: "#3c4043",
  margin: "0px",
  fontWeight: "600",
  marginLeft: "12px"
};

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

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  cursor: "pointer"
};

export default function AuthorRequestEmail(
  authorInfo: AuthorInfo,
  hash: string
) {
  return (
    <AuthorRegistrationLayout preview="Require Become Author">
      <Section style={paragraphContent}>
        <Hr style={hr} />
        <Text style={paragraph}>Hi,</Text>
        <Text style={paragraph}>
          This email is to let you know that there is a request to become an
          author.
        </Text>
        <Hr style={hr} />
      </Section>
      <Section style={paragraphContent}>
        <Text style={{ ...heading, marginLeft: 0 }}>
          Application on author registration:
        </Text>
        <Text style={paragraph}>
          <b>Pseudonym: </b>
          {authorInfo.pseudonym}
        </Text>
        <Text style={paragraph}>
          <b>About: </b>
          {authorInfo.about}
        </Text>
        <Text style={paragraph}>
          <b>Email: </b>
          {authorInfo.email}
        </Text>
        <Text style={paragraph}>
          <b>Website: </b>
          {authorInfo.website}
        </Text>
        <Text style={paragraph}>
          <b>WalletAddress: </b>
          {authorInfo.walletAddress}
        </Text>
        <Text style={paragraph}>
          <b>Facebook: </b>
          {authorInfo.facebook}
        </Text>
        <Text style={paragraph}>
          <b>Instagram: </b>
          {authorInfo.instagram}
        </Text>
        <Text style={paragraph}>
          <b>LinkedIn: </b>
          {authorInfo.linkedIn}
        </Text>
        <Text style={paragraph}>
          <b>Twitter: </b>
          {authorInfo.twitter}
        </Text>
        <Text style={paragraph}>
          <b>PhoneNumber: </b>
          {authorInfo.phoneNumber}
        </Text>
        <CldImage
          src={authorInfo.picture.secure_url}
          alt="gradient"
          fill
          style={{
            width: "100%",
            left: "50%",
            top: "50%",
            objectFit: "cover"
          }}
          className="portrait"
        />
        <CldImage
          src={authorInfo.frontDocument.secure_url}
          alt="gradient"
          fill
          style={{
            width: "100%",
            left: "50%",
            top: "50%",
            objectFit: "cover"
          }}
          className="portrait"
        />
        <CldImage
          src={authorInfo.backDocument.secure_url}
          alt="gradient"
          fill
          style={{
            width: "100%",
            left: "50%",
            top: "50%",
            objectFit: "cover"
          }}
          className="portrait"
        />
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
              href={`${process.env.BASE_URL}api/authors/accept?hash=${hash}`}
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
              href={`${process.env.BASE_URL}api/authors/refuse?hash=${hash}`}
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
