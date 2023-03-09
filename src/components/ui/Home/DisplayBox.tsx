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
import { BookItem } from "@shared/BookItem";
import { ContentPaper } from "@shared/ContentPaper";
import { useRouter } from "next/router";

import images from "@/assets/images";
import { BookList } from "@/components/shared/BookList";
import { book, bookList } from "@/mocks";
import { BookGenres, NftBookAttribute, NftBookDetails } from "@/types/nftBook";

config.autoAddCss = false;

const DisplayBox = () => {
  const router = useRouter();

  const handleBookClick = (tokenId: number | string) => {
    router.push(`/books/${tokenId}`);
  };

  return (
    <Box>
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}>
        <Grid item xs={4} sm={8} md={12} lg={18}>
          <Stack spacing={3}>
            {/* Book Banner */}
            <BookBanner
              meta={book.meta}
              details={book.details}
              tokenId={book.tokenId}
              author={book.author}
              price={book.price}
              onClick={() => {
                alert(book.meta.title);
              }}
            />

            <ContentPaper
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
            </ContentPaper>
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
