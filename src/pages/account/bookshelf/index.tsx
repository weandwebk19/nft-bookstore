import { Box, Paper, Stack, Typography } from "@mui/material";

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
          image={images.gradient2}
          icon={images.createdBooks}
        />
      )
    },
    {
      id: `${preUrl}/purchased-books`,
      component: (
        <Ticket
          href={`${preUrl}/purchased-books`}
          header={t("purchasedBooks") as string}
          body={t("purchasedBooksDesc") as string}
          image={images.gradient3}
          icon={images.purchasedBooks}
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
          image={images.gradient4}
          icon={images.borrowedBooks}
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
          image={images.gradient5}
          icon={images.sharedBooks}
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
          image={images.gradient6}
          icon={images.sharingBooks}
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
          image={images.gradient7}
          icon={images.listingBooks}
        />
      )
    },
    {
      id: `${preUrl}/lending-books`,
      component: (
        <Ticket
          href={`${preUrl}/lending-books`}
          header={t("lendingBooks") as string}
          body={t("lendingBooksDesc") as string}
          image={images.gradient8}
          icon={images.lendingBooks}
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
          <Paper sx={{ width: "100%" }}>
            <Ticket
              href={`${preUrl}/owned-books`}
              header={t("ownedBooks") as string}
              body={t("ownedBooksDesc") as string}
              image={images.gradient8}
              icon={images.ownedBooks}
            />
          </Paper>
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
