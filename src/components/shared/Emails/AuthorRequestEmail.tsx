import { useEffect } from "react";

import type { AuthorInfo } from "@_types/author";
import { Container } from "@react-email/container";
import { Html } from "@react-email/html";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import styles from "@styles/BookItem.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function AuthorRequestEmail(
  authorInfo: AuthorInfo,
  hash: string
) {
  return (
    <Html>
      <Section>
        <Container>
          <Text>pseudonym: {authorInfo.pseudonym}</Text>
          <Text>about: {authorInfo.about}</Text>
          <Text>email: {authorInfo.email}</Text>
          <Text>website: {authorInfo.website}</Text>
          <Text>walletAddress: {authorInfo.walletAddress}</Text>
          {/* <Text>backDocument: {authorInfo.backDocument}</Text>
          <Text>frontDocument: {authorInfo.frontDocument}</Text> */}
          <Text>facebook: {authorInfo.facebook}</Text>
          <Text>instagram: {authorInfo.instagram}</Text>
          <Text>linkedIn: {authorInfo.linkedIn}</Text>
          <Text>twitter: {authorInfo.twitter}</Text>
          <Text>phoneNumber: {authorInfo.phoneNumber}</Text>
          <Text>Welcome to our app!</Text>
          <Link href={`${process.env.BASE_URL}api/author/accept?hash=${hash}`}>
            Accept
          </Link>
          <Link href={`${process.env.BASE_URL}api/author/refuse?hash=${hash}`}>
            Refuse
          </Link>
        </Container>
      </Section>
    </Html>
  );
}
