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
import RevokeButton from "@/components/shared/BookButton/RevokeButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BookList } from "@/components/shared/BookList";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { Dialog } from "@/components/shared/Dialog";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { StyledButton } from "@/styles/components/Button";
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

  const handleOpenRevokeDialogClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorRevokeButton(e.currentTarget);
  };

  const [anchorRevokeButton, setAnchorRevokeButton] = useState<Element | null>(
    null
  );

  const openRevokeDialog = Boolean(anchorRevokeButton);

  const handleRevokeClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorRevokeButton(null);
  };

  const handleCancelClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorRevokeButton(null);
  };

  const handleRevokeClose = () => {
    setAnchorRevokeButton(null);
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
            <ContentPaper
              title={t("listingBooksTitle")}
              button={
                <>
                  <StyledButton
                    customVariant="secondary"
                    onClick={(e) => handleOpenRevokeDialogClick(e)}
                  >
                    Revoke All
                  </StyledButton>
                  <Dialog
                    title={t("dialogTitle") as string}
                    open={openRevokeDialog}
                    onClose={handleRevokeClose}
                  >
                    <Stack spacing={3}>
                      <Typography>{t("message")}</Typography>
                      <Stack direction="row" spacing={3} justifyContent="end">
                        <StyledButton
                          customVariant="secondary"
                          onClick={(e) => handleCancelClick(e)}
                        >
                          {t("button_cancel")}
                        </StyledButton>
                        <StyledButton onClick={(e) => handleRevokeClick(e)}>
                          {t("button_revoke")}
                        </StyledButton>
                      </Stack>
                    </Stack>
                  </Dialog>
                </>
              }
            >
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
                    <>
                      {ownedBooks!.map((book) => {
                        return (
                          <Grid
                            item
                            key={book.tokenId}
                            xs={4}
                            sm={8}
                            md={6}
                            lg={12}
                          >
                            <ActionableBookItem
                              status="isListing"
                              tokenId={book?.tokenId}
                              bookCover={book?.meta.bookCover}
                              title={book?.meta.title}
                              fileType={book?.meta.fileType}
                              renter={book?.renter}
                              onClick={handleBookClick}
                              price={book?.price}
                              amount={book?.amount}
                              buttons={
                                <>
                                  <RevokeButton
                                    buttonName="Unlisting"
                                    tokenId={book?.tokenId}
                                    title={book?.meta.title}
                                    bookCover={book?.meta.bookCover}
                                    renter={book?.renter}
                                    amount={book?.amount}
                                    handleRevoke={() => {}}
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
        ...namespaceDefaultLanguage(),
        "filter",
        "listingBooks"
      ]))
    }
  };
}
