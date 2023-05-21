import { useEffect, useState } from "react";

import { Button } from "@mui/material";

import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { useMetadata } from "@/components/hooks/web3";

interface ReadButtonProps {
  tokenId: number;
}

const ReadButton = ({ tokenId }: ReadButtonProps) => {
  const { t } = useTranslation("bookButtons");

  const router = useRouter();
  const { metadata } = useMetadata(tokenId);
  const bookFile = metadata.data?.bookFile;
  const urlFile = bookFile ? (bookFile as string) : "/#";
  const [bookId, setBookId] = useState();

  const handleReadBookClick = () => {
    if (bookId) {
      router.push(`/books/${bookId}/read`);
    }
  };

  useEffect(() => {
    (async () => {
      // get bookId
      try {
        const bookRes = await axios.get(`/api/books/token/${tokenId}/bookId`);
        if (bookRes.data.success === true) {
          setBookId(bookRes.data.data);
        }
      } catch (err) {}
    })();
  }, [tokenId]);

  return (
    <Button
      size="small"
      variant="contained"
      sx={{ width: "100%" }}
      onClick={(e) => handleReadBookClick()}
    >
      {t("readBtn") as string}
    </Button>
  );
};

export default ReadButton;
