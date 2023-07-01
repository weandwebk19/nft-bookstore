import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { t } from "i18next";
import { useRouter } from "next/router";

import { useRealOwnerOfTokens } from "@/components/hooks/web3";

import { FallbackNode } from "../../FallbackNode";
import BookListActionable from "./BookListActionable";

const BookListing = () => {
  const theme = useTheme();
  const router = useRouter();
  const { bookId } = router.query;

  const isOpenForBorrow = false;

  const { ownerTokens } = useRealOwnerOfTokens(bookId as string);

  return (
    <Box>
      {(() => {
        if (ownerTokens.isLoading) {
          return <Typography>{t("loadingMessage") as string}</Typography>;
        } else if (ownerTokens?.data?.length === 0 || ownerTokens.error) {
          return <FallbackNode />;
        }
        return (
          <BookListActionable
            isOpenForPurchase={true}
            // isOpenForTradeIn={isOpenForTradeIn}
            isOpenForBorrow={isOpenForBorrow}
            bookListActionable={ownerTokens.data}
          />
        );
      })()}
    </Box>
  );
};

export default BookListing;
