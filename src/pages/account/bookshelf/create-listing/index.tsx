/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import { useAccount, useOwnedNfts } from "@/components/hooks/web3";
import { BookList } from "@/components/shared/BookList";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";

const CreateListing = () => {
  const { nfts } = useOwnedNfts();
  const router = useRouter();

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
          <ContentPaper title="Create listing">
            {(() => {
              if (nfts.isLoading) {
                return <Typography>Putting books on the shelves...</Typography>;
              } else if (nfts.data?.length === 0 || nfts.error) {
                return (
                  <FallbackNode>
                    <Typography>You haven&apos;t create any book.</Typography>
                  </FallbackNode>
                );
              }
              return (
                <BookList bookList={nfts.data!} onClick={handleBookClick} />
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

export default CreateListing;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar", "footer"]))
    }
  };
}
