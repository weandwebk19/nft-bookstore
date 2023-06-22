import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import {
  useOwnedSharedOutBooks,
  useOwnedSharingBooks
} from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
// import RevokeSharedOutButton from "@/components/ui/account/bookshelf/sharing-books/RevokeSharedOutButton";
import RevokeSharingButton from "@/components/ui/account/bookshelf/sharing-books/RevokeSharingButton";
import { FilterField } from "@/types/filter";
import { BookSharing } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";
import { secondsToDhms } from "@/utils/secondsToDhms";

const SharingBooks = () => {
  const { t } = useTranslation("sharingBooks");

  const breadCrumbs = [
    {
      content: t("breadcrumbs_bookshelf") as string,
      href: "/account/bookshelf"
    },
    {
      content: t("breadcrumbs_sharingBooks") as string,
      href: "/account/bookshelf/shared-books"
    }
  ];

  const router = useRouter();
  const { nfts: sharingNfts } = useOwnedSharingBooks(
    router.query as FilterField
  );
  const sharingBooks = sharingNfts.data as BookSharing[];

  const { nfts: sharedNfts } = useOwnedSharedOutBooks(
    router.query as FilterField
  );

  const sharedBooks = sharedNfts.data as BookSharing[];

  const [nowTime, setNowTime] = useState<number>(0);

  useEffect(() => {
    const seconds = new Date().getTime() / 1000;
    setNowTime(seconds);
  }, []);

  const handleBookClick = (tokenId: number | string) => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
      if (res.data.success === true) {
        const bookId = res.data.data;
        router.push(`/books/${bookId}`);
      }
    })();
  };

  return (
    <>
      <Head>
        <title>{`${t("titlePage")}`}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <BreadCrumbs breadCrumbs={breadCrumbs} />
        </Box>

        <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
          <Grid item xs={4} sm={8} md={9}>
            <Stack spacing={3}>
              {/* Shared books that have not been borrowed by anyone */}
              <ContentPaper title={t("sharingBooksTitle")}>
                {(() => {
                  if (sharingNfts.isLoading) {
                    return (
                      <Typography>{t("loadingMessage") as string}</Typography>
                    );
                  } else if (sharingBooks?.length === 0 || sharingNfts.error) {
                    return (
                      <FallbackNode>
                        <Typography>{t("emptyMessage") as string}</Typography>
                      </FallbackNode>
                    );
                  }
                  return (
                    <Grid
                      container
                      spacing={3}
                      columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}
                    >
                      {sharingBooks!.map((book: BookSharing, index: number) => {
                        return (
                          <Grid item key={index} xs={4} sm={8} md={6} lg={6}>
                            <ActionableBookItem
                              status="isSharing"
                              tokenId={book?.tokenId}
                              amount={book?.amount}
                              price={book?.price}
                              countDown={secondsToDhms(book?.endTime - nowTime)}
                              onClick={handleBookClick}
                              buttons={
                                <>
                                  <RevokeSharingButton
                                    sharedPer={book?.sharedPer}
                                    isEnded={book?.endTime < nowTime}
                                    countDown={secondsToDhms(
                                      book?.endTime - nowTime
                                    )}
                                    tokenId={book?.tokenId}
                                    sharer={book?.sharer}
                                    amount={book?.amount}
                                    fromRenter={book?.fromRenter}
                                    startTime={book?.startTime}
                                    endTime={book?.endTime}
                                  />
                                </>
                              }
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  );
                })()}
              </ContentPaper>

              {/* Shared books that have been borrowed by others */}
              <ContentPaper title={t("sharedOutBooksTitle")}>
                {(() => {
                  if (sharedNfts.isLoading) {
                    return (
                      <Typography>{t("loadingMessage") as string}</Typography>
                    );
                  } else if (sharedBooks?.length === 0 || sharedNfts.error) {
                    return (
                      <FallbackNode>
                        <Typography>
                          {t("emptyMessage__sharedOutBooks") as string}
                        </Typography>
                      </FallbackNode>
                    );
                  }
                  return (
                    <Grid
                      container
                      spacing={3}
                      columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}
                    >
                      {sharedBooks!.map((book: BookSharing, index: number) => {
                        return (
                          <Grid item key={index} xs={4} sm={4} md={6} lg={6}>
                            <ActionableBookItem
                              status="isSharing"
                              tokenId={book?.tokenId}
                              amount={book?.amount}
                              onClick={handleBookClick}
                              countDown={secondsToDhms(book?.endTime - nowTime)}
                              price={book?.price}
                              renter={book?.fromRenter}
                              sharedPerson={book?.sharedPer}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  );
                })()}
              </ContentPaper>
            </Stack>
          </Grid>
          <Grid item xs={4} sm={8} md={3}>
            <FilterBar
              data={sharingBooks}
              pathname="/bookshelf/sharing-books"
            />
          </Grid>
        </Grid>
        <ToastContainer />
      </Stack>
    </>
  );
};

export default withAuth(SharingBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "filter",
        "sharingBooks",
        "bookButtons"
      ]))
    }
  };
}
