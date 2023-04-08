import React from "react";

import { Box, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import {
  EditButton,
  RecallButton,
  SellButton
} from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { Dialog } from "@/components/shared/Dialog";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { bookList } from "@/mocks";
import { StyledButton } from "@/styles/components/Button";

const RecallBooks = () => {
  const { t } = useTranslation("recallBooks");

  const breadCrumbs = [
    {
      content: t("breadcrumbs_bookshelf") as string,
      href: "/account/bookshelf"
    },
    {
      content: t("breadcrumbs_recallBooks") as string,
      href: "/account/bookshelf/shared-books"
    }
  ];

  const router = useRouter();

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

  const [anchorRecallButton, setAnchorRecallButton] =
    React.useState<Element | null>(null);

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
              title={t("recallBooksTitle")}
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
                // if (nfts.isLoading) {
                //   return (
                //     <Typography>{t("loadingMessage") as string}</Typography>
                //   );
                // } else if (recallBooks?.length === 0 || nfts.error) {
                //   return (
                //     <FallbackNode>
                //       <Typography>{t("emptyMessage") as string}</Typography>
                //     </FallbackNode>
                //   );
                // }
                return (
                  <Grid
                    container
                    spacing={3}
                    columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}
                  >
                    {bookList!.map((book) => {
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
                            tokenId={book?.tokenId}
                            bookCover={book?.meta.bookCover}
                            title={book?.meta.title}
                            fileType={book?.meta.fileType}
                            author={book?.author}
                            onClick={handleBookClick}
                            buttons={
                              <>
                                <RecallButton
                                  tokenId={book?.tokenId}
                                  title={book?.meta.title}
                                  bookCover={book?.meta.bookCover}
                                  author={book?.author}
                                />
                                <EditButton tokenId={book?.tokenId} />
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
            <ContentPaper title="Filter">
              <FilterBar />
            </ContentPaper>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};

export default withAuth(RecallBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "navbar",
        "footer",
        "filter",
        "recallBooks"
      ]))
    }
  };
}