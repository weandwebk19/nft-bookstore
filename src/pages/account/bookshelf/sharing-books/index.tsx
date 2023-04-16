import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import { useOwnedSharingBooks } from "@/components/hooks/web3";
import { RecallButton } from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { Dialog } from "@/components/shared/Dialog";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import RecallSharingButton from "@/components/ui/account/bookshelf/sharing-books/RecallSharingButton";
import { bookList } from "@/mocks";
import { StyledButton } from "@/styles/components/Button";
import { BookSharing } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";
import pluralize from "@/utils/pluralize";
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

  const { nfts } = useOwnedSharingBooks();
  const router = useRouter();
  const sharingBooks = nfts.data as BookSharing[];

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
              <ContentPaper
                title={t("sharingBooksTitle")}
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
                  if (nfts.isLoading) {
                    return (
                      <Typography>{t("loadingMessage") as string}</Typography>
                    );
                  } else if (sharingBooks?.length === 0 || nfts.error) {
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
                      {sharingBooks!.map((book) => {
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
                              status="isSharing"
                              tokenId={book?.tokenId}
                              bookCover={book?.meta.bookCover}
                              title={book?.meta.title}
                              fileType={book?.meta.fileType}
                              onClick={handleBookClick}
                              buttons={
                                <>
                                  <RecallSharingButton
                                    borrower={book?.sharedPer}
                                    isEnded={book?.endTime - nowTime === 0}
                                    countDown={secondsToDhms(
                                      book?.endTime - nowTime
                                    )}
                                    tokenId={book?.tokenId}
                                    title={book?.meta.title}
                                    bookCover={book?.meta.bookCover}
                                    renter={book?.sharer}
                                    amount={book?.amount}
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
              <ContentPaper
                title={t("sharedOutBooksTitle")}
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
                  if (nfts.isLoading) {
                    return (
                      <Typography>{t("loadingMessage") as string}</Typography>
                    );
                  } else if (sharingBooks?.length === 0 || nfts.error) {
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
                      {sharingBooks!.map((book) => {
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
                              status="isSharing"
                              tokenId={book?.tokenId}
                              bookCover={book?.meta.bookCover}
                              title={book?.meta.title}
                              fileType={book?.meta.fileType}
                              onClick={handleBookClick}
                              buttons={
                                <>
                                  <RecallButton
                                    tokenId={book?.tokenId}
                                    title={book?.meta.title}
                                    bookCover={book?.meta.bookCover}
                                    renter={book?.sharer}
                                    amount={book?.amount}
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
            </Stack>
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

export default withAuth(SharingBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "filter",
        "sharingBooks"
      ]))
    }
  };
}
