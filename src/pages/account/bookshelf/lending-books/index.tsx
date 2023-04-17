/* eslint-disable prettier/prettier */
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
  useAccount,
  useOwnedLeasedOutBooks,
  useOwnedLeasingBooks
} from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import RevokeAllLendingButton from "@/components/ui/account/bookshelf/lending-books/RevokeAllLendingButton";
import RevokeAllLentOutButton from "@/components/ui/account/bookshelf/lending-books/RevokeAllLentOutButton";
import RevokeLendingButton from "@/components/ui/account/bookshelf/lending-books/RevokeLendingButton";
import RevokeLentOutButton from "@/components/ui/account/bookshelf/lending-books/RevokeLentOutButton";
import { BorrowedBook, LeaseBook } from "@/types/nftBook";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";
import { secondsToDhms } from "@/utils/secondsToDhms";

const LendingBooks = () => {
  const { t } = useTranslation("lendingBooks");

  const breadCrumbs = [
    {
      content: t("breadcrumbs_bookshelf") as string,
      href: "/account/bookshelf"
    },
    {
      content: t("breadcrumbs_lendingBooks") as string,
      href: "/account/bookshelf/lending-books"
    }
  ];

  const router = useRouter();
  const { account } = useAccount();
  const { contract } = useWeb3();

  const { nfts: lendNfts } = useOwnedLeasingBooks();
  const lendingBooks = lendNfts.data as LeaseBook[];

  const { nfts: lentOutNfts } = useOwnedLeasedOutBooks();
  const lentOutBooks = lentOutNfts.data as BorrowedBook[];

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

  const handleRevokeLendingClick = async (tokenId: number, renter: string) => {
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
        success: "Revoke Lending NftBook successfully",
        error: "Oops! There's a problem with lending revoke process!"
      });
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message}.`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  const handleRevokeBorrowedBooks = async (
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
        success: "Revoke lent out book successfully",
        error: "Oops! There's a problem with lent out process!"
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
              {/* Lease books that have not been borrowed by anyone */}
              <ContentPaper
                title={t("lendingBooksTitle")}
                button={<RevokeAllLendingButton />}
              >
                {(() => {
                  if (lendNfts.isLoading) {
                    return (
                      <Typography>{t("loadingMessage") as string}</Typography>
                    );
                  } else if (lendingBooks?.length === 0 || lendNfts.error) {
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
                        {lendingBooks!.map((book: LeaseBook) => {
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
                                status="isLending"
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
                                    <RevokeLendingButton
                                      tokenId={book?.tokenId}
                                      title={book?.meta.title}
                                      bookCover={book?.meta.bookCover}
                                      renter={book?.renter}
                                      amount={book?.amount}
                                      handleRevoke={async () => {
                                        return handleRevokeLendingClick(
                                          book?.tokenId,
                                          book?.renter
                                        );
                                      }}
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
                                //       : "Ended" // End of lending term
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
                title={t("lentOutBooksTitle")}
                button={<RevokeAllLentOutButton />}
              >
                {(() => {
                  if (lentOutNfts.isLoading) {
                    return (
                      <Typography>{t("loadingMessage") as string}</Typography>
                    );
                  } else if (lentOutBooks?.length === 0 || lentOutNfts.error) {
                    return (
                      <FallbackNode>
                        <Typography>
                          {t("emptyMessage__lentOutBooks") as string}
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
                        {lentOutBooks!.map((book) => {
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
                                status="isLending"
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
                                    <RevokeLentOutButton
                                      tokenId={book?.tokenId}
                                      title={book?.meta.title}
                                      bookCover={book?.meta.bookCover}
                                      renter={book?.renter}
                                      amount={book?.amount}
                                      handleRevoke={async () => {
                                        return handleRevokeBorrowedBooks(
                                          book?.tokenId,
                                          book?.renter,
                                          book?.borrower,
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
                      </>
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
        <ToastContainer />
      </Stack>
    </>
  );
};

export default withAuth(LendingBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "filter",
        "lendingBooks"
      ]))
    }
  };
}