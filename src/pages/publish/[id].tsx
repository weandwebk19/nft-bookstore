import { Box, Grid, Stack, Typography } from "@mui/material";

import { BookDetails } from "@/components/shared/BookDetails";
import Gallery from "@/components/ui/publish/Gallery";
import { SplitScreenLayout } from "@/layouts/SplitScreenLayout";

const BookDetail = () => {
  return (
    <>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={4} sm={4} md={6}>
          <Box
            sx={{ width: "100%", height: "100vh", backgroundColor: "wheat" }}
          >
            {/* <Gallery /> */}
          </Box>
        </Grid>
        <Grid item xs={4} sm={4} md={6}>
          <Stack pt={8}>
            <BookDetails />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

BookDetail.PageLayout = SplitScreenLayout;

export default BookDetail;
