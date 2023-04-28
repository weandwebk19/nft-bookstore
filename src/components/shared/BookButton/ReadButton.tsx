import { Button } from "@mui/material";

import axios from "axios";
import { useRouter } from "next/router";

import { StyledButton } from "@/styles/components/Button";

interface ReadButtonProps {
  bookFile: string | number;
}

const ReadButton = ({ bookFile }: ReadButtonProps) => {
  const router = useRouter();
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
