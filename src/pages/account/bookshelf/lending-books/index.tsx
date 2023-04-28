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
  useOwnedLendingBooks,
  useOwnedLentOutBooks
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
import { BorrowedBook, LendBook } from "@/types/nftBook";
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

  const { nfts: lendNfts } = useOwnedLendingBooks();
  const lendingBooks = lendNfts.data as LendBook[];

  const { nfts: lentOutNfts } = useOwnedLentOutBooks();
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
                button={<RevokeAllLendingButton allBooks={lendingBooks} />}
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
                        {lendingBooks!.map((book: LendBook) => {
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
                              lg={6}
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
                                      borrower={book?.borrower}
                                      amount={book?.amount}
                                      startTime={book?.startTime}
                                      endTime={book?.endTime}
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
            <FilterBar
              data={lendingBooks}
              pathname="/bookshelf/lending-books"
            />
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
