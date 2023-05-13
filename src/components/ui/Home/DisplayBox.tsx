import { Box, Grid, Paper, Stack } from "@mui/material";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
  faFacebook,
  faInstagram,
  faLinkedinIn,
  faTelegram,
  faTwitter
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BookBanner } from "@shared/BookBanner";
import { ContentPaper } from "@shared/ContentPaper";
import { useRouter } from "next/router";

import { usePublishingBooks } from "@/components/hooks/web3";
import { BookList } from "@/components/shared/BookList";
import { FilterField } from "@/types/filter";

config.autoAddCss = false;

const DisplayBox = () => {
  const router = useRouter();
  const query = router.query;
  const { listedBooks } = usePublishingBooks(query as FilterField);

  const handleBookClick = (tokenId: number | string) => {
    router.push(`/books/${tokenId}`);
  };

  // should be replaced with the newest book that has been published
  const firstBook = listedBooks?.data?.[0];

  return (
    <Box>
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}>
        <Grid item xs={4} sm={8} md={12} lg={18}>
          <Stack spacing={3}>
            {/* Book Banner */}
            {firstBook && (
              <BookBanner
                tokenId={firstBook?.tokenId}
                author={firstBook?.seller}
                //  description={firstBook?.info.description}
                //  price={firstBook?.price}
                //  genres={}
                //  languages={}
                onClick={() => {
                  alert(firstBook.meta.title);
                }}
              />
            )}

            {/* <ContentPaper
              isPaginate={true}
              title={
                <>
                  Reader <i>also</i> enjoy
                </>
              }
            >
              <BookList bookList={bookList} onClick={handleBookClick} />
            </ContentPaper>

            <ContentPaper
              isPaginate={true}
              title={
                <>
                  <i>Highly</i> recommended
                </>
              }
            >
              <BookList bookList={bookList} onClick={handleBookClick} />
            </ContentPaper> */}
          </Stack>
        </Grid>
        <Grid item xs={4} sm={8} md={12} lg={6}>
          <Stack spacing={3}>
            <ContentPaper title="Community">
              <Stack direction="row" spacing={2}>
                <FontAwesomeIcon icon={faFacebook} />
                <FontAwesomeIcon icon={faTwitter} />
                <FontAwesomeIcon icon={faLinkedinIn} />
                <FontAwesomeIcon icon={faInstagram} />
                <FontAwesomeIcon icon={faTelegram} />
              </Stack>
            </ContentPaper>
            <Paper sx={{ height: "30vh" }} />
            <Paper sx={{ height: "110vh" }} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisplayBox;
