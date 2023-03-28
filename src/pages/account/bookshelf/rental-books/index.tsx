/* eslint-disable prettier/prettier */
import { Box, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import withAuth from "@/components/HOC/withAuth";
import { useOwnedNfts } from "@/components/hooks/web3";
import {
  LeaseButton,
  ReadButton,
  SellButton
} from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { BreadCrumbs } from "@/components/shared/BreadCrumbs";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";

const breadCrumbs = [
  {
    content: "Bookshelf",
    href: "/account/bookshelf"
  },
  {
    content: "Rental books",
    href: "/account/bookshelf/rental-books"
  }
];

const RentalBooks = () => {
  const { nfts } = useOwnedNfts();
  const router = useRouter();
  const rentalBooks = nfts.data;

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
    <Stack sx={{ pt: 3 }}>
      <Box sx={{ mb: 3 }}>
        <BreadCrumbs breadCrumbs={breadCrumbs} />
      </Box>

      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
        <Grid item xs={4} sm={8} md={9}>
          <ContentPaper title="Rental books">
            {(() => {
              if (nfts.isLoading) {
                return <Typography>Putting books on the shelves...</Typography>;
              } else if (rentalBooks?.length === 0 || nfts.error) {
                return (
                  <FallbackNode>
                    <Typography>You haven&apos;t own any book.</Typography>
                  </FallbackNode>
                );
              }
              return (
                <Grid
                  container
                  spacing={3}
                  columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}
                >
                  {rentalBooks!.map((book) => {
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
                              <SellButton
                                tokenId={book?.tokenId}
                                title={book?.meta.title}
                                bookCover={book?.meta.bookCover}
                                author={book?.author}
                              />
                              <LeaseButton
                                tokenId={book?.tokenId}
                                title={book?.meta.title}
                                bookCover={book?.meta.bookCover}
                                author={book?.author}
                              />
                              <ReadButton bookFile={book?.meta.bookFile} />
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
  );
};

export default withAuth(RentalBooks);

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar", "footer", "filter"]))
    }
  };
}
