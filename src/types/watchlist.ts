export type WatchlistStatus =
  | "All"
  | "Just published"
  | "Waiting for open"
  | "Leasings"
  | "Listings"
  | "Frozen";

export type WatchlistRowData = {
  id: number;
  bookCover: string;
  title: string;
  price: number;
  status: WatchlistStatus;
  action?: JSX.Element; // Delete button or Edit button, you name it
};
