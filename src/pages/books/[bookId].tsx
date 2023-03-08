import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
import { useRouter } from "next/router";

import images from "@/assets/images";
import { useBookDetail } from "@/components/hooks/web3";
import { BookDetails } from "@/components/shared/BookInfo";
import { BookInfo } from "@/components/shared/BookInfo";
import { BookItem } from "@/components/shared/BookItem";
import { BookRatings } from "@/components/shared/BookRatings";
import { SplitScreenLayout } from "@/layouts/SplitScreenLayout";
import { BookGenres, NftBookAttribute, NftBookDetails } from "@/types/nftBook";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

gsap.registerPlugin(ScrollTrigger);

const BookDetail = () => {
  const [isSelled, setIsSelled] = useState<boolean>(false);
  const bookDetailsRef = useRef(null);
  const tl = useRef<any>();
  const router = useRouter();
  const { bookId } = router.query;
  const { bookDetail } = useBookDetail(bookId as string);
  console.log("bookDetail", bookDetail);

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
    isListed: false,
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

  const handleBookClick = (tokenId: number | string) => {
    alert(tokenId);
  };

  // animation
  // const bookCoverRef = useRef(null);
  // const bookCoverImageRef = useRef(null);
  // const bookDetailRef = useRef(null);

  // useEffect(() => {
  //   gsap.to(bookCoverRef.current, {
  //     scrollTrigger: {
  //       trigger: bookCoverRef?.current,
  //       start: "bottom center",
  //       end: "bottom 100px",
  //       scrub: true,
  //       // markers: true,
  //       id: "scrub"
  //     }
  //   });
  //   gsap.to(bookCoverImageRef.current, {
  //     borderRadius: "1em",
  //     width: "60%",
  //     outline: "5px double white",
  //     outlineOffset: "8px",
  //     // transform: "scale(0.9)",
  //     // height: "240px",

  //     scrollTrigger: {
  //       trigger: bookCoverRef?.current,
  //       start: "bottom center",
  //       end: "bottom 100px",
  //       scrub: true,
  //       // markers: true,
  //       id: "scrub"
  //     }
  //   });
  //   gsap.to(bookDetailRef.current, {
  //     scrollTrigger: {
  //       trigger: bookCoverRef?.current,
  //       start: "bottom center",
  //       end: "bottom 100px"
  //     }
  //   });
  // }, []);

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
              // ref={bookCoverRef}
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
                // ref={bookCoverImageRef}
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
            <Box
            // ref={bookDetailsRef}
            >
              {/* <BookInfo
                meta={bookDetails.meta}
                details={bookDetails.details}
                tokenId={bookDetails.tokenId}
                author={bookDetails.author}
                price={bookDetails.price}
                isListed={bookDetails.isListed}
                isPublished={true}
                isSelled={isSelled}
                setIsSelled={setIsSelled}
                onClick={() => {
                  alert(bookDetails.meta.title);
                }}
              /> */}
              <BookInfo />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

BookDetail.PageLayout = SplitScreenLayout;

export default BookDetail;
