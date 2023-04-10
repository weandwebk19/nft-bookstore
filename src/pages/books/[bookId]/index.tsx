import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// import { BookInfo } from "@/components/shared/BookInfo";
import BookDetail from "@/components/ui/books/BookDetail";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

export default BookDetail;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...namespaceDefaultLanguage(),
        "bookDetail"
      ]))
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
