import { Box, Grid, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";

import { useRandomBooks } from "@/components/hooks/web3";
import { BookSellingCore } from "@/types/nftBook";

import DisplayBookItem from "../BookItem/DisplayBookItem";
import { FallbackNode } from "../FallbackNode";

interface BookListProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

const BookList = ({ xs = 4, sm = 4, md = 3, lg = 4 }: BookListProps) => {
  const { t } = useTranslation("bookDetail");

  const { nfts } = useRandomBooks();
  return (
    <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}>
      {(() => {
        if (nfts.isLoading) {
          return <Typography>{t("loadingMessage") as string}</Typography>;
        } else if (nfts?.data?.length === 0 || nfts.error) {
          return (
            <Box sx={{ width: "100%" }}>
              <FallbackNode />
            </Box>
          );
        }
        return nfts.data?.map((book: BookSellingCore) => (
          <Grid item key={book.tokenId} xs={xs} sm={sm} md={md} lg={lg}>
            <DisplayBookItem tokenId={book?.tokenId} seller={book?.seller} />
          </Grid>
        ));
      })()}
    </Grid>
  );
};

export default BookList;
