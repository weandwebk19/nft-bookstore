import { Grid, Paper, Stack } from "@mui/material";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import images from "@/assets/images";
import withAuth from "@/components/HOC/withAuth";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { BasicTabs } from "@/components/shared/Tab";
import { Ticket } from "@/components/shared/Ticket";
import { Wrapper } from "@/components/shared/Wrapper";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const preUrl = "/account/bookshelf";

const BookShelf = () => {
  const { t } = useTranslation("bookshelf");

  const firstCategories = [
    // {
    //   id: `${preUrl}/created-books`,
    //   component: (
    //     <Ticket
    //       href={`${preUrl}/created-books`}
    //       header={t("createdBooks") as string}
    //       body={t("createdBooksDesc") as string}
    //       image={images.gradient2}
    //       icon={images.createdBooks}
    //     />
    //   )
    // },
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

  const secondCategories = [
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
    }
  ];

  const tabs = [
    {
      label: "Books in possession",
      content: <Wrapper items={firstCategories} itemsInARow={4} />
    },
    {
      label: "Books on sale",
      content: <Wrapper items={secondCategories} itemsInARow={4} />
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
      <Stack spacing={6} mt={6}>
        <ContentContainer titles={[`${t("containerTitle")}`]}>
          <Grid container columns={{ sm: 1, md: 2 }} spacing={3}>
            <Grid item sm={1} md={1}>
              <Paper sx={{ width: "100%" }}>
                <Ticket
                  href={`${preUrl}/created-books`}
                  header={t("createdBooks") as string}
                  body={t("createdBooksDesc") as string}
                  image={images.gradient2}
                  icon={images.createdBooks}
                />
              </Paper>
            </Grid>
            <Grid item sm={1} md={1}>
              <Paper sx={{ width: "100%" }}>
                <Ticket
                  href={`${preUrl}/owned-books`}
                  header={t("ownedBooks") as string}
                  body={t("ownedBooksDesc") as string}
                  image={images.gradient8}
                  icon={images.ownedBooks}
                />
              </Paper>
            </Grid>
          </Grid>
          <BasicTabs tabs={tabs} />
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
