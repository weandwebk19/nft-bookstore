import { Box, Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import images from "@/assets/images";
import withAuth from "@/components/HOC/withAuth";
import { Book3D } from "@/components/shared/Book3D";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { Ticket } from "@/components/shared/Ticket";
import { Wrapper } from "@/components/shared/Wrapper";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const preUrl = "/account/bookshelf";

const BookShelf = () => {
  const { t } = useTranslation("bookshelf");

  const topCategories = [
    {
      id: `${preUrl}/created-books`,
      component: (
        <Ticket
          href={`${preUrl}/created-books`}
          header={t("createdBooks") as string}
          body={t("createdBooksDesc") as string}
          image="https://res.cloudinary.com/cldcloud/image/upload/v1680958966/nft_bookstore/img/gradient/vv13_tggmtv.jpg"
        />
      )
    },
    {
      id: `${preUrl}/owned-books`,
      component: (
        <Ticket
          href={`${preUrl}/owned-books`}
          header={t("ownedBooks") as string}
          body={t("ownedBooksDesc") as string}
          image="https://res.cloudinary.com/cldcloud/image/upload/v1680958966/nft_bookstore/img/gradient/vv50_fhjnov.jpg"
        />
      )
    },
    {
      id: `${preUrl}/borrowed-books`,
      component: (
        <Ticket
          href={`${preUrl}/borrowed-books`}
          header={t("borrowedBooks") as string}
          body={t("borrowedBooksDesc") as string}
          image="https://res.cloudinary.com/cldcloud/image/upload/v1680958967/nft_bookstore/img/gradient/vv20_g4evt5.jpg"
        />
      )
    },
    {
      id: `${preUrl}/shared-books`,
      component: (
        <Ticket
          href={`${preUrl}/shared-books`}
          header={t("sharedBooks") as string}
          body={t("sharedBooksDesc") as string}
          image="https://res.cloudinary.com/cldcloud/image/upload/v1680958966/nft_bookstore/img/gradient/vv41_dupr2k.jpg"
        />
      )
    }
  ];

  const bottomCategories = [
    {
      component: <></>
    },
    {
      id: `${preUrl}/sharing-books`,
      component: (
        <Ticket
          href={`${preUrl}/sharing-books`}
          header={t("sharingBooks") as string}
          body={t("sharingBooksDesc") as string}
          image="https://res.cloudinary.com/cldcloud/image/upload/v1680958967/nft_bookstore/img/gradient/vv39_fhjups.jpg"
        />
      )
    },
    {
      id: `${preUrl}/listing-books`,
      component: (
        <Ticket
          href={`${preUrl}/listing-books`}
          header={t("listingBooks") as string}
          body={t("listingBooksDesc") as string}
          image="https://res.cloudinary.com/cldcloud/image/upload/v1680958966/nft_bookstore/img/gradient/vv12_nho4ox.jpg"
        />
      )
    },
    {
      id: `${preUrl}/leasing-books`,
      component: (
        <Ticket
          href={`${preUrl}/leasing-books`}
          header={t("leasingBooks") as string}
          body={t("leasingBooksDesc") as string}
          image="https://res.cloudinary.com/cldcloud/image/upload/v1680958962/nft_bookstore/img/gradient/vv02_vxdv70.jpg"
        />
      )
    }
  ];

  return (
    <>
      <Head>
        <title>{t("titlePage") as string}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack spacing={6}>
        <ContentContainer titles={[`${t("containerTitle")}`]}>
          <Wrapper items={topCategories} itemsInARow={4} />

          <Wrapper items={bottomCategories} itemsInARow={4} />
        </ContentContainer>
      </Stack>
    </>
  );
};

export default withAuth(BookShelf);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "bookshelf"
      ]))
    }
  };
}
