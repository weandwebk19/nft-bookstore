import { useEffect, useLayoutEffect, useRef } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

import { useBookDetail } from "@/components/hooks/web3";
import { BookInfo } from "@/components/shared/BookInfo";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

gsap.registerPlugin(ScrollTrigger);

const BookDetail = () => {
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
    return <BookInfo bookDetail={bookDetail.data} />;
  }
};

// BookDetail.PageLayout = SplitScreenLayout;

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
