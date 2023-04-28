import { Button } from "@mui/material";

import axios from "axios";
import { useRouter } from "next/router";

import { StyledButton } from "@/styles/components/Button";

interface EditButtonProps {
  tokenId: string | number;
}

const EditButton = ({ tokenId }: EditButtonProps) => {
  const router = useRouter();

  const handleEditBookClick = (tokenId: number | string) => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
      if (res.data.success === true) {
        const bookId = res.data.data;
        router.push(`/books/${bookId}/edit`);
      }
    })();
  };

  return (
    <Button
      variant="outlined"
      size="small"
      sx={{ width: "100%" }}
      onClick={() => handleEditBookClick(tokenId)}
    >
      Edit
    </Button>
  );
};

export default EditButton;
