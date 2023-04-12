import { useEffect, useState } from "react";

import { Button, Tooltip } from "@mui/material";

import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

import axios from "axios";

import { useAccount } from "@/components/hooks/web3";

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
  const { account } = useAccount();
  const [isWatched, setIsWatched] = useState<boolean>();
  const handleAddToWatchlist = async () => {
    try {
      if (account.data) {
        const res = await axios.post("/api/watchlists/create", {
          tokenId,
          walletAddress: account.data
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
      if (account.data) {
        const res = await axios.delete(
          `/api/watchlists/${account.data}/${tokenId}/delete`
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
        if (tokenId && account.data) {
          const res = await axios.get(
            `/api/watchlists/${account.data}/${tokenId}`
          );
          if (res.data.success === true) {
            setIsWatched(true);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [tokenId, account.data]);

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
        <BookmarkBorderOutlinedIcon fontSize="small" />
      </Button>
    </Tooltip>
  );
};

export default AddToWatchlistButton;
