export type SalesReportRowData = {
  id: string | number;
  avatar: string;
  username: string;
  date: Date | string;
  title: string;
  bookCover: string;
  method: string;
  amount: number;
  price: number;
};

export type SalesReportColumns = {
  id: string | number;
  buyer: {
    avatar?: string;
    username: string;
  };
  book: {
    title?: string;
    bookCover?: string;
  };
  method: string;
  amount: number;
  price: number;
  createdAt?: Date;
};
