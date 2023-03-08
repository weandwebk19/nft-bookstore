import images from "@/assets/images";
import {
  BookGenres,
  NftBook,
  NftBookAttribute,
  NftBookDetail
} from "@/types/nftBook";

export const book = {
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

export const bookList: NftBook[] = [
  {
    tokenId: "0",
    price: 0.5,
    author: "Markus Zusak",
    isListed: true,
    meta: {
      title: "To Kill A Mockingbird",
      bookFile: "epub",
      bookCover: images.mockupBookCover,
      bookSample: "",
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

export const book2 = {
  core: {
    tokenId: "t0k3n1D",
    author: "Markus Zusak",
    balance: 1.95,
    seller: "0x94fwe5f56ef3rv1t6vf6f5bh1bg8try6n465",
    amount: 100,
    price: 0.5
  },
  meta: {
    title: "The Book Thief",
    bookFile:
      "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub",
    bookCover: images.mockupBookCover2,
    bookSample: "",
    fileType: "epub"
  },
  info: {
    book_id: "80Ok1D",
    contract_address: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
    description:
      "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",

    bookId: "645146126",
    pages: 205,
    languages: ["64053f020ad15f006f1abc8c", "64053f020ad15f006f1abc8d"],
    genres: [
      "64020e40ea7cdb41da9417b7",
      "64020e40ea7cdb41da9417b8",
      "64020e40ea7cdb41da9417b9"
    ],
    version: 1,
    max_supply: 100,
    external_link: "https://github.com/",
    total_pages: 256,
    keywords: "",
    publishing_time: new Date()
  }
};

export const bookList2 = [book2, book2, book2];
