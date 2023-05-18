import images from "@/assets/images";
import {
  BookGenres,
  BookSelling,
  NftBook,
  NftBookAttribute,
  NftBookDetail
} from "@/types/nftBook";
import { ReviewRowData } from "@/types/reviews";

export const book = {
  tokenId: "0",
  price: 0.5,
  author: "Markus Zusak",
  isListing: true,
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
    ],
    editionVersion: 1,
    maxSupply: 100,
    registered: 25,
    openDate: new Date("06/15/2023"),
    endDate: new Date("07/30/2023")
  }
};

export const bookComments = [
  {
    id: 1,
    avatar: "",
    username: "eye_deer",
    date: "6/20/2023",
    rating: 5,
    comment: `I found a lot of this book incredibly tedious. I tend to avoid the winners of the Man / Booker – they make me a little depressed. The only Carey I haven’t liked won the Booker (Oscar and Lucinda), I really didn’t like the little bit of Vernon God Little I read and I never finished The Sea despite really liking Banville’s writing. So, being told a book is a winner of the Booker tends to be a mark against it from the start, unfortunately.`
  },
  {
    id: 2,
    avatar: "",
    username: "owwwwwl",
    date: "6/20/2023",
    rating: 4,
    comment: `I found a lot of this book incredibly tedious. I tend to avoid the winners of the Man / Booker – they make me a little depressed. The only Carey I haven’t liked won the Booker (Oscar and Lucinda), I really didn’t like the little bit of Vernon God Little I read and I never finished The Sea despite really liking Banville’s writing. So, being told a book is a winner of the Booker tends to be a mark against it from the start, unfortunately.`
  },
  {
    id: 3,
    avatar: "",
    username: "froggy",
    date: "6/20/2023",
    rating: 4,
    comment: `I found a lot of this book incredibly tedious. I tend to avoid the winners of the Man / Booker – they make me a little depressed. The only Carey I haven’t liked won the Booker (Oscar and Lucinda), I really didn’t like the little bit of Vernon God Little I read and I never finished The Sea despite really liking Banville’s writing. So, being told a book is a winner of the Booker tends to be a mark against it from the start, unfortunately.`
  }
];

export const comments = [
  {
    id: 1,
    content: "This is the first comment!",
    author: "John Doe",
    authorAvatar: "JD",
    rating: 5,
    date: "2022-03-01",
    replies: [
      {
        id: 2,
        content: "I totally agree with you!",
        author: "Jane Smith",
        authorAvatar: "JM",
        rating: 4,
        date: "2022-03-02",
        replies: []
      },
      {
        id: 3,
        content: "Thanks for the support!",
        author: "John Doe",
        authorAvatar: "JD",
        rating: 5,
        date: "2022-03-03",
        replies: []
      },
      {
        id: 4,
        content: "I have a different opinion...",
        author: "Bob Johnson",
        authorAvatar: "BJ",
        rating: 5,
        date: "2022-03-04",
        replies: []
      }
    ]
  },
  {
    id: 5,
    content: "This is the second comment!",
    author: "Alice Lee",
    authorAvatar: "AL",
    rating: 3,
    date: "2022-03-05",
    replies: []
  }
];

export const users = [
  {
    _id: "6444db557a806468ac55aa25",
    walletAddress: "0xe7faf0b613c54c9bf3c1a0df9c1af2ce733d166c",
    fullname: "Tô Hoài",
    isAuthor: true
  },
  {
    _id: "6444db557a806468ac55aa26",
    walletAddress: "0xe7faf0b613c54c9bf3c1a0df9c1af2ce733d166d",
    fullname: "Nguyễn Nhật Ánh",
    isAuthor: true
  },
  {
    _id: "6444db557a806468ac55aa27",
    walletAddress: "0xe7faf0b613c54c9bf3c1a0df9c1af2ce733d166e",
    fullname: "Xuân Quỳnh",
    isAuthor: true
  },
  {
    _id: "6444db557a806468ac55aa28",
    walletAddress: "0xe7faf0b613c54c9bf3c1a0df9c1af2ce733d166f",
    fullname: "Hồ Xuân Hương",
    isAuthor: true
  },
  {
    _id: "6444db557a806468ac55aa29",
    walletAddress: "0xe7faf0b613c54c9bf3c1a0df9c1af2ce733d1660",
    fullname: "Nguyễn Ngọc Tư",
    isAuthor: true
  },
  {
    _id: "6444db557a806468ac55aa30",
    walletAddress: "0xe7faf0b613c54c9bf3c1a0df9c1af2ce733d1661",
    fullname: "Kim Lân",
    isAuthor: true
  }
];

export const bookReviews = [
  {
    id: 1,
    buyer: {
      avatar: "",
      username: "eye_deer"
    },
    book: {
      title: "The Book Thief",
      bookCover: images.mockupBookCover2
    },
    review: {
      date: "6/20/2023",
      rating: 5,
      comment: `I found a lot of this book incredibly tedious. I tend to avoid the winners of the Man / Booker – they make me a little depressed. The only Carey I haven’t liked won the Booker (Oscar and Lucinda), I really didn’t like the little bit of Vernon God Little I read and I never finished The Sea despite really liking Banville’s writing. So, being told a book is a winner of the Booker tends to be a mark against it from the start, unfortunately.`
    }
  },
  {
    id: 2,
    buyer: {
      avatar: "",
      username: "owwwwwl"
    },
    book: {
      title: "The Book Thief",
      bookCover: images.mockupBookCover2
    },
    review: {
      date: "6/20/2023",
      rating: 4,
      comment: `I found a lot of this book incredibly tedious. I tend to avoid the winners of the Man / Booker – they make me a little depressed. The only Carey I haven’t liked won the Booker (Oscar and Lucinda), I really didn’t like the little bit of Vernon God Little I read and I never finished The Sea despite really liking Banville’s writing. So, being told a book is a winner of the Booker tends to be a mark against it from the start, unfortunately.`
    }
  },
  {
    id: 3,
    buyer: {
      avatar: "",
      username: "froggy"
    },
    book: {
      title: "The Book Thief",
      bookCover: images.mockupBookCover2
    },
    review: {
      date: "6/20/2023",
      rating: 4,
      comment: `I found a lot of this book incredibly tedious. I tend to avoid the winners of the Man / Booker – they make me a little depressed. The only Carey I haven’t liked won the Booker (Oscar and Lucinda), I really didn’t like the little bit of Vernon God Little I read and I never finished The Sea despite really liking Banville’s writing. So, being told a book is a winner of the Booker tends to be a mark against it from the start, unfortunately.`
    }
  }
];
