import { Box, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import BookCardActionable from "./BookCardActionable";

interface BookListActionableProps {
  header?: string;
  isOpenForTradeIn?: boolean;
  isOpenForBorrow?: boolean;
}

const BookListActionable = ({ header }: BookListActionableProps) => {
  const theme = useTheme();
  return (
    <Box>
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}>
        {[1, 2, 3, 4, 5].map((x) => (
          <Grid key={x} item xs={4} sm={8} md={6} lg={12}>
            <BookCardActionable user="Tho Le" />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookListActionable;
