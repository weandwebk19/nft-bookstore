import { useEffect, useState } from "react";

import { Grid, Paper, Stack, Typography } from "@mui/material";

import axios from "axios";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";

import images from "@/assets/images";
import withAuth from "@/components/HOC/withAuth";
import { useAccount } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ContentContainer } from "@/components/shared/ContentContainer";
import MailboxTable from "@/components/ui/account/mailbox/MailboxTable";
import { WatchlistRowData, WatchlistStatus } from "@/types/watchlist";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const Inboxes = () => {
  const { t } = useTranslation("inbox");
  const { account } = useAccount();
  const { ethereum, contract } = useWeb3();
  const [rows, setRows] = useState<WatchlistRowData[]>([]);

  // Mock value
  // const rows = [
  //   {
  //     id: 1,
  //     bookCover: images.mockupBookCover,
  //     title: "To Kill a Mockingbird",
  //     price: 0.5,
  //     status: "Frozen" as WatchlistStatus
  //   },
  //   {
  //     id: 2,
  //     bookCover: images.mockupBookCover2,
  //     title: "Life of Pi",
  //     price: 0.9,
  //     status: "Open for rent" as WatchlistStatus
  //   }
  // ];

  useEffect(() => {
    (async () => {
      const rows = [] as WatchlistRowData[];
      const watchListRes = await axios.get(`/api/watchlists/${account.data}`);
      if (watchListRes.data.success === true) {
        const watchList = watchListRes.data.data;
        try {
          for (let i = 0; i < watchList.length; i++) {
            const item = watchList[i];
            const tokenURI = await contract!.getUri(item.tokenId);
            const metaRes = await (
              await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
            ).data;
            let meta = null;
            if (metaRes.success === true) {
              meta = metaRes.data;
              if (meta?.author) {
                const userRes = await axios.get(
                  `/api/users/wallet/${meta?.author}`
                );

                if (userRes.data.success === true) {
                  rows.push({
                    tokenId: item?.tokenId,
                    bookCover: meta?.bookCover,
                    title: meta?.title,
                    author: userRes.data.data.fullname
                  });
                }
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      }

      setRows(rows);
    })();
  }, [account.data]);

  return (
    <>
      <Head>
        <title>{t("titlePage") as string}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ContentContainer titles={[`${t("containerTitle")}`]}>
        <Grid container columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
          <Paper sx={{ p: 3, width: "100%" }}>
            <MailboxTable data={rows!} />
          </Paper>
        </Grid>
      </ContentContainer>
    </>
  );
};

export default withAuth(Inboxes);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "inbox"
      ]))
    }
  };
}
