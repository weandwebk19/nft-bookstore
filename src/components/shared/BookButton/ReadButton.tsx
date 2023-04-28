import { Button } from "@mui/material";

import axios from "axios";
import { useRouter } from "next/router";

import { useMetadata } from "@/components/hooks/api/useMetadata";
import { StyledButton } from "@/styles/components/Button";

interface ReadButtonProps {
  tokenId: number;
}

const ReadButton = ({ tokenId }: ReadButtonProps) => {
  const router = useRouter();
  const metadata = useMetadata(tokenId);
  const bookFile = metadata.data?.bookFile;
  const urlFile = bookFile ? (bookFile as string) : "/#";

  const handleReadBookClick = () => {
    router.push(urlFile, "_blank");
  };

  return (
    <Button
      size="small"
      variant="contained"
      sx={{ width: "100%" }}
      onClick={(e) => handleReadBookClick()}
    >
      Read
    </Button>
  );
};

export default ReadButton;
