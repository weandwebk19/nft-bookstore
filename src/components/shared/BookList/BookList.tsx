import { Grid } from "@mui/material";

import { NftBook } from "@/types/nftBook";

import { BookItem } from "../BookItem";

interface BookListProps {
  bookList: NftBook[];
  onClick: (tokenId: number | string) => void;
}

const BookList = ({ bookList, onClick }: BookListProps) => {
  return (
    <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}>
      {bookList.map((book) => (
        <Grid item key={book.tokenId} xs={4} sm={4} md={3} lg={4}>
          <BookItem
            tokenId={book.tokenId}
            price={book.price}
            isListed={book.isListed}
            meta={book.meta}
            author={book.author}
            onClick={() => {
              onClick(book.tokenId);
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default BookList;
