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
      console.log("res", res);
      if (res.data.success === true) {
        const bookId = res.data.data;
        router.push(`/books/${bookId}/edit`);
      }
    })();
  };

  return (
    <StyledButton
      customVariant="secondary"
      onClick={() => handleEditBookClick(tokenId)}
    >
      Edit
    </StyledButton>
  );
};

export default EditButton;
