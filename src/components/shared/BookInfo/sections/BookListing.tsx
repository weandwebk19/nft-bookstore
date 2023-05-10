import { useEffect, useState } from "react";

import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import StarIcon from "@mui/icons-material/Star";

import axios from "axios";
import { t } from "i18next";
import { useRouter } from "next/router";

import { useRealOwnerOfTokens } from "@/components/hooks/web3";
import { bookComments, comments } from "@/mocks";
import { StyledButton } from "@/styles/components/Button";
import { StyledLinearProgress } from "@/styles/components/LinearProgress";
import { ReviewInfo } from "@/types/reviews";

import { Comment, NestedComment } from "../../Comment";
import { FallbackNode } from "../../FallbackNode";
import { StaticRating } from "../../Rating";
import BookListActionable from "./BookListActionable";

const BookListing = () => {
  const theme = useTheme();
  const router = useRouter();
  const { bookId } = router.query;

  const isOpenForBorrow = false;

  const { ownerTokens } = useRealOwnerOfTokens(bookId as string);

  return (
    <Box
      sx={{
        p: 3,
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        borderRight: `1px solid ${theme.palette.primary.main}`,
        borderLeft: {
          xs: `1px solid ${theme.palette.primary.main}`,
          sm: 0
        }
      }}
    >
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
