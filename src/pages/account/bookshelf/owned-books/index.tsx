/* eslint-disable prettier/prettier */
import { Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import { useOwnedNfts } from "@/components/hooks/web3";
import {
  LeaseButton,
  ReadButton,
  SellButton
} from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";

const OwnedBooks = () => {
  const { nfts } = useOwnedNfts();
  const router = useRouter();
  const ownedBooks = nfts.data;

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
    <Stack sx={{ pt: 12 }}>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
        <Grid item xs={4} sm={8} md={9}>
          <ContentPaper title="Owned books">
            {(() => {
              if (nfts.isLoading) {
                return <Typography>Putting books on the shelves...</Typography>;
              } else if (ownedBooks?.length === 0 || nfts.error) {
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
                          tokenId={book?.tokenId}
                          bookCover={book?.meta.bookCover}
                          title={book?.meta.title}
                          fileType={book?.meta.fileType}
                          author={book?.author}
                          onClick={handleBookClick}
                          buttons={
                            <>
                              <SellButton
                                title={book?.meta.title}
                                bookCover={book?.meta.bookCover}
                                author={book?.author}
                              />
                              <LeaseButton
                                title={book?.meta.title}
                                bookCover={book?.meta.bookCover}
                                author={book?.author}
                              />
                              <ReadButton tokenId={book?.tokenId} />
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

export default OwnedBooks;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar", "footer", "filter"]))
    }
  };
}
