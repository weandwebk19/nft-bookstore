/* eslint-disable prettier/prettier */
import { Box } from "@mui/material";
import { Grid, Stack } from "@mui/material";

import { useOwnedNfts } from "@/components/hooks/web3";
import { BookList } from "@/components/shared/BookList";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { FilterBar } from "@/components/shared/FilterBar";

const CreatedBooks = () => {
  const { nfts } = useOwnedNfts();

  const handleBookClick = () => {
    alert("Not implemented yet");
  };

  return (
    <Stack sx={{ pt: 12 }}>
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
        <Grid item xs={4} sm={8} md={9}>
          <ContentPaper title="Owned books">
            <BookList bookList={nfts.data!} onClick={handleBookClick} />
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
