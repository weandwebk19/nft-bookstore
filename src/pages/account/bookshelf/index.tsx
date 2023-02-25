import { Box } from "@mui/material";

import { useRouter } from "next/router";

import { StyledButton } from "@/styles/components/Button";

const BookShelf = () => {
  const router = useRouter();

  const handleOwnedBookClick = () => {
    router.push("/account/bookshelf/owned-books");
  };
  return (
    <Box sx={{ pt: 12 }}>
      <StyledButton onClick={handleOwnedBookClick}>Owned Book</StyledButton>
    </Box>
  );
};

export default BookShelf;
