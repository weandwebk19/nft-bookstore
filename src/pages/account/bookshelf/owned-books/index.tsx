/* eslint-disable prettier/prettier */
import { Box, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import { useOwnedNfts } from "@/components/hooks/web3";
import {
  ReadButton,
  ReviewButton,
  SellButton
} from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { FilterField } from "@/types/filter";
import { NftBook } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

const OwnedBooks = () => {
  const { t } = useTranslation("ownedBooks");

  const breadCrumbs = [
    {
      content: t("breadcrumbs_bookshelf") as string,
      href: "/account/bookshelf"
    },
    {
      content: t("breadcrumbs_ownedBooks") as string,
      href: "/account/bookshelf/owned-books"
    }
  ];

  const router = useRouter();
  const { nfts } = useOwnedNfts(router.query as FilterField);
  const ownedBooks = nfts.data;

  const handleBookClick = (tokenId: number | string) => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
      console.log("res", res);
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
            <ContentPaper title={t("ownedBooksTitle")}>
              {(() => {
                if (nfts.isLoading) {
                  return (
                    <Typography>{t("loadingMessage") as string}</Typography>
                  );
                } else if (ownedBooks?.length === 0 || nfts.error) {
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
                    {ownedBooks!.map((book: NftBook) => {
                      return (
                        <Grid
                          item
                          key={book.tokenId}
                          xs={4}
                          sm={4}
                          md={6}
                          lg={6}
                        >
                          <ActionableBookItem
                            status="isOwned"
                            tokenId={book?.tokenId}
                            owner={book?.author}
                            onClick={handleBookClick}
                            quantity={book?.quantity}
                            amountOwned={book?.amountOwned}
                            amountTradeable={book?.amountTradeable}
                            buttons={
                              <>
                                <ReviewButton
                                  tokenId={book?.tokenId}
                                  author={book?.author}
                                />
                                <ReadButton tokenId={book?.tokenId} />
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
          </Grid>
          <Grid item xs={4} sm={8} md={3}>
            <FilterBar data={ownedBooks} pathname="/bookshelf/owned-books" />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default withAuth(OwnedBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "filter",
        "ownedBooks",
        "bookButtons"
      ]))
    }
  };
}
