import { useEffect, useState } from "react";

import { Button, Tooltip } from "@mui/material";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import { useUserInfo } from "@hooks/api/useUserInfo";
import axios from "axios";

interface AddToWatchlistButtonProps {
  isFirstInButtonGroup?: boolean;
  isLastInButtonGroup?: boolean;
  tokenId: number;
}

const AddToWatchlistButton = ({
  isFirstInButtonGroup = false,
  isLastInButtonGroup = false,
  tokenId
}: AddToWatchlistButtonProps) => {
  const userInfo = useUserInfo();
  const [isWatched, setIsWatched] = useState<boolean>();
  const handleAddToWatchlist = async () => {
    try {
      if (userInfo.data) {
        const userId = userInfo.data.id;
        const bookId = (await axios.get(`/api/books/token/${tokenId}/bookId`))
          .data.data;
        if (bookId) {
          const res = await axios.post("/api/watchlists/create", {
            userId,
            bookId
          });
          if (res.data.success) {
            setIsWatched(true);
          }
          console.log(res);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      if (userInfo.data) {
        const userId = userInfo.data.id;
        const bookId = (await axios.get(`/api/books/token/${tokenId}/bookId`))
          .data.data;
        const res = await axios.delete(
          `/api/watchlists/${userId}/${bookId}/delete`
        );
        if (res.data.success) {
          setIsWatched(false);
        }
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const bookId = (await axios.get(`/api/books/token/${tokenId}/bookId`))
          .data.data;
        if (bookId && userInfo.data) {
          const res = await axios.get(
            `/api/watchlists/${userInfo.data.id}/${bookId}`
          );
          if (res.data.success === true) {
            setIsWatched(true);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [tokenId, userInfo.data]);

  return (
    <Tooltip title="Add to watchlist">
      <Button
        onClick={isWatched ? handleRemoveFromWatchlist : handleAddToWatchlist}
        size="small"
        sx={{
          transition: "all 0.25s ease",
          "&:hover": {
            flexGrow: 3
          },
          ...(isFirstInButtonGroup && {
            borderTopLeftRadius: 0
          }),
          ...(isLastInButtonGroup && {
            borderTopRightRadius: 0
          })
        }}
        // color={isWatched ? "black" : ""}
      >
        <PlaylistAddIcon fontSize="small" />
      </Button>
    </Tooltip>
  );
};

export default AddToWatchlistButton;
