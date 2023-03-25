import { useEffect } from "react";

import type { AuthorInfo } from "@_types/author";
import { Container } from "@react-email/container";
import { Html } from "@react-email/html";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import styles from "@styles/BookItem.module.scss";
import Image from "next/image";

export default function AuthorRegistrationInitiated(authorInfo: AuthorInfo) {
  return (
    <Html>
      <Section>
        <Container>
          <Text>Hi: {authorInfo.pseudonym}!</Text>
          <Text>
            Thank you for completing the NFTBOOKS author registration. You're on
            your way to joining millions of book-loving - authors, book lovers,
            readers and translators in the NFTBOOKS community. Your application
            will be reviewed for 1-3 business days before you can start
            self-publishing your book on our platform. Thank you very much. The
            NFTBOOKS team
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
