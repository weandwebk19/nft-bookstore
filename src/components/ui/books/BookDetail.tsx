import { useEffect, useLayoutEffect, useRef } from "react";

import axios from "axios";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Head from "next/head";
import { useRouter } from "next/router";

import { useBookDetail } from "@/components/hooks/web3";
import { BookInfo } from "@/components/shared/BookInfo";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

gsap.registerPlugin(ScrollTrigger);

const BookDetail = () => {
  const tl = useRef<any>();
  const router = useRouter();
  const { bookId, seller } = router.query;
  const { bookDetail } = useBookDetail(bookId as string, seller as string);
  // console.log(bookDetail.data);

  return (
    <>
      <Head>
        <title>{`${bookDetail.data?.meta.title} - NFT Bookstore`} </title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BookInfo bookDetail={bookDetail.data} />;
    </>
  );
};

// BookDetail.PageLayout = SplitScreenLayout;

export default BookDetail;
