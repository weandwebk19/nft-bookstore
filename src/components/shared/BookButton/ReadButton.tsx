import axios from "axios";
import { useRouter } from "next/router";

import { StyledButton } from "@/styles/components/Button";

interface ReadButtonProps {
  tokenId: string | number;
}

const ReadButton = ({ tokenId }: ReadButtonProps) => {
  const router = useRouter();

  const handleReadBookClick = (tokenId: number | string) => {
    // (async () => {
    //   const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
    //   console.log("res", res);
    //   if (res.data.success === true) {
    //     const bookId = res.data.data;
    //     router.push(`/books/${bookId}/read`);
    //   }
    // })();
  };

  return (
    <StyledButton
      customVariant="secondary"
      onClick={() => handleReadBookClick(tokenId)}
    >
      Read
    </StyledButton>
  );
};

export default ReadButton;
