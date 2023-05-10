import { useEffect, useLayoutEffect } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Head from "next/head";
import { useRouter } from "next/router";

import { useBookDetail, useNftBookMeta } from "@/components/hooks/web3";
import { BookInfo } from "@/components/shared/BookInfo";

gsap.registerPlugin(ScrollTrigger);

const BookDetail = () => {
  const router = useRouter();
  const { bookId } = router.query;
  const { nftBookMeta } = useNftBookMeta(bookId as string);
  const title = nftBookMeta.data?.title + " - NFT Bookstore";
  return (
    <>
      <Head>
        <title>{title} </title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BookInfo />
    </>
  );
};

// BookDetail.PageLayout = SplitScreenLayout;

export default BookDetail;
