/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import { useAccount, useOwnedListedBooks } from "@/components/hooks/web3";
import { BookList } from "@/components/shared/BookList";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { StyledButton } from "@/styles/components/Button";

const ListingBooks = () => {
  const { t } = useTranslation("listingBooks");

  const breadCrumbs = [
    {
      content: t("breadcrumbs_bookshelf") as string,
      href: "/account/bookshelf"
    },
    {
      content: t("breadcrumbs_listingBooks") as string,
      href: "/account/bookshelf/listed-books"
    }
  ];

  const { nfts } = useOwnedListedBooks();
  const [ownedBooks, setOwnedBooks] = useState<any[]>([]);
  const router = useRouter();

  const { account } = useAccount();

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

  useEffect(() => {
    if (nfts.data?.length !== 0) {
      const res = nfts.data?.filter((nft: any) => nft.author !== account.data);
      if (res) setOwnedBooks(res);
    }
  }, [nfts.data, account.data]);

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
            <ContentPaper title={t("listingBooksTitle")}>
              {(() => {
                if (nfts.isLoading) {
                  return (
                    <Typography>{t("loadingMessage") as string}</Typography>
                  );
                } else if (ownedBooks.length === 0 || nfts.error) {
                  return (
                    <FallbackNode>
                      <Stack spacing={3}>
                        <Typography>{t("emptyMessage") as string}</Typography>
                        <StyledButton
                          onClick={() => {
                            router.push("/account/bookshelf/created-books");
                          }}
                        >
                          {t("button_createdBooks")}
                        </StyledButton>
                      </Stack>
                    </FallbackNode>
                  );
                }
                return (
                  <BookList bookList={ownedBooks!} onClick={handleBookClick} />
                );
              })()}
            </ContentPaper>
          </Grid>
          <Grid item xs={4} sm={8} md={3}>
            <ContentPaper title="Filter">
              <FilterBar />
            </ContentPaper>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default withAuth(ListingBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "navbar",
        "footer",
        "filter",
        "listingBooks"
      ]))
    }
  };
}
