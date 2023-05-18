import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// import { BookInfo } from "@/components/shared/BookInfo";
import BookDetail from "@/components/ui/books/BookDetail";
import namespaceDefaultLanguage from "@/utils/namespaceDefaultLanguage";

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
