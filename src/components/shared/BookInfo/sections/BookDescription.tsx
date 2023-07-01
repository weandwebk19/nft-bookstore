import { Typography } from "@mui/material";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { useBookInfo } from "@/components/hooks/api";

import { FallbackNode } from "../../FallbackNode";
import { ReadMore } from "../../ReadMore";

const BookDescription = () => {
  const { t } = useTranslation("bookDetail");

  const router = useRouter();
  const { bookId } = router.query;
  const bookInfo = useBookInfo(bookId as string);

  return (
    <>
      <Typography variant="h5" mb={1}>
        {t("description")}
      </Typography>
      {(() => {
        if (bookInfo.isLoading) {
          return <Typography>{t("loadingMessage") as string}</Typography>;
        } else if (bookInfo?.data?.length === 0 || bookInfo.error) {
          return <FallbackNode />;
        }
        return (
          <ReadMore>
            {/* {bookInfo.data?.description
              ?.split("\n")
              .map((paragraph: any, i: any) => (
                <Typography key={i} gutterBottom>
                  {paragraph}
                </Typography>
              ))} */}
            {bookInfo.data?.description}
          </ReadMore>
        );
      })()}
    </>
  );
};

export default BookDescription;
