import { useEffect, useState } from "react";

import type { AuthorInfo } from "@_types/author";
import { Container } from "@react-email/container";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import styles from "@styles/BookItem.module.scss";
import { CldImage } from "next-cloudinary";
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
          <Text>facebook: {authorInfo.facebook}</Text>
          <Text>instagram: {authorInfo.instagram}</Text>
          <Text>linkedIn: {authorInfo.linkedIn}</Text>
          <Text>twitter: {authorInfo.twitter}</Text>
          <Text>phoneNumber: {authorInfo.phoneNumber}</Text>
          <Text>Welcome to our app!</Text>
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
          <Link href={`${process.env.BASE_URL}api/authors/accept?hash=${hash}`}>
            Accept
          </Link>
          <Link href={`${process.env.BASE_URL}api/authors/refuse?hash=${hash}`}>
            Refuse
          </Link>
        </Container>
      </Section>
    </Html>
  );
}
