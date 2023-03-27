import { Box, Grid, Typography } from "@mui/material";

import BookCardActionable from "./BookCardActionable";

interface BookListActionableProps {
  isOpenForTradeIn: boolean;
  isOpenForBorrow: boolean;
  bookListActionable: any[];
}

const BookListActionable = ({
  isOpenForTradeIn,
  isOpenForBorrow,
  bookListActionable
}: BookListActionableProps) => {
  return (
    <Box>
      {isOpenForTradeIn && (
        <Typography variant="h5" gutterBottom>
          Listings
        </Typography>
      )}
      {isOpenForBorrow && (
        <Typography variant="h5" gutterBottom>
          Rentings
        </Typography>
      )}
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}>
        {bookListActionable?.map((card) => (
          <Grid key={card.id} item xs={4} sm={8} md={6} lg={12}>
            <BookCardActionable
              user={(card as any).owner}
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
