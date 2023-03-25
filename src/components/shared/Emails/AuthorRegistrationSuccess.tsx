import { useEffect } from "react";

import type { AuthorInfo } from "@_types/author";
import { Container } from "@react-email/container";
import { Html } from "@react-email/html";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import styles from "@styles/BookItem.module.scss";
import Image from "next/image";

export default function AuthorRegistrationSuccess(authorInfo: AuthorInfo) {
  return (
    <Html>
      <Section>
        <Container>
          <Text>Hi: {authorInfo.pseudonym}!</Text>
          <Text>
            Congratulations on becoming the author of NFTBOOKS. You can start
            using author features to self-publish your own books on our
            platform. Thank you very much. The NFTBOOKS team
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
