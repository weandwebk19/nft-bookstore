export type ReviewStatus = "All" | "Replied" | "Not replied";

export type ReviewRowData = {
  id: string;
  avatar: string;
  username: string;
  date: Date | string;
  rating?: number;
  title: string;
  bookCover: string;
  comment?: string;
  reply?: string;
  action?: JSX.Element;
};

export type ReviewInfo = {
  id: string;
  bookId: string;
  userId: string;
  review: string;
  reply?: string;
  rating: number;
  createdAt: Date;
};

export type ReviewColumns = {
  id: string;
  buyer: {
    avatar?: string;
    username: string;
  };
  book: {
    title?: string;
    bookCover?: string;
  };
  review: {
    date: string;
    rating?: number;
    comment?: string;
    reply?: string;
  };
  action?: ReviewRowData;
};
