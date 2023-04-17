import { Box, Grid, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";

import { ListedBookCore } from "@/types/nftBook";

import BookCardActionable from "./BookCardActionable";

interface BookListActionableProps {
  isOpenForPurchase: boolean;
  isOpenForBorrow: boolean;
  bookListActionable: ListedBookCore[];
}

const BookListActionable = ({
  isOpenForPurchase,
  isOpenForBorrow,
  bookListActionable
}: BookListActionableProps) => {
  const { t } = useTranslation("bookDetail");

  return (
    <Box>
      {isOpenForPurchase && (
        <Typography variant="h5" gutterBottom>
          {t("listings")}
        </Typography>
      )}
      {isOpenForBorrow && (
        <Typography variant="h5" gutterBottom>
          {t("lendings")}
        </Typography>
      )}
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}>
        {bookListActionable?.map((card) => (
          <Grid key={card.seller} item xs={4} sm={8} md={6} lg={12}>
            <BookCardActionable
              seller={(card as any).seller}
              price={(card as any).price}
              isRenting={isOpenForBorrow ? true : false}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookListActionable;
