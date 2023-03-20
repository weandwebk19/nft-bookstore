import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import BookDetail from "@/components/ui/books/BookDetail";

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
