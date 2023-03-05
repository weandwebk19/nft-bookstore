/* eslint-disable prettier/prettier */
import { Box } from "@mui/material";
import { BookList } from "@/components/shared/BookList";
import { ContentPaper } from "@/components/shared/ContentPaper";
import { NftBook } from "@/types/nftBook";
import { useOwnedNfts } from "@/components/hooks/web3";
// import { BookGenres, NftBookAttribute, NftBookDetails } from "@/types/nftBook";

const OwnedBooks = () => {
  const {nfts} = useOwnedNfts();

  // const bookList: NftBook[] = [];
  // const bookList = [
  //   {
  //     tokenId: "0",
  //     price: 0.5,
  //     author: "Markus Zusak",
  //     isListed: true,
  //     meta: {
  //       title: "To Kill A Mockingbird",
  //       file: "epub",
  //       bookCover: images.mockupBookCover,
  //       attributes: [
  //         {
  //           value: 1.161,
  //           statType: "views"
  //         },
  //         {
  //           value: 918,
  //           statType: "registered"
  //         },
  //         { value: 4.5, statType: "stars" }
  //       ] as NftBookAttribute[]
  //     },
  //     details: {
  //       contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
  //       desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

  //       bookId: "645146126",
  //       pages: 205,
  //       language: ["English", "Vietnamese"],
  //       genres: [
  //         BookGenres[BookGenres["Action & Adventure"]],
  //         BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
  //         BookGenres[BookGenres["Mystery - Horror"]]
  //       ] as NftBookDetails["genres"],
  //       editionVersion: 1,
  //       maxSupply: 100,
  //       registered: 25,
  //       openDate: new Date("06/15/2023"),
  //       endDate: new Date("07/30/2023")
  //     }
  //   },
  //   {
  //     tokenId: "1",
  //     price: 0.5,
  //     author: "Khaled Hosseini",
  //     isListed: true,
  //     meta: {
  //       title: "The Kite Runner",
  //       file: "epub",
  //       bookCover: images.mockupBookCover,
  //       attributes: [
  //         {
  //           value: 1.161,
  //           statType: "views"
  //         },
  //         {
  //           value: 918,
  //           statType: "registered"
  //         },
  //         { value: 3.8, statType: "stars" }
  //       ] as NftBookAttribute[]
  //     },
  //     details: {
  //       contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
  //       desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

  //       bookId: "6495145222",
  //       pages: 205,
  //       language: ["English", "Vietnamese"],
  //       genres: [
  //         BookGenres[BookGenres["Action & Adventure"]],
  //         BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
  //         BookGenres[BookGenres["Mystery - Horror"]]
  //       ] as NftBookDetails["genres"],
  //       editionVersion: 1,
  //       maxSupply: 100,
  //       registered: 25,
  //       openDate: new Date("06/15/2023"),
  //       endDate: new Date("07/30/2023")
  //     }
  //   },
  //   {
  //     tokenId: "2",
  //     price: 0.5,
  //     author: "Markus Zusak",
  //     isListed: true,
  //     meta: {
  //       title: "The Boy in the Striped Pajamas",
  //       file: "epub",
  //       bookCover: images.mockupBookCover,
  //       attributes: [
  //         {
  //           value: 1.161,
  //           statType: "views"
  //         },
  //         {
  //           value: 918,
  //           statType: "registered"
  //         },
  //         { value: 4.5, statType: "stars" }
  //       ] as NftBookAttribute[]
  //     },
  //     details: {
  //       contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
  //       desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

  //       bookId: "645669asa6",
  //       pages: 205,
  //       language: ["English", "Vietnamese"],
  //       genres: [
  //         BookGenres[BookGenres["Action & Adventure"]],
  //         BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
  //         BookGenres[BookGenres["Mystery - Horror"]]
  //       ] as NftBookDetails["genres"],
  //       editionVersion: 1,
  //       maxSupply: 100,
  //       registered: 25,
  //       openDate: new Date("06/15/2023"),
  //       endDate: new Date("07/30/2023")
  //     }
  //   },
  //   {
  //     tokenId: "3",
  //     price: 0.5,
  //     author: "Louis Lowry",
  //     isListed: true,
  //     meta: {
  //       title: "The Giver",
  //       file: "epub",
  //       bookCover: images.mockupBookCover3,
  //       attributes: [
  //         {
  //           value: 1.161,
  //           statType: "views"
  //         },
  //         {
  //           value: 918,
  //           statType: "registered"
  //         },
  //         { value: 4.5, statType: "stars" }
  //       ] as NftBookAttribute[]
  //     },
  //     details: {
  //       contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
  //       desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

  //       bookId: "645dsfd126",
  //       pages: 205,
  //       language: ["English", "Vietnamese"],
  //       genres: [
  //         BookGenres[BookGenres["Action & Adventure"]],
  //         BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
  //         BookGenres[BookGenres["Mystery - Horror"]]
  //       ] as NftBookDetails["genres"],
  //       editionVersion: 1,
  //       maxSupply: 100,
  //       registered: 25,
  //       openDate: new Date("06/15/2023"),
  //       endDate: new Date("07/30/2023")
  //     }
  //   },
  //   {
  //     tokenId: "4",
  //     price: 0.8,
  //     author: "Harper Lee",
  //     isListed: true,
  //     meta: {
  //       title: "Life of Pi",
  //       file: "pdf",
  //       bookCover: images.mockupBookCover2,
  //       attributes: [
  //         {
  //           value: 1.161,
  //           statType: "views"
  //         },
  //         {
  //           value: 918,
  //           statType: "registered"
  //         },
  //         { value: 4.6, statType: "stars" }
  //       ] as NftBookAttribute[]
  //     },
  //     details: {
  //       contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
  //       desc: "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

  //       bookId: "645146129",
  //       pages: 205,
  //       language: ["English", "Vietnamese"],
  //       genres: [
  //         BookGenres[BookGenres["Action & Adventure"]],
  //         BookGenres[BookGenres["Agriculture - Forestry - Fisheries"]],
  //         BookGenres[BookGenres["Mystery - Horror"]]
  //       ] as NftBookDetails["genres"],
  //       editionVersion: 1,
  //       maxSupply: 100,
  //       registered: 25,
  //       openDate: new Date("06/15/2023"),
  //       endDate: new Date("07/30/2023")
  //     }
  //   }
  // ];

  const handleBookClick = () => {
    alert("Not implemented yet");
  };

  return (
    <Box sx={{ pt: 12 }}>
      <ContentPaper title="Owned books">
        <BookList bookList={nfts.data!} onClick={handleBookClick} />
      </ContentPaper>
    </Box>
  );
};

export default OwnedBooks;
