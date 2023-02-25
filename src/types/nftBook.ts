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

export type NftBookDetails = {
  contractAddress: string;
  desc: string;
  bookId: string;
  pages: number;
  language: string[];
  genres: (keyof typeof BookGenres)[];
  editionVersion: number;
  maxSupply: number;
  registered: number;
  openDate: Date;
  endDate: Date;
};

export type NftBookMeta = {
  title: string;
  file: string;
  bookCover: string;
  attributes: NftBookAttribute[];
};

export type NftBookCore = {
  tokenId: number | string;
  price: number;
  author: string;
  isListed: boolean;
};

export type NftBook = {
  meta: NftBookMeta;
  details?: NftBookDetails;
} & NftBookCore;

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
