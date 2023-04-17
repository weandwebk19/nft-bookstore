import images from "@/assets/images";
import {
  BookGenres,
  ListedBook,
  NftBook,
  NftBookAttribute,
  NftBookDetail
} from "@/types/nftBook";

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
    isListing: true,
    endRentalDay: 3,
    rentee: "Bà nào đó",
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
    isListing: true,
    endRentalDay: 0,
    rentee: "Ông nào đó",
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
    isListing: true,
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
    isListing: true,
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
    isListing: true,
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

type BookDetailsProps = {
  onClick: () => void;
  isListing?: boolean;
  isPublished?: boolean;
  isSelled?: boolean;
  setIsSelled?: (flag: boolean) => void;
} & ListedBook &
  NftBook;

export const book3: BookDetailsProps = {
  meta: {
    title: "The Book Thief",
    bookFile:
      "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub",
    bookCover: images.mockupBookCover2,
    bookSample: "",
    fileType: "epub",
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
    bookId: "6451461259696",
    nftCore: {
      tokenId: "fd5k9xzi9",
      author: "Markus Zusak",
      balance: 19.95
    },
    listedCore: {
      tokenId: "fd5k9xzi9",
      seller: "0x94fwe5f56ef3rv1t6vf6f5bh885ry6n465",
      amount: 110,
      price: 0.6
    },
    meta: {
      title: "The Book Thief",
      bookFile:
        "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub",
      bookCover: images.mockupBookCover2,
      bookSample: "",
      fileType: "epub",
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
    info: {
      tokenId: "fd5k9xzi9",
      contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
      description:
        "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",
      languages: ["64053f020ad15f006f1abc8c", "64053f020ad15f006f1abc8d"],
      genres: [
        "64020e40ea7cdb41da9417b7",
        "64020e40ea7cdb41da9417b8",
        "64020e40ea7cdb41da9417b9"
      ],
      version: 2,
      maxSupply: 110,
      externalLink: "https://github.com/",
      totalPages: 360,
      keywords: "",
      publishingTime: new Date(),
      openDate: new Date("06/15/2023"),
      endDate: new Date("07/30/2023")
    }
  },
  tokenId: "fd5k9xzi9",
  author: "Markus Zusak",
  balance: 19.95,
  seller: "0x94fwe5f56ef3rv1t6vf6f5bh885ry6n465",
  amount: 120,
  price: 0.6
};

export const book4: BookDetailsProps = {
  meta: {
    title: "The Kite Runner",
    bookFile:
      "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub",
    bookCover: images.mockupBookCover,
    bookSample: "",
    fileType: "epub",
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
    bookId: "859855264",
    nftCore: {
      tokenId: "icvg68jif",
      author: "Khaled Hosseini",
      balance: 7.65
    },
    listedCore: {
      tokenId: "icvg68jif",
      seller: "0x94fwe5f5fdgtrf6f5bh885ry6n465",
      amount: 100,
      price: 0.3
    },
    meta: {
      title: "The Kite Runner",
      bookFile:
        "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub",
      bookCover: images.mockupBookCover,
      bookSample: "",
      fileType: "epub",
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
    info: {
      tokenId: "fd5k9xzi9",
      contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
      description:
        "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",
      languages: ["64053f020ad15f006f1abd38", "64053f020ad15f006f1abcb3"],
      genres: [
        "64020e40ea7cdb41da9417bb",
        "64020e40ea7cdb41da9417bc",
        "64020e40ea7cdb41da9417bd"
      ],
      version: 1,
      maxSupply: 100,
      externalLink: "https://github.com/",
      totalPages: 300,
      keywords: "",
      publishingTime: new Date(),
      openDate: new Date("06/15/2023"),
      endDate: new Date("06/30/2023")
    }
  },
  tokenId: "icvg68jif",
  author: "Khaled Hosseini",
  balance: 7.65,
  seller: "0x94fwe5f5fdgtrf6f5bh885ry6n465",
  amount: 100,
  price: 0.3
};

export const book5: BookDetailsProps = {
  meta: {
    title: "The Boy in the Striped Pajamas",
    bookFile:
      "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub",
    bookCover: images.mockupBookCover,
    bookSample: "",
    fileType: "epub",
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
    bookId: "4342465",
    nftCore: {
      tokenId: "etrgfg54vx",
      author: "Khaled Hosseini",
      balance: 7.65
    },
    listedCore: {
      tokenId: "etrgfg54vx",
      seller: "0x94fwe5f5fdgtrf6f5bh885ry6n465",
      amount: 100,
      price: 0.3
    },
    meta: {
      title: "The Boy in the Striped Pajamas",
      bookFile:
        "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub",
      bookCover: images.mockupBookCover,
      bookSample: "",
      fileType: "epub",
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
    info: {
      tokenId: "fd5k9xzi9",
      contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
      description:
        "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",
      languages: ["64053f020ad15f006f1abd38", "64053f020ad15f006f1abcb3"],
      genres: [
        "64020e40ea7cdb41da9417bb",
        "64020e40ea7cdb41da9417bc",
        "64020e40ea7cdb41da9417bd"
      ],
      version: 1,
      maxSupply: 100,
      externalLink: "https://github.com/",
      totalPages: 256,
      keywords: "",
      publishingTime: new Date(),
      openDate: new Date("06/15/2023"),
      endDate: new Date("06/30/2023")
    }
  },
  tokenId: "etrgfg54vx",
  author: "Khaled Hosseini",
  balance: 14.85,
  seller: "0x94fwe5f5fdgtrf6f5bh885ry6n465",
  amount: 100,
  price: 0.65
};

export const book6: BookDetailsProps = {
  meta: {
    title: "The Giver",
    bookFile:
      "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub",
    bookCover: images.mockupBookCover3,
    bookSample: "",
    fileType: "epub",
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
    bookId: "4342465",
    nftCore: {
      tokenId: "hjdf566f5gfg",
      author: "Louis Lowry",
      balance: 7.65
    },
    listedCore: {
      tokenId: "hjdf566f5gfg",
      seller: "0x94fwe5f5fdgtrf6f5bh885ry6n465",
      amount: 100,
      price: 0.3
    },
    meta: {
      title: "The Giver",
      bookFile:
        "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub",
      bookCover: images.mockupBookCover3,
      bookSample: "",
      fileType: "epub",
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
    info: {
      tokenId: "fd5k9xzi9",
      contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
      description:
        "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",
      languages: ["64053f020ad15f006f1abd38", "64053f020ad15f006f1abcb3"],
      genres: [
        "64020e40ea7cdb41da9417bb",
        "64020e40ea7cdb41da9417bc",
        "64020e40ea7cdb41da9417bd"
      ],
      version: 1,
      maxSupply: 100,
      externalLink: "https://github.com/",
      totalPages: 278,
      keywords: "",
      publishingTime: new Date(),
      openDate: new Date("06/15/2023"),
      endDate: new Date("06/30/2023")
    }
  },
  tokenId: "hjdf566f5gfg",
  author: "Louis Lowry",
  balance: 19.15,
  seller: "0x94fwe5f5fdgtrf6f5bh885ry6n465",
  amount: 100,
  price: 0.65
};

export const book7: BookDetailsProps = {
  meta: {
    title: "Life of Pi",
    bookFile:
      "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub",
    bookCover: images.mockupBookCover3,
    bookSample: "",
    fileType: "pdf",
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
    bookId: "4342465",
    nftCore: {
      tokenId: "569fe56r5e6",
      author: "Louis Lowry",
      balance: 7.65
    },
    listedCore: {
      tokenId: "569fe56r5e6",
      seller: "0x94fwe5f5fdgtrf6f5bh885ry6n465",
      amount: 100,
      price: 0.3
    },
    meta: {
      title: "Life of Pi",
      bookFile:
        "https://altmshfkgudtjr.github.io/react-epub-viewer/files/Alices%20Adventures%20in%20Wonderland.epub",
      bookCover: images.mockupBookCover2,
      bookSample: "",
      fileType: "pdf",
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
    info: {
      tokenId: "569fe56r5e6",
      contractAddress: "0x5dfv5rg6c26dt6vcgg2b6v23hcdv1af5wbkmiunu",
      description:
        "The Book Thief tells the story of Liesel, a little girl who is taken to a new home because her mother can't afford to take care of her. The story is told by Death, who becomes a character you come to respect and even feel sorry for by the end. The narration puts an odd perspective on the story.",
      languages: [
        "64053f020ad15f006f1abcd9",
        "64053f020ad15f006f1abcb3",
        "64053f020ad15f006f1abcba"
      ],
      genres: [
        "64020e40ea7cdb41da9417bf",
        "64020e40ea7cdb41da9417c3",
        "64020e40ea7cdb41da9417c9"
      ],
      version: 1,
      maxSupply: 100,
      externalLink: "https://github.com/",
      totalPages: 278,
      keywords: "",
      publishingTime: new Date(),
      openDate: new Date("06/15/2023"),
      endDate: new Date("06/30/2023")
    }
  },
  tokenId: "569fe56r5e6",
  author: "Harper Lee",
  balance: 11.79,
  seller: "0x94fwe5f5fdgtrf6f5bh885ry6n465",
  amount: 100,
  price: 0.65
};

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

export const bookList2 = [book3, book4, book5, book6, book7];

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
