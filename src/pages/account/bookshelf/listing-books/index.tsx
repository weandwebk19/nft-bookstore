/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";

import { Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import { useAccount, useOwnedListedBooks } from "@/components/hooks/web3";
import { BookList } from "@/components/shared/BookList";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";
import { StyledButton } from "@/styles/components/Button";

const ListingBooks = () => {
  // *Replace my-listing-books-hook here*
  const { nfts } = useOwnedListedBooks();
  console.log("nfts", nfts);
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

  useEffect(() => {
    if (nfts.data?.length !== 0) {
      const res = nfts.data?.filter((nft: any) => nft.author !== account.data);
      if (res) setOwnedBooks(res);
    }
  }, [nfts.data, account.data]);

  return (
    <Stack sx={{ pt: 12 }}>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
        <Grid item xs={4} sm={8} md={9}>
          <ContentPaper title="Listing books">
            {(() => {
              if (nfts.isLoading) {
                return <Typography>Putting books on the shelves...</Typography>;
              } else if (ownedBooks.length === 0 || nfts.error) {
                return (
                  <FallbackNode>
                    <Stack spacing={3}>
                      <Typography>You haven&apos;t sell any book.</Typography>
                      <StyledButton
                        onClick={() => {
                          router.push("/account/bookshelf/created-books");
                        }}
                      >
                        My created books
                      </StyledButton>
                    </Stack>
                  </FallbackNode>
                );
              }
              return (
                <BookList bookList={ownedBooks!} onClick={handleBookClick} />
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

export default ListingBooks;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar", "footer", "filter"]))
    }
  };
}
