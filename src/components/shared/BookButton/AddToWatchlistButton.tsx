import { useEffect, useState } from "react";

import { Button, Tooltip } from "@mui/material";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import { useUserInfo } from "@hooks/api/useUserInfo";
import axios from "axios";

// import { ObjectId } from "mongodb";

interface AddToWatchlistButtonProps {
  isFirstInButtonGroup?: boolean;
  isLastInButtonGroup?: boolean;
  walletAddress: string;
  bookId: string;
}

const AddToWatchlistButton = ({
  isFirstInButtonGroup = false,
  isLastInButtonGroup = false,
  bookId
}: AddToWatchlistButtonProps) => {
  const userInfo = useUserInfo();
  const [isWatched, setIsWatched] = useState<boolean>();
  const handleAddToWatchlist = async () => {
    try {
      if (userInfo.data) {
        const userId = userInfo.data._id;
        const res = await axios.post("/api/watchlists/create", {
          userId,
          bookId
        });
        if (res.data.success) {
          setIsWatched(true);
        }
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      if (userInfo.data) {
        const userId = userInfo.data._id;
        console.log("userId", userId);
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
      console.log(userInfo.data?._id, bookId);
      if (bookId && userInfo.data) {
        const res = await axios.get(
          `/api/watchlists/${userInfo.data._id}/${bookId}`
        );
        if (res.data.success === true) {
          setIsWatched(true);
        }
      }
    })();
  }, [bookId, userInfo.data]);

  return (
    <Tooltip title={isWatched ? "Remove from watchlist" : "Add to watchlist"}>
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
        variant={isWatched ? "contained" : "outlined"}
      >
        <PlaylistAddIcon fontSize="small" />
      </Button>
    </Tooltip>
  );
};

export default AddToWatchlistButton;
