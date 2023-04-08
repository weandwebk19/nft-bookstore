import type { AuthorInfo } from "@_types/author";
import { Body } from "@react-email/body";
import { Column } from "@react-email/column";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

const main = {
  backgroundColor: "#eae1d9",
  padding: "12px 0",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  backgroundSize: "3vh 3vh",
  backgroundImage:
    "linear-gradient(to right,rgba(122, 122, 122, 0.08) 1px,transparent 1px),linear-gradient(to bottom, rgba(122, 122, 122, 0.08) 1px, transparent 1px)",
  transition: "0.3s cubic-bezier(0.4, 0.4, 0, 1)"
};

const sectionLogo = {
  display: "flex",
  alignItems: "center !important",
  gap: "12px !important",
  margin: "20px 40px 0px 40px"
};

const container = {
  margin: "30px auto",
  width: "610px",
  backgroundColor: "#fff",
  borderRadius: 5,
  overflow: "hidden",
  maxWidth: "42.5em"
};

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

interface AuthorRegistrationLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export default function AuthorRegistrationLayout({
  preview,
  children
}: AuthorRegistrationLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Column style={sectionLogo} align="center">
              <Img
                src={`https://res.cloudinary.com/dzqutvpbv/image/upload/v1680931331/logo_fthxbv.png`}
                height="32"
                alt="NFT Bookstore"
              />
              <Text style={heading}>NFT Bookstore</Text>
            </Column>
          </Section>
          {children}
          <Section style={{ ...paragraphContent, paddingBottom: 30 }}>
            <Text style={{ ...paragraph, marginTop: 0 }}>Thank you,</Text>
            <Text style={{ ...paragraph, fontSize: "16px" }}>
              The NFT Bookstore team
            </Text>
            <Text
              style={{
                ...paragraph,
                fontSize: "12px",
                textAlign: "center",
                margin: 0,
                color: "#87888e"
              }}
            >
              227 Nguyen Van Cu, District 5, Ho Chi Minh City, Vietnam
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
