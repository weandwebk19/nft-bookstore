import { Stack } from "@mui/material";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import images from "@/assets/images";
import withAuth from "@/components/HOC/withAuth";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { Ticket } from "@/components/shared/Ticket";
import { Wrapper } from "@/components/shared/Wrapper";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const preUrl = "/account/mailbox";

const MailBox = () => {
  const { t } = useTranslation("mailbox");

  const topCategories = [
    {
      id: `${preUrl}/inbox`,
      component: (
        <Ticket
          href={`${preUrl}/inbox`}
          header={t("inbox") as string}
          body={t("inboxDesc") as string}
          image={images.gradient1}
        />
      )
    },
    {
      id: `${preUrl}/outbox`,
      component: (
        <Ticket
          href={`${preUrl}/outbox`}
          header={t("outbox") as string}
          body={t("outboxDesc") as string}
          image={images.gradient2}
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
          <Wrapper items={topCategories} itemsInARow={2} />
        </ContentContainer>
      </Stack>
    </>
  );
};

export default withAuth(MailBox);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "mailbox"
      ]))
    }
  };
}
