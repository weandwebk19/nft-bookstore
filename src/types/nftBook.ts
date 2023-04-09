import { ObjectId } from "mongodb";

export type PricingHistory = {
  highest: number;
  lowest: number;
  lastest: number;
  average: number;
};

export type TransferHistory = {
  event: string;
  price: number;
  from: string;
  to: string;
  date: Date;
};

export type Ratings = {
  star1: number;
  star2: number;
  star3: number;
  star4: number;
  star5: number;
  average: number;
  total: number;
};

export type NftBookStats = "views" | "stars" | "registered" | "owners";

export type NftBookAttribute = {
  statType: NftBookStats;
  value: number;
};

export type BookInfo = {
  tokenId: number;
  contractAddress?: string;
  description: string;
  languages: string[];
  genres: string[];
  externalLink?: string;
  totalPages?: number;
  keywords?: string;
  publishingTime?: Date;
};

export type NftBookDetails = {
  bookId: string;
  nftCore: NftBookCore; // Data from smartcontract
  listedCore?: ListedBookCore; // Data from smartcontract
  meta: NftBookMeta; // Data from metadata
  info: BookInfo; // Data from database
};

export type NftBookMeta = {
  title: string;
  bookFile: string;
  bookCover: string;
  bookSample: string;
  fileType: string;
  version: string;
  author: string;
  quantity: number;
  createdAt: string;
};

export type NftBookCore = {
  tokenId: number;
  author: string;
  quantity: number;
};

export type NftBook = {
  meta: NftBookMeta;
} & NftBookCore;

export type ListedBookCore = {
  tokenId: number;
  seller: string;
  price: number;
  amount: number;
};

export type LeaseBookCore = {
  tokenId: number;
  renter: string;
  price: number;
  amount: number;
};

export type BorrowedBookCore = {
  tokenId: number;
  renter: string;
  borrower: string;
  price: number;
  amount: number;
  startTime: number;
  endTime: number;
};

export type BookSharingCore = {
  tokenId: number;
  fromRenter: string;
  sharer: string;
  sharedPer: string;
  priceOfBB: number;
  price: number; // price / books
  amount: number;
  startTime: number;
  endTime: number;
};

export type ListedBook = {
  meta: NftBookMeta;
} & ListedBookCore;

export type LeaseBook = {
  meta: NftBookMeta;
} & LeaseBookCore;

export type BorrowedBook = {
  meta: NftBookMeta;
} & BorrowedBookCore;

export type BookSharing = {
  meta: NftBookMeta;
} & BookSharingCore;

export type NftListedBook = {
  meta: NftBookMeta;
} & ListedBookCore &
  NftBookCore;

export type PinataRes = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
};

export type FileReq = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
};

export enum BookGenres {
  "Art & photography",
  "Architecture",
  "Art book",
  "Graphic Design",
  "Religion, Culture",
  "Photography",
  "Decorative Arts & Design",
  "Drawing & Painting",
  "Fashion",
  "Sculpture",
  "Music",
  "Performing Arts",
  "Collections, Catalogs & Exhibitions",
  "Biographies & Memoirs",
  "Business Leaders",
  "Celebrities & Famous People",
  "Historical, Political & Military",
  "Art & Literature",
  "True Crime",
  "Sports & Outdoor",
  "Business & Economics",
  "Finance & Economics",
  "Investment & Entrepreneurship",
  "Job - Career",
  "Management - Leadership",
  "Marketing - Sales",
  "Processes & Infrastructure",
  "Skills",
  "Guide / How-to & Self-help",
  "Communication & Social Skills",
  "Creativity",
  "Emotions",
  "Motivational",
  "Personal Improvement",
  "Relationship",
  "Stress Management",
  "Children’s Books",
  "Coloring",
  "Early Learning",
  "Activity",
  "Dictionary",
  "Education - Teaching",
  "ELTs",
  "Primary School",
  "High School",
  "College",
  "Postgraduate",
  "Fantasy",
  "Science Fiction",
  "Literature",
  "Action & Adventure",
  "Classic",
  "Contemporary",
  "Dramas & Plays",
  "Historical Fiction",
  "Humor & Satire",
  "Literary",
  "Mystery, Thriller & Suspense",
  "Mythology & Folk Tales",
  "Romance",
  "Short Stories & Anthologies",
  "Poetry",
  "History & Criticism",
  "Comics & Graphic Novels",
  "Women’s Fiction",
  "Science Fiction & Fantasy",
  "Magazines - Catalogue",
  "Medical Books",
  "Parenting & Relationships",
  "Reference",
  "Crafts & Hobbies",
  "Health, Fitness & Sports",
  "Home Living",
  "Psychology",
  "Professions",
  "Atlases - Encyclopedia",
  "Science - Technology",
  "Astronomy & Space Science",
  "Environment",
  "Agriculture & Forestry",
  "Mathematics",
  "Nature & Ecology",
  "Human & Biology Science",
  "Internet - Computer",
  "History & Social Sciences",
  "Philosophy",
  "Politics & Current Affairs",
  "Sociology",
  "History",
  "Travel & Holiday",
  "Cookbook, Food & Wine",
  "Diets",
  "Beverages",
  "Ingredients, Methods & Appliances",
  "Baking - Desserts",
  "Comic, Manga, Light Novel",
  "Mystery - Horror",
  "Agriculture - Forestry - Fisheries",
  "Gardening",
  "Agriculture",
  "Forestry",
  "Fisheries",
  "Foreign Books",
  "Religion - Spirituality",
  "Blockchain"
}
