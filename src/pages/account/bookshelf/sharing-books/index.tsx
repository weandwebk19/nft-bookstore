import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Box, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import { useAccount, useOwnedSharingBooks } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import RevokeAllSharedOutButton from "@/components/ui/account/bookshelf/sharing-books/RevokeAllSharedOutButton";
import RevokeAllSharingButton from "@/components/ui/account/bookshelf/sharing-books/RevokeAllSharingButton";
import RevokeSharedOutButton from "@/components/ui/account/bookshelf/sharing-books/RevokeSharedOutButton";
import RevokeSharingButton from "@/components/ui/account/bookshelf/sharing-books/RevokeSharingButton";
import { BookSharing } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";
import { secondsToDhms } from "@/utils/secondsToDhms";

const SharingBooks = () => {
  const { t } = useTranslation("sharingBooks");
  const { account } = useAccount();
  const { contract } = useWeb3();

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

  const handleBookClick = (tokenId: number | string) => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
      if (res.data.success === true) {
        const bookId = res.data.data;
        router.push(`/books/${bookId}`);
      }
    })();
  };

  const handleRevokeSharingClick = async (tokenId: number, renter: string) => {
    try {
      // handle errors
      if (renter !== account.data) {
        return toast.error("Renter address is not valid.", {
          position: toast.POSITION.TOP_CENTER
        });
      }

      const tx = await contract?.updateBookFromRenting(tokenId, 0, 0, renter);

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Pending.",
        success: "Revoke Sharing NftBook successfully",
        error: "Oops! There's a problem with sharing revoke process!"
      });
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message}.`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  const handleRevokeSharedOutClick = async (
    tokenId: number,
    renter: string,
    borrower: string,
    startTime: number,
    endTime: number
  ) => {
    try {
      // handle errors
      if (renter !== account.data) {
        return toast.error("Renter address is not valid.", {
          position: toast.POSITION.TOP_CENTER
        });
      }

      const idBorrowedBook = await contract!.getIdBorrowedBook(
        tokenId,
        renter,
        borrower,
        startTime,
        endTime
      );
      const tx = await contract?.recallBorrowedBooks(idBorrowedBook);

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Pending.",
        success: "Revoke shared out book successfully",
        error: "Oops! There's a problem with shared out process!"
      });
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message}.`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
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
                button={<RevokeAllSharingButton />}
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
                                  <RevokeSharingButton
                                    sharedPer={book?.sharedPer}
                                    isEnded={book?.endTime - nowTime === 0}
                                    countDown={secondsToDhms(
                                      book?.endTime - nowTime
                                    )}
                                    tokenId={book?.tokenId}
                                    title={book?.meta.title}
                                    bookCover={book?.meta.bookCover}
                                    sharer={book?.sharer}
                                    amount={book?.amount}
                                    handleRevoke={async () => {
                                      return handleRevokeSharingClick(
                                        book?.tokenId,
                                        book?.sharer
                                      );
                                    }}
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
                button={<RevokeAllSharedOutButton />}
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
                                  <RevokeSharedOutButton
                                    tokenId={book?.tokenId}
                                    title={book?.meta.title}
                                    bookCover={book?.meta.bookCover}
                                    renter={book?.sharer}
                                    amount={book?.amount}
                                    handleRevoke={async () => {
                                      return handleRevokeSharedOutClick(
                                        book?.tokenId,
                                        book?.sharer,
                                        book?.sharedPer,
                                        book?.startTime,
                                        book?.endTime
                                      );
                                    }}
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
