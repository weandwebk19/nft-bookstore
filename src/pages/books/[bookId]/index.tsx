import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// import { BookInfo } from "@/components/shared/BookInfo";
import BookDetail from "@/components/ui/books/BookDetail";

export default BookDetail;

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "navbar",
        "footer",
        "bookDetail"
      ]))
    }
  };
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true
  };
};
