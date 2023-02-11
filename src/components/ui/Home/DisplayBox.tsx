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

import images from "@/assets/images";
import { BookGenres } from "@/types/bookItem";

config.autoAddCss = false;

const DisplayBox = () => {
  const topBook = {
    bookCover: images.mockupBookCover2,
    title: "The Book Thief",
    author: "Markus Zusak",
    type: "epub",
    statistics: [
      {
        value: 1.161,
        content: "views"
      },
      {
        value: 918,
        content: "registered"
      }
    ],
    desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",
    genres: [
      BookGenres[BookGenres["Action & Adventure"]],
      BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
      BookGenres[BookGenres["Mystery - Horror"]]
    ],
    countdown: "7D 04:30:08",
    isOpen: true
  };

  const bookList = [
    {
      id: 1,
      title: "The Kite Runner",
      bookCover: images.mockupBookCover,
      type: "PDF",
      star: 4.5,
      author: "Khaled Hosseini",
      onClick: () => {
        alert("The Kite Runner");
      }
    },
    {
      id: 2,
      title: "The Kite Runner",
      bookCover: images.mockupBookCover,
      type: "PDF",
      star: 4.5,
      author: "Khaled Hosseini",
      onClick: () => {
        alert("The Kite Runner");
      }
    },
    {
      id: 3,
      title: "The Kite Runner",
      bookCover: images.mockupBookCover,
      type: "PDF",
      star: 4.5,
      author: "Khaled Hosseini",
      onClick: () => {
        alert("The Kite Runner");
      }
    },
    {
      id: 4,
      title: "The Kite Runner",
      bookCover: images.mockupBookCover,
      type: "PDF",
      star: 4.5,
      author: "Khaled Hosseini",
      onClick: () => {
        alert("The Kite Runner");
      }
    },
    {
      id: 5,
      title: "The Kite Runner",
      bookCover: images.mockupBookCover,
      type: "PDF",
      star: 4.5,
      author: "Khaled Hosseini",
      onClick: () => {
        alert("The Kite Runner");
      }
    }
  ];

  return (
    <Box>
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sm={8} md={9}>
          <Stack spacing={3}>
            {/* Book Banner */}
            <BookBanner
              bookCover={topBook.bookCover}
              title={topBook.title}
              author={topBook.author}
              type={topBook.type}
              statistics={topBook.statistics}
              desc={topBook.desc}
              genres={topBook.genres}
              countdown={topBook.countdown}
              isOpen={topBook.isOpen}
              onClick={() => {
                alert(topBook.title);
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
              <Grid container spacing={3}>
                {bookList.map((book) => (
                  <Grid item key={book.id}>
                    <BookItem
                      title={book.title}
                      bookCover={book.bookCover}
                      type={book.type}
                      star={book.star}
                      author={book.author}
                      onClick={book.onClick}
                    />
                  </Grid>
                ))}
              </Grid>
            </ContentPaper>

            <ContentPaper
              isPaginate={true}
              title={
                <>
                  <i>Highly</i> recommended
                </>
              }
            >
              <Grid container spacing={3}>
                {bookList.map((book) => (
                  <Grid item key={book.id}>
                    <BookItem
                      title={book.title}
                      bookCover={book.bookCover}
                      type={book.type}
                      star={book.star}
                      author={book.author}
                      onClick={book.onClick}
                    />
                  </Grid>
                ))}
              </Grid>
            </ContentPaper>
          </Stack>
        </Grid>
        <Grid item xs={4} sm={8} md={3}>
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
