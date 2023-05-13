import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import { useNftBookMeta } from "@/components/hooks/web3";
import { BookInfo } from "@/components/shared/BookInfo";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

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

export default BookDetail;

export async function getServerSideProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "bookDetail",
        "fallback"
      ]))
    }
  };
}

// export const getStaticPaths = () => {
//   return {
//     paths: [],
//     fallback: true
//   };
// };
