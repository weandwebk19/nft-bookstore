/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";

import { Box, Divider, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import {
  useAccount,
  useOwnedLeasedOutBooks,
  useOwnedLeasingBooks
} from "@/components/hooks/web3";
import { RecallButton } from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { Dialog } from "@/components/shared/Dialog";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { StyledButton } from "@/styles/components/Button";
import { BorrowedBook, LeaseBook } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";
import pluralize from "@/utils/pluralize";
import { secondsToDhms } from "@/utils/secondsToDhms";

const LeasingBooks = () => {
  const { t } = useTranslation("leasingBooks");

  const breadCrumbs = [
    {
      content: t("breadcrumbs_bookshelf") as string,
      href: "/account/bookshelf"
    },
    {
      content: t("breadcrumbs_leasingBooks") as string,
      href: "/account/bookshelf/leasing-books"
    }
  ];

  const router = useRouter();

  const { nfts: leaseNfts } = useOwnedLeasingBooks();
  const leasingBooks = leaseNfts.data as LeaseBook[];

  const { nfts: leasedOutNfts } = useOwnedLeasedOutBooks();
  const leasedOutBooks = leasedOutNfts.data as BorrowedBook[];

  const [nowTime, setNowTime] = useState<number>(0);

  useEffect(() => {
    const seconds = new Date().getTime() / 1000;
    setNowTime(seconds);
  }, []);

  const handleOpenRecallDialogClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorRecallButton(e.currentTarget);
  };

  const handleBookClick = (tokenId: number | string) => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
      if (res.data.success === true) {
        const bookId = res.data.data;
        router.push(`/books/${bookId}`);
      }
    })();
  };

  const [anchorRecallButton, setAnchorRecallButton] = useState<Element | null>(
    null
  );

  const openRecallDialog = Boolean(anchorRecallButton);

  const handleRecallClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorRecallButton(null);
  };

  const handleCancelClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorRecallButton(null);
  };

  const handleRecallClose = () => {
    setAnchorRecallButton(null);
  };

  // useEffect(() => {
  //   if (nfts.data?.length !== 0) {
  //     const res = nfts.data?.filter((nft: any) => nft.author !== account.data);
  //     if (res) setLeasingBooks(res);
  //   }
  // }, [nfts.data, account.data]);

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
              {/* Lease books that have not been borrowed by anyone */}
              <ContentPaper
                title={t("leasingBooksTitle")}
                button={
                  <>
                    <StyledButton
                      customVariant="secondary"
                      onClick={(e) => handleOpenRecallDialogClick(e)}
                    >
                      Recall All
                    </StyledButton>
                    <Dialog
                      title={t("dialogTitle") as string}
                      open={openRecallDialog}
                      onClose={handleRecallClose}
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
                          <StyledButton onClick={(e) => handleRecallClick(e)}>
                            {t("button_recall")}
                          </StyledButton>
                        </Stack>
                      </Stack>
                    </Dialog>
                  </>
                }
              >
                {(() => {
                  if (leaseNfts.isLoading) {
                    return (
                      <Typography>{t("loadingMessage") as string}</Typography>
                    );
                  } else if (leasingBooks?.length === 0 || leaseNfts.error) {
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
                        {leasingBooks!.map((book: LeaseBook) => {
                          return (
                            <Grid
                              item
                              key={book.tokenId}
                              xs={4}
                              sm={4}
                              md={6}
                              lg={8}
                            >
                              <ActionableBookItem
                                status="isLeasing"
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
                                    <RecallButton
                                      buttonName="Recall leasing"
                                      tokenId={book?.tokenId}
                                      title={book?.meta.title}
                                      bookCover={book?.meta.bookCover}
                                      renter={book?.renter}
                                      amount={book?.amount}
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

              {/* Lease books that have been borrowed by others */}
              <ContentPaper
                title={t("leasedOutBooksTitle")}
                button={
                  <>
                    <StyledButton
                      customVariant="secondary"
                      onClick={(e) => handleOpenRecallDialogClick(e)}
                    >
                      Recall All
                    </StyledButton>
                    <Dialog
                      title={t("dialogTitle") as string}
                      open={openRecallDialog}
                      onClose={handleRecallClose}
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
                          <StyledButton onClick={(e) => handleRecallClick(e)}>
                            {t("button_recall")}
                          </StyledButton>
                        </Stack>
                      </Stack>
                    </Dialog>
                  </>
                }
              >
                {(() => {
                  if (leasedOutNfts.isLoading) {
                    return (
                      <Typography>{t("loadingMessage") as string}</Typography>
                    );
                  } else if (
                    leasedOutBooks?.length === 0 ||
                    leasedOutNfts.error
                  ) {
                    return (
                      <FallbackNode>
                        <Typography>
                          {t("emptyMessage__leasedOutBooks") as string}
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
                      <>
                        {leasedOutBooks!.map((book) => {
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
                                status="isLeasing"
                                tokenId={book?.tokenId}
                                bookCover={book?.meta.bookCover}
                                title={book?.meta.title}
                                fileType={book?.meta.fileType}
                                renter={book?.renter}
                                onClick={handleBookClick}
                                price={book?.price}
                                amount={book?.amount}
                                borrower={book?.borrower}
                                countDown={secondsToDhms(
                                  book?.endTime - nowTime
                                )}
                                buttons={
                                  <>
                                    <RecallButton
                                      tokenId={book?.tokenId}
                                      title={book?.meta.title}
                                      bookCover={book?.meta.bookCover}
                                      renter={book?.renter}
                                      amount={book?.amount}
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
            </Stack>
          </Grid>
          <Grid item xs={4} sm={8} md={3}>
            <FilterBar />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default withAuth(LeasingBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "filter",
        "leasingBooks"
      ]))
    }
  };
}
