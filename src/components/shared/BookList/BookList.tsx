import { useEffect, useState } from "react";

import { Grid } from "@mui/material";

import { NftBookDetails } from "@/types/nftBook";

import { BookCard } from "../BookCard";
import { BookItem } from "../BookItem";

interface BookListProps {
  itemsPerRow?: number;
  variant?: string;
  bookList: any[];
  onClick: (tokenId: number | string) => void;
}

const BookList = ({
  itemsPerRow = 4,
  variant,
  bookList,
  onClick
}: BookListProps) => {
  return (
    <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12, lg: 24 }}>
      {bookList.map((book) => (
        <Grid item key={book.tokenId} xs={4} sm={4} md={3} lg={itemsPerRow}>
          {variant === "seller" && (
            <BookCard
              tokenId={book?.tokenId}
              bookCover={book?.meta.data.bookCover}
              bookTitle={book?.meta.data.title}
              fileType={book?.meta.data.fileType}
              author={book?.author}
            />
          )}
          {!variant && (
            <BookItem
              tokenId={book?.tokenId}
              bookCover={book?.meta.data?.bookCover || book?.meta.bookCover}
              bookTitle={book?.meta.data?.title || book?.meta.title}
              fileType={book?.meta.data?.fileType || book?.meta.fileType}
              author={book?.meta.data?.author || book?.seller}
              onClick={onClick}
            />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default BookList;
