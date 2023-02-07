import Head from "next/head";

import { DefaultLayout } from "@/layouts";
import Hero from "@ui/Home/Hero";

export default function Home() {
  return (
    <>
      <Head>
        <title>NFT Bookstore</title>
        <meta name="description" content="The world's first NFT Bookstore" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Hero />
      </main>
    </>
  );
}

Home.PageLayout = DefaultLayout;
