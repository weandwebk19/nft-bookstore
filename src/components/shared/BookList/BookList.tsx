import { Grid } from "@mui/material";

import { BookItem } from "../BookItem";

interface BookListProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  variant?: string;
  bookList: any[];
  onClick: (tokenId: string) => void;
}

const BookList = ({
  xs = 4,
  sm = 4,
  md = 3,
  lg = 4,
  bookList,
  onClick
}: BookListProps) => {
  return (
    <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}>
      {bookList?.map((book) => (
        <Grid item key={book.tokenId} xs={xs} sm={sm} md={md} lg={lg}>
          <BookItem
            tokenId={book?.tokenId}
            bookCover={book?.meta.data?.bookCover || book?.meta.bookCover}
            bookTitle={book?.meta.data?.title || book?.meta.title}
            fileType={book?.meta.data?.fileType || book?.meta.fileType}
            author={book?.meta.data?.author || book?.seller}
            onClick={onClick}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default BookList;
