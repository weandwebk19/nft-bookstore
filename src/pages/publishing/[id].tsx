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

import images from "@/assets/images";
import { BookDetails } from "@/components/shared/BookDetails";
import { BookItem } from "@/components/shared/BookItem";
import { BookRatings } from "@/components/shared/BookRatings";
import { BookTicket } from "@/components/shared/BookTicket";
import { SplitScreenLayout } from "@/layouts/SplitScreenLayout";
import { BookGenres, NftBookAttribute, NftBookDetails } from "@/types/nftBook";

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

  const bookDetails = {
    tokenId: "0",
    price: 0.5,
    author: "Markus Zusak",
    isListed: true,
    meta: {
      title: "The Book Thief",
      file: "epub",
      bookCover: images.mockupBookCover2,
      attributes: [
        {
          value: 1.161,
          statType: "views"
        },
        {
          value: 918,
          statType: "registered"
        },
        {
          value: 918,
          statType: "owners"
        }
      ] as NftBookAttribute[]
    },
    details: {
      contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
      desc: `Lorem ipsum dolor sit amet consectetur. Mus maecenas viverra sed consequat ultricies nisl sagittis purus nulla. Feugiat rhoncus a at arcu a habitant et at enim. Elit sed orci ut commodo dignissim vivamus cursus arcu tincidunt. Pellentesque lectus platea ac nisi rhoncus. Interdum id arcu morbi dolor. Lectus cursus erat faucibus sit arcu. Quam at nulla vel amet. Arcu eros sit.
      \nDonec quis lectus in enim lacinia pretium quis. Duis ornare vitae in praesent maecenas tellus pellentesque non. Augue dolor porttitor tristique neque. Tellus sit vel ut sit. Posuere non vitae id ut. Augue pellentesque lectus aenean risus in diam. Sit purus nullam imperdiet elit quis vulputate.
      \nNon donec ac sagittis tellus et pellentesque bibendum vitae. Varius faucibus nulla malesuada ante enim adipiscing. At sit sit tellus tincidunt viverra ultricies tellus. Dolor nibh senectus egestas ac tempus ullamcorper praesent. Aliquet convallis odio et tellus sollicitudin. Nunc fermentum condimentum nunc purus blandit nibh. At porttitor nulla mattis accumsan vitae nisl.`,

      bookId: "645146126",
      pages: 205,
      language: ["English", "Vietnamese"],
      genres: [
        BookGenres[BookGenres["Action & Adventure"]],
        BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
        BookGenres[BookGenres["Mystery - Horror"]]
      ] as NftBookDetails["genres"],
      editionVersion: 1,
      maxSupply: 100,
      registered: 25,
      openDate: new Date("06/15/2023"),
      endDate: new Date("07/30/2023")
    }
  };

  const bookList = [
    {
      tokenId: "0",
      price: 0.5,
      author: "Markus Zusak",
      isListed: true,
      meta: {
        title: "To Kill A Mockingbird",
        file: "epub",
        bookCover: images.mockupBookCover,
        attributes: [
          {
            value: 1.161,
            statType: "views"
          },
          {
            value: 918,
            statType: "registered"
          },
          { value: 4.5, statType: "stars" }
        ] as NftBookAttribute[]
      },
      details: {
        contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
        desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

        bookId: "645146126",
        pages: 205,
        language: ["English", "Vietnamese"],
        genres: [
          BookGenres[BookGenres["Action & Adventure"]],
          BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
          BookGenres[BookGenres["Mystery - Horror"]]
        ] as NftBookDetails["genres"],
        editionVersion: 1,
        maxSupply: 100,
        registered: 25,
        openDate: new Date("06/15/2023"),
        endDate: new Date("07/30/2023")
      }
    },
    {
      tokenId: "1",
      price: 0.5,
      author: "Khaled Hosseini",
      isListed: true,
      meta: {
        title: "The Kite Runner",
        file: "epub",
        bookCover: images.mockupBookCover,
        attributes: [
          {
            value: 1.161,
            statType: "views"
          },
          {
            value: 918,
            statType: "registered"
          },
          { value: 3.8, statType: "stars" }
        ] as NftBookAttribute[]
      },
      details: {
        contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
        desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

        bookId: "6495145222",
        pages: 205,
        language: ["English", "Vietnamese"],
        genres: [
          BookGenres[BookGenres["Action & Adventure"]],
          BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
          BookGenres[BookGenres["Mystery - Horror"]]
        ] as NftBookDetails["genres"],
        editionVersion: 1,
        maxSupply: 100,
        registered: 25,
        openDate: new Date("06/15/2023"),
        endDate: new Date("07/30/2023")
      }
    },
    {
      tokenId: "2",
      price: 0.5,
      author: "Markus Zusak",
      isListed: true,
      meta: {
        title: "The Boy in the Striped Pajamas",
        file: "epub",
        bookCover: images.mockupBookCover,
        attributes: [
          {
            value: 1.161,
            statType: "views"
          },
          {
            value: 918,
            statType: "registered"
          },
          { value: 4.5, statType: "stars" }
        ] as NftBookAttribute[]
      },
      details: {
        contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
        desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

        bookId: "645669asa6",
        pages: 205,
        language: ["English", "Vietnamese"],
        genres: [
          BookGenres[BookGenres["Action & Adventure"]],
          BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
          BookGenres[BookGenres["Mystery - Horror"]]
        ] as NftBookDetails["genres"],
        editionVersion: 1,
        maxSupply: 100,
        registered: 25,
        openDate: new Date("06/15/2023"),
        endDate: new Date("07/30/2023")
      }
    },
    {
      tokenId: "3",
      price: 0.5,
      author: "Louis Lowry",
      isListed: true,
      meta: {
        title: "The Giver",
        file: "epub",
        bookCover: images.mockupBookCover3,
        attributes: [
          {
            value: 1.161,
            statType: "views"
          },
          {
            value: 918,
            statType: "registered"
          },
          { value: 4.5, statType: "stars" }
        ] as NftBookAttribute[]
      },
      details: {
        contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
        desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

        bookId: "645dsfd126",
        pages: 205,
        language: ["English", "Vietnamese"],
        genres: [
          BookGenres[BookGenres["Action & Adventure"]],
          BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
          BookGenres[BookGenres["Mystery - Horror"]]
        ] as NftBookDetails["genres"],
        editionVersion: 1,
        maxSupply: 100,
        registered: 25,
        openDate: new Date("06/15/2023"),
        endDate: new Date("07/30/2023")
      }
    },
    {
      tokenId: "4",
      price: 0.8,
      author: "Harper Lee",
      isListed: true,
      meta: {
        title: "Life of Pi",
        file: "pdf",
        bookCover: images.mockupBookCover2,
        attributes: [
          {
            value: 1.161,
            statType: "views"
          },
          {
            value: 918,
            statType: "registered"
          },
          { value: 4.6, statType: "stars" }
        ] as NftBookAttribute[]
      },
      details: {
        contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
        desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

        bookId: "645146129",
        pages: 205,
        language: ["English", "Vietnamese"],
        genres: [
          BookGenres[BookGenres["Action & Adventure"]],
          BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
          BookGenres[BookGenres["Mystery - Horror"]]
        ] as NftBookDetails["genres"],
        editionVersion: 1,
        maxSupply: 100,
        registered: 25,
        openDate: new Date("06/15/2023"),
        endDate: new Date("07/30/2023")
      }
    }
  ];

  const handleBookClick = (tokenId: number | string) => {
    alert(tokenId);
  };

  // animation
  const bookCoverRef = useRef();
  const bookCoverImageRef = useRef();
  const bookDetailRef = useRef();

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
              backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${bookDetails.meta.bookCover})`,
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
                src={bookDetails.meta.bookCover}
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
                meta={bookDetails.meta}
                details={bookDetails.details}
                tokenId={bookDetails.tokenId}
                author={bookDetails.author}
                price={bookDetails.price}
                isListed={bookDetails.isListed}
                isPublished={false}
                onClick={() => {
                  alert(bookDetails.meta.title);
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
                  owner="Tho Le"
                  price={bookDetails.price}
                  date="6/25/2023"
                  contractAddress={bookDetails.details.contractAddress}
                  link="xf56e4fxre6"
                />
                <BookTicket
                  owner="Tho Le"
                  price={bookDetails.price}
                  date="6/25/2023"
                  contractAddress={bookDetails.details.contractAddress}
                  link="xf56e4fxre6"
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
                      isListed={book.isListed}
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

            <BookRatings bookId={bookDetails.details.bookId} />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

BookDetail.PageLayout = SplitScreenLayout;

export default BookDetail;
