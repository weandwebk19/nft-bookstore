export type WatchlistStatus =
  | "All"
  | "Just published"
  | "Waiting for open"
  | "Leasings"
  | "Listings"
  | "Frozen";

export type WatchlistRowData = {
  tokenId: number;
  bookCover: string;
  title: string;
  author: string;
  status?: WatchlistStatus;
  action?: JSX.Element; // Delete button or Edit button, you name it
};
