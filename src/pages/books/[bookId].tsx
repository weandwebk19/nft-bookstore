import { useEffect, useLayoutEffect, useRef, useState } from "react";

import {
  Box,
  Divider,
  Grid,
  Link as MUILink,
  Stack,
  Typography
} from "@mui/material";

import axios from "axios";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import images from "@/assets/images";
import { useBookDetail } from "@/components/hooks/web3";
import { BookInfo } from "@/components/shared/BookInfo";
import { SplitScreenLayout } from "@/layouts/SplitScreenLayout";

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

  if (bookDetail.isLoading === false && bookDetail.error) {
    return <div>Book ID not true</div>;
  } else {
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
                backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${bookDetail?.data?.meta?.bookCover})`,
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
                  // ref={bookCoverImageRef}
                  component="img"
                  src={bookDetail?.data?.meta?.bookCover}
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
                {/* <BookDetails
                  bookDetail={bookDetail.data}
                  onClick={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                /> */}
                <BookInfo bookDetail={bookDetail.data} />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    );
  }
};

BookDetail.PageLayout = SplitScreenLayout;

export default BookDetail;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["navbar", "footer"]))
    }
  };
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { bookId: "1" }, locale: "en" },
      { params: { bookId: "2" }, locale: "vi" }
    ],
    fallback: true
  };
};
