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
import WatchlistTable from "@/components/ui/account/watchlist/WatchlistTable";
import { WatchlistRowData, WatchlistStatus } from "@/types/watchlist";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const Watchlist = () => {
  const { t } = useTranslation("watchlist");
  const { account } = useAccount();
  const {
    bookStoreContract,
    bookSellingContract,
    bookRentingContract,
    bookSharingContract
  } = useWeb3();
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
            const tokenURI = await bookStoreContract!.getUri(item.tokenId);
            const metaRes = await (
              await axios.get(`/api/pinata/metadata?nftUri=${tokenURI}`)
            ).data;

            if (metaRes.success === true) {
              const meta = metaRes.data;
              if (meta?.author) {
                const isListing = await bookSellingContract!.isListing(
                  item.tokenId,
                  meta?.author
                );
                const userRes = await axios.get(
                  `/api/users/wallet/${meta?.author}`
                );

                if (userRes.data.success === true) {
                  rows.push({
                    tokenId: item?.tokenId,
                    bookCover: meta?.bookCover,
                    title: meta?.title,
                    author: userRes.data.data.fullname,
                    status: isListing ? "Listings" : "Waiting for open"
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
  }, [account.data, bookStoreContract]);

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
            <WatchlistTable data={rows!} />
          </Paper>
        </Grid>
      </ContentContainer>
    </>
  );
};

export default withAuth(Watchlist);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "watchlist"
      ]))
    }
  };
}
