import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import styles from "@styles/BookItem.module.scss";
import axios from "axios";

import { useAccount, useMetadata } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { Image } from "@/components/shared/Image";
import { createTransactionHistoryOnlyGasFee } from "@/components/utils";
import { StyledButton } from "@/styles/components/Button";

interface RevokeSharedOutButtonProps {
  sharer: string;
  sharedPer: string;
  amount: number;
  isEnded?: boolean;
  countDown?: string;
  fromRenter: string;
  tokenId: number;
  startTime: number;
  endTime: number;
  buttonName?: string;
}

const RevokeSharedOutButton = ({
  sharer,
  sharedPer,
  amount,
  isEnded,
  countDown,
  fromRenter,
  startTime,
  endTime,
  tokenId,
  buttonName = "Revoke"
}: RevokeSharedOutButtonProps) => {
  const [renterName, setRenterName] = useState();
  const { account } = useAccount();
  const { provider, bookStoreContract, bookSharingContract } = useWeb3();
  const { metadata } = useMetadata(tokenId);

  const [anchorRevokeDiaglog, setAnchorRevokeDiaglog] =
    useState<Element | null>(null);
  const openRevokeDiaglog = Boolean(anchorRevokeDiaglog);

  const handleRevokeSharedOut = async () => {
    try {
      // handle errors
      if (sharer !== account.data) {
        return toast.error("Renter address is not valid.", {
          position: toast.POSITION.TOP_CENTER
        });
      }

      const idSharedBook = await bookSharingContract!.getIdSharedBook(
        tokenId,
        sharedPer,
        sharer,
        startTime,
        endTime
      );

      const tx = await bookStoreContract?.recallSharedBooks(idSharedBook);

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Pending.",
        success: "Revoke share NftBook successfully",
        error: "Oops! There's a problem with sharing revoke process!"
      });

      if (receipt) {
        await createTransactionHistoryOnlyGasFee(
          provider,
          receipt,
          tokenId,
          "Revoke shared out book"
        );
      }
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message.substr(0, 65)}.`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  const handleRevokeDiaglogClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorRevokeDiaglog(e.currentTarget);
    if (isEnded) {
      try {
        await handleRevokeSharedOut();
      } catch (e: any) {
        console.error(e);
        toast.error(`${e.message.substr(0, 65)}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    }
  };

  const handleRevokeDiaglogClose = () => {
    setAnchorRevokeDiaglog(null);
  };

  const handleRevokeClick = async () => {
    try {
      await handleRevokeSharedOut();
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message.substr(0, 65)}.`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (fromRenter) {
          const userRes = await axios.get(`/api/users/wallet/${fromRenter}`);

          if (userRes.data.success === true) {
            setRenterName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [fromRenter]);

  return (
    <>
      <Button
        variant={isEnded ? "contained" : "outlined"}
        size="small"
        sx={{ width: "100%" }}
        onClick={handleRevokeDiaglogClick}
      >
        {buttonName}
      </Button>

      {!isEnded && (
        <Dialog
          title={buttonName}
          open={openRevokeDiaglog}
          onClose={handleRevokeDiaglogClose}
        >
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
            <Grid item md={4}>
              <Stack>
                <Image
                  src={metadata.data?.bookCover}
                  alt={metadata.data?.title}
                  sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                  className={styles["book-item__book-cover"]}
                />
                <Typography variant="h5">{metadata.data?.title}</Typography>
                <Typography>{renterName}</Typography>
                <Typography>Amount: {amount}</Typography>
              </Stack>
            </Grid>
            <Grid item md={8}>
              <Stack
                spacing={3}
                sx={{
                  mb: 5
                }}
              >
                {sharer && !isEnded && (
                  <>
                    <Typography>
                      {sharer} is in a sharing term duration. Are you sure you
                      want to revoke this?
                    </Typography>
                    <Typography>{countDown} left</Typography>
                  </>
                )}
              </Stack>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <StyledButton
                  customVariant="secondary"
                  sx={{ mr: 2 }}
                  onClick={handleRevokeDiaglogClose}
                >
                  Cancel
                </StyledButton>
                <StyledButton onClick={() => handleRevokeClick()}>
                  Revoke
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </Dialog>
      )}
    </>
  );
};

export default RevokeSharedOutButton;
