import { useEffect, useState } from "react";

import { Button, Tooltip } from "@mui/material";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";

import axios from "axios";
import { useTranslation } from "next-i18next";

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
  const { t } = useTranslation("bookButtons");

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
    <Tooltip
      title={
        isWatched ? t("removeFromWatchlistTitle") : t("addToWatchlistTitle")
      }
    >
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
        variant="outlined"
      >
        {isWatched ? (
          <BookmarkIcon fontSize="small" />
        ) : (
          <BookmarkBorderOutlinedIcon fontSize="small" />
        )}
      </Button>
    </Tooltip>
  );
};

export default AddToWatchlistButton;
