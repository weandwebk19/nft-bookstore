/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";

import { Box, Button, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import { useOwnedSellingBooks } from "@/components/hooks/web3";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { Dialog } from "@/components/shared/Dialog";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import UnListButton from "@/components/ui/account/bookshelf/listing-books/UnListButton";
import { StyledButton } from "@/styles/components/Button";
import { FilterField } from "@/types/filter";
import { BookSelling } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

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

  const router = useRouter();
  const { nfts } = useOwnedSellingBooks(router.query as FilterField);
  const listedBooks = nfts.data;

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

  // const handleOpenRevokeDialogClick = (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   e.preventDefault();
  //   setAnchorRevokeButton(e.currentTarget);
  // };

  // const [anchorRevokeButton, setAnchorRevokeButton] = useState<Element | null>(
  //   null
  // );

  // const openRevokeDialog = Boolean(anchorRevokeButton);

  // const handleRevokeClick = (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   e.preventDefault();
  //   setAnchorRevokeButton(null);
  // };

  // const handleCancelClick = (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   e.preventDefault();
  //   setAnchorRevokeButton(null);
  // };

  // const handleRevokeClose = () => {
  //   setAnchorRevokeButton(null);
  // };

  return (
    <>
      <Head>
        <title>{`${t("titlePage")}`}</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack sx={{ pt: 3 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            mb: 3
          }}
        >
          <BreadCrumbs breadCrumbs={breadCrumbs} />
        </Box>

        <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
          <Grid item xs={4} sm={8} md={9}>
            <ContentPaper
              title={t("listingBooksTitle")}
              // button={
              //   <>
              //     <StyledButton
              //       customVariant="secondary"
              //       onClick={(e) => handleOpenRevokeDialogClick(e)}
              //     >
              //       Revoke All
              //     </StyledButton>
              //     <Dialog
              //       title={t("dialogTitle") as string}
              //       open={openRevokeDialog}
              //       onClose={handleRevokeClose}
              //     >
              //       <Stack spacing={3}>
              //         <Typography>{t("message")}</Typography>
              //         <Stack direction="row" spacing={3} justifyContent="end">
              //           <StyledButton
              //             customVariant="secondary"
              //             onClick={(e) => handleCancelClick(e)}
              //           >
              //             {t("button_cancel")}
              //           </StyledButton>
              //           <StyledButton onClick={(e) => handleRevokeClick(e)}>
              //             {t("button_revoke")}
              //           </StyledButton>
              //         </Stack>
              //       </Stack>
              //     </Dialog>
              //   </>
              // }
            >
              {(() => {
                if (nfts.isLoading) {
                  return (
                    <Typography>{t("loadingMessage") as string}</Typography>
                  );
                } else if (listedBooks?.length === 0 || nfts.error) {
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
                    <>
                      {listedBooks!.map((book: BookSelling) => {
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
                              status="isListing"
                              tokenId={book?.tokenId}
                              owner={book?.seller}
                              onClick={handleBookClick}
                              price={book?.price}
                              amount={book?.amount}
                              buttons={
                                <>
                                  <UnListButton
                                    tokenId={book?.tokenId}
                                    amount={book?.amount}
                                    seller={book?.seller}
                                  />
                                </>
                              }
                              // status={
                              //   book?.endRentalDay !== undefined
                              //     ? book?.endRentalDay > 0
                              //       ? `${pluralize(
                              //           book?.endRentalDay,
                              //           "day"
                              //         )} left`
                              //       : "Ended" // End of leasing term
                              //     : undefined
                              // }
                            />
                          </Grid>
                        );
                      })}
                    </>
                  </Grid>
                );
              })()}
            </ContentPaper>
          </Grid>
          <Grid item xs={4} sm={8} md={3}>
            <FilterBar data={listedBooks} pathname="/bookshelf/listing-books" />
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
        ...namespaceDefaultLanguage(),
        "filter",
        "listingBooks"
      ]))
    }
  };
}
