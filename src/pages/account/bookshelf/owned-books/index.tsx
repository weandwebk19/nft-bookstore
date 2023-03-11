/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";

import { Typography } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import axios from "axios";

import { useAccount, useOwnedNfts } from "@/components/hooks/web3";
import { BookList } from "@/components/shared/BookList";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FallbackNode } from "@/components/shared/FallbackNode";
import { FilterBar } from "@/components/shared/FilterBar";

const OwnedBooks = () => {
  const { nfts } = useOwnedNfts();
  const [ownedBooks, setOwnedBooks] = useState<any[]>([]);

  const { account } = useAccount();

  useEffect(() => {
    if (nfts.data?.length !== 0) {
      const res = nfts.data?.filter((nft) => nft.author !== account.data);
      if (res) setOwnedBooks(res);
    }
  }, [nfts.data, account.data]);

  return (
    <Stack sx={{ pt: 12 }}>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
        <Grid item xs={4} sm={8} md={9}>
          <ContentPaper title="Owned books">
            {(() => {
              if (nfts.isLoading) {
                return <Typography>Putting books on the shelves...</Typography>;
              } else if (ownedBooks.length === 0 || nfts.error) {
                return (
                  <FallbackNode>
                    <Typography>You haven&apos;t own any book.</Typography>
                  </FallbackNode>
                );
              }
              return (
                <BookList
                  itemsPerRow={12}
                  bookList={ownedBooks!}
                  variant="seller"
                />
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
