import { useEffect, useLayoutEffect, useRef } from "react";

import {
  Box,
  Divider,
  Grid,
  Link as MUILink,
  Stack,
  Typography
} from "@mui/material";

import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

import { BookDetails } from "@/components/shared/BookInfo";
import { BookItem } from "@/components/shared/BookItem";
import { BookRatings } from "@/components/shared/BookRatings";
import { BookTicket } from "@/components/shared/BookTicket";
import { SplitScreenLayout } from "@/layouts/SplitScreenLayout";
import { book, bookList } from "@/mocks";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

gsap.registerPlugin(ScrollTrigger);

const BookDetail = () => {
  const bookDetailsRef = useRef(null);
  const tl = useRef<any>();

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline().from(bookDetailsRef.current, {
        duration: 1,
        delay: 1,
        opacity: 0,
        y: 100
      });
    });

    return () => {
      ctx.revert(); // animation cleanup!
    };
  }, []);

  const handleBookClick = (tokenId: number | string) => {
    alert(tokenId);
  };

  // animation
  const bookCoverRef = useRef(null);
  const bookCoverImageRef = useRef(null);
  const bookDetailRef = useRef(null);

  useEffect(() => {
    gsap.to(bookCoverRef.current, {
      scrollTrigger: {
        trigger: bookCoverRef?.current,
        start: "bottom center",
        end: "bottom 100px",
        scrub: true,
        // markers: true,
        id: "scrub"
      }
    });
    gsap.to(bookCoverImageRef.current, {
      borderRadius: "1em",
      width: "60%",
      outline: "5px double white",
      outlineOffset: "8px",
      // transform: "scale(0.9)",
      // height: "240px",

      scrollTrigger: {
        trigger: bookCoverRef?.current,
        start: "bottom center",
        end: "bottom 100px",
        scrub: true,
        // markers: true,
        id: "scrub"
      }
    });
    gsap.to(bookDetailRef.current, {
      scrollTrigger: {
        trigger: bookCoverRef?.current,
        start: "bottom center",
        end: "bottom 100px"
      }
    });
  }, []);

  return (
    <Stack>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={4} sm={8} md={5}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${book.meta.bookCover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              pt: 8,
              position: "relative"
            }}
          >
            <Box
              className="noise"
              ref={bookCoverRef}
              sx={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "sticky",
                top: 64,
                overflow: "hidden",
                backdropFilter: "blur(10px)"
              }}
            >
              <Box
                ref={bookCoverImageRef}
                component="img"
                src={book.meta.bookCover}
                sx={{
                  width: "50%",
                  objectFit: "cover"
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4} sm={8} md={7}>
          <Stack pt={8}>
            <Box ref={bookDetailsRef}>
              <BookDetails
                meta={book.meta}
                details={book.details}
                tokenId={book.tokenId}
                author={book.author}
                price={book.price}
                isListed={book.isListed}
                isPublished={false}
                onClick={() => {
                  alert(book.meta.title);
                }}
              />
            </Box>

            <Divider sx={{ my: 6 }} />

            <Stack>
              <Typography variant="h5" mb={1}>
                Listings
              </Typography>

              <Stack direction={{ sm: "column", md: "row" }} spacing={3}>
                <BookTicket
                  header="NFT Bookstore"
                  body={["Tho Le", "6/25/2023", book.details.contractAddress]}
                  href="xf56e4fxre6"
                  footer={`${book.price} ETH`}
                />
              </Stack>
            </Stack>

            <Divider sx={{ my: 6 }} />

            <Stack>
              <Typography variant="h5" mb={1}>
                You may <i>love</i>
              </Typography>
              <Grid container spacing={3}>
                {bookList.map((book) => (
                  <Grid item key={book.tokenId}>
                    <BookItem
                      tokenId={book.tokenId}
                      price={book.price}
                      meta={book.meta}
                      author={book.author}
                      onClick={() => {
                        handleBookClick(book.tokenId);
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>

            <Divider sx={{ my: 6 }} />

            <BookRatings bookId={book.details.bookId} />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

BookDetail.PageLayout = SplitScreenLayout;

export default BookDetail;
