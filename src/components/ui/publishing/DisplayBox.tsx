import { FunctionComponent } from "react";

import { Box, Grid, Stack } from "@mui/material";

import { useListedBooks } from "@hooks/web3";
import { BookBanner } from "@shared/BookBanner";
import { BookItem } from "@shared/BookItem";
import { ContentPaper } from "@shared/ContentPaper";
import { useRouter } from "next/router";

import images from "@/assets/images";
import { BookList } from "@/components/shared/BookList";
import { FilterBar } from "@/components/shared/FilterBar";
import { Wrapper } from "@/components/shared/Wrapper";
import {
  BookGenres,
  NftBook,
  NftBookAttribute,
  NftBookDetails
} from "@/types/nftBook";

const DisplayBox: FunctionComponent = () => {
  const router = useRouter();
  const topBook = {
    tokenId: "0",
    price: 0.5,
    author: "Markus Zusak",
    isListed: true,
    meta: {
      title: "The Book Thief",
      bookFile: "epub",
      bookCover: images.mockupBookCover2,
      attributes: [
        {
          value: 1.161,
          statType: "views"
        },
        {
          value: 918,
          statType: "registered"
        }
      ] as NftBookAttribute[]
    },
    details: {
      contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
      desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

      bookId: "645146126",
      pages: 205,
      language: ["English", "Vietnamese"],
      genres: [
        BookGenres[BookGenres["Action & Adventure"]],
        BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
        BookGenres[BookGenres["Mystery - Horror"]]
      ] as NftBookDetails["genres"],
      editionVersion: 1,
      maxSupply: 100,
      registered: 25,
      openDate: new Date("06/15/2023"),
      endDate: new Date("07/30/2023")
    }
  };

  const bookList: NftBook[] = [
    {
      tokenId: "0",
      price: 0.5,
      author: "Markus Zusak",
      isListed: true,
      meta: {
        title: "To Kill A Mockingbird",
        bookFile: "epub",
        bookCover: images.mockupBookCover,
        attributes: [
          {
            value: 1.161,
            statType: "views"
          },
          {
            value: 918,
            statType: "registered"
          },
          { value: 4.5, statType: "stars" }
        ] as NftBookAttribute[]
      },
      details: {
        contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
        desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

        bookId: "645146126",
        pages: 205,
        language: ["English", "Vietnamese"],
        genres: [
          BookGenres[BookGenres["Action & Adventure"]],
          BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
          BookGenres[BookGenres["Mystery - Horror"]]
        ] as NftBookDetails["genres"],
        editionVersion: 1,
        maxSupply: 100,
        registered: 25,
        openDate: new Date("06/15/2023"),
        endDate: new Date("07/30/2023")
      }
    },
    {
      tokenId: "1",
      price: 0.5,
      author: "Khaled Hosseini",
      isListed: true,
      meta: {
        title: "The Kite Runner",
        bookFile: "epub",
        bookCover: images.mockupBookCover,
        attributes: [
          {
            value: 1.161,
            statType: "views"
          },
          {
            value: 918,
            statType: "registered"
          },
          { value: 3.8, statType: "stars" }
        ] as NftBookAttribute[]
      },
      details: {
        contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
        desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

        bookId: "6495145222",
        pages: 205,
        language: ["English", "Vietnamese"],
        genres: [
          BookGenres[BookGenres["Action & Adventure"]],
          BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
          BookGenres[BookGenres["Mystery - Horror"]]
        ] as NftBookDetails["genres"],
        editionVersion: 1,
        maxSupply: 100,
        registered: 25,
        openDate: new Date("06/15/2023"),
        endDate: new Date("07/30/2023")
      }
    },
    {
      tokenId: "2",
      price: 0.5,
      author: "Markus Zusak",
      isListed: true,
      meta: {
        title: "The Boy in the Striped Pajamas",
        bookFile: "epub",
        bookCover: images.mockupBookCover,
        attributes: [
          {
            value: 1.161,
            statType: "views"
          },
          {
            value: 918,
            statType: "registered"
          },
          { value: 4.5, statType: "stars" }
        ] as NftBookAttribute[]
      },
      details: {
        contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
        desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

        bookId: "645669asa6",
        pages: 205,
        language: ["English", "Vietnamese"],
        genres: [
          BookGenres[BookGenres["Action & Adventure"]],
          BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
          BookGenres[BookGenres["Mystery - Horror"]]
        ] as NftBookDetails["genres"],
        editionVersion: 1,
        maxSupply: 100,
        registered: 25,
        openDate: new Date("06/15/2023"),
        endDate: new Date("07/30/2023")
      }
    },
    {
      tokenId: "3",
      price: 0.5,
      author: "Louis Lowry",
      isListed: true,
      meta: {
        title: "The Giver",
        bookFile: "epub",
        bookCover: images.mockupBookCover3,
        attributes: [
          {
            value: 1.161,
            statType: "views"
          },
          {
            value: 918,
            statType: "registered"
          },
          { value: 4.5, statType: "stars" }
        ] as NftBookAttribute[]
      },
      details: {
        contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
        desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

        bookId: "645dsfd126",
        pages: 205,
        language: ["English", "Vietnamese"],
        genres: [
          BookGenres[BookGenres["Action & Adventure"]],
          BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
          BookGenres[BookGenres["Mystery - Horror"]]
        ] as NftBookDetails["genres"],
        editionVersion: 1,
        maxSupply: 100,
        registered: 25,
        openDate: new Date("06/15/2023"),
        endDate: new Date("07/30/2023")
      }
    },
    {
      tokenId: "4",
      price: 0.8,
      author: "Harper Lee",
      isListed: true,
      meta: {
        title: "Life of Pi",
        bookFile: "pdf",
        bookCover: images.mockupBookCover2,
        attributes: [
          {
            value: 1.161,
            statType: "views"
          },
          {
            value: 918,
            statType: "registered"
          },
          { value: 4.6, statType: "stars" }
        ] as NftBookAttribute[]
      },
      details: {
        contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
        desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

        bookId: "645146129",
        pages: 205,
        language: ["English", "Vietnamese"],
        genres: [
          BookGenres[BookGenres["Action & Adventure"]],
          BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
          BookGenres[BookGenres["Mystery - Horror"]]
        ] as NftBookDetails["genres"],
        editionVersion: 1,
        maxSupply: 100,
        registered: 25,
        openDate: new Date("06/15/2023"),
        endDate: new Date("07/30/2023")
      }
    }
  ];

  const { nftBooks } = useListedBooks();

  const handleBookClick = (tokenId: number | string) => {
    router.push(`/publishing/${tokenId}`);
  };

  return (
    <Box>
      <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={4} sm={5} md={9}>
          <Stack spacing={3}>
            {/* Book Banner */}
            <BookBanner
              meta={topBook.meta}
              details={topBook.details}
              tokenId={topBook.tokenId}
              author={topBook.author}
              price={topBook.price}
              onClick={() => {
                alert(topBook.meta.title);
              }}
              balance={0}
              seller={""}
              amount={0}
            />

            <ContentPaper isPaginate={true} title={<>Publishing books</>}>
              <BookList bookList={bookList} onClick={handleBookClick} />
            </ContentPaper>
          </Stack>
        </Grid>
        <Grid item xs={4} sm={3} md={3}>
          <Stack spacing={3}>
            <ContentPaper title="Filter">
              <FilterBar />
            </ContentPaper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DisplayBox;
