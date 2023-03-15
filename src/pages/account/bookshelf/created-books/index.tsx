import { Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import { useCreatedBooks } from "@/components/hooks/web3";
import { EditButton, SellButton } from "@/components/shared/BookButton";
import { ActionableBookItem } from "@/components/shared/BookItem";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";

const CreatedBooks = () => {
  const { nfts } = useCreatedBooks();
  const router = useRouter();
  const createdBooks = nfts.data;

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
    <Stack sx={{ pt: 12 }}>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
        <Grid item xs={4} sm={8} md={9}>
          <ContentPaper title="Created books">
            {(() => {
              if (nfts.isLoading) {
                return <Typography>Putting books on the shelves...</Typography>;
              } else if (createdBooks?.length === 0 || nfts.error) {
                return (
                  <FallbackNode>
                    <Typography>You haven&apos;t create any book.</Typography>
                  </FallbackNode>
                );
              }
              return (
                <Grid
                  container
                  spacing={3}
                  columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}
                >
                  {createdBooks!.map((book) => {
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
  );
};

export default CreatedBooks;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar", "footer", "filter"]))
    }
  };
}
