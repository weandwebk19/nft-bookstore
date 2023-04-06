import { Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import images from "@/assets/images";
import withAuth from "@/components/HOC/withAuth";
import { Book3D } from "@/components/shared/Book3D";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { Ticket } from "@/components/shared/Ticket";
import { Wrapper } from "@/components/shared/Wrapper";

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
          image={images.product1}
        />
      )
    },
    {
      id: `${preUrl}/owned-books`,
      component: (
        <Ticket
          href={`${preUrl}/owned-books`}
          header={t("ownedBooks") as string}
          image={images.product2}
        />
      )
    },
    {
      id: `${preUrl}/rented-books`,
      component: (
        <Ticket
          href={`${preUrl}/rented-books`}
          header={t("rentedBooks") as string}
          image={images.product3}
        />
      )
    },
    {
      id: `${preUrl}/shared-books`,
      component: (
        <Ticket
          href={`${preUrl}/shared-books`}
          header={t("sharedBooks") as string}
          image={images.product3}
        />
      )
    }
  ];

  const bottomCategories = [
    {
      id: `${preUrl}/recall-books`,
      component: (
        <Ticket
          href={`${preUrl}/recall-books`}
          header={t("recallBooks") as string}
          image={images.product1}
        />
      )
    },
    {
      id: `${preUrl}/sharing-books`,
      component: (
        <Ticket
          href={`${preUrl}/sharing-books`}
          header={t("sharingBooks") as string}
          image={images.product1}
        />
      )
    },
    {
      id: `${preUrl}/listing-books`,
      component: (
        <Ticket
          href={`${preUrl}/listing-books`}
          header={t("listingBooks") as string}
          image={images.product1}
        />
      )
    },
    {
      id: `${preUrl}/leasing-books`,
      component: (
        <Ticket
          href={`${preUrl}/leasing-books`}
          header={t("leasingBooks") as string}
          image={images.product1}
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
        "navbar",
        "footer",
        "bookshelf"
      ]))
    }
  };
}
