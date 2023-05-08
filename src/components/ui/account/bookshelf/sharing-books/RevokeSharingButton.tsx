import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  AlertColor,
  Box,
  Button,
  Grid,
  Stack,
  Typography
} from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import * as yup from "yup";

import { useMetadata } from "@/components/hooks/api/useMetadata";
import { useAccount } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { Image } from "@/components/shared/Image";
import { Snackbar } from "@/components/shared/Snackbar";
import { StyledButton } from "@/styles/components/Button";

interface RevokeSharingButtonProps {
  sharedPer?: string;
  amount: number;
  isEnded?: boolean;
  countDown?: string;
  sharer: string;
  tokenId: number;
  fromRenter: string;
  startTime: number;
  endTime: number;
  buttonName?: string;
}

// const schema = yup
//   .object({
//     price: yup
//       .number()
//       .min(0, `The price must be higher than 0.`)
//       .typeError("Price must be a number"),
//     amount: yup
//       .number()
//       .min(1, `The price must be higher than 0.`)
//       .typeError("Amount must be a number")
//   })
//   .required();

// const defaultValues = {
//   price: 0,
//   amount: 1
// };

const RevokeSharingButton = ({
  sharedPer,
  amount,
  isEnded,
  countDown,
  sharer,
  fromRenter,
  startTime,
  endTime,
  tokenId,
  buttonName = "Cancel Share"
}: RevokeSharingButtonProps) => {
  const [sharerName, setSharerName] = useState();
  const { bookSharingContract, bookTemporaryContract } = useWeb3();
  const { account } = useAccount();
  const metadata = useMetadata(tokenId);

  const [anchorRevokeDiaglog, setAnchorRevokeDiaglog] =
    useState<Element | null>(null);
  const openRevokeDiaglog = Boolean(anchorRevokeDiaglog);

  const handleCancelSharing = async () => {
    try {
      // handle errors
      if (sharer !== account.data) {
        return toast.error("Sharer address is not valid.", {
          position: toast.POSITION.TOP_CENTER
        });
      }

      const idBooksOnSharing = await bookSharingContract!.getIdBookOnSharing(
        tokenId,
        fromRenter,
        sharer,
        startTime,
        endTime
      );

      const tx =
        await bookTemporaryContract?.convertBookOnSharingToBorrowedBook(
          idBooksOnSharing,
          amount
        );

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Pending.",
        success: "Cancel share NftBook successfully",
        error: "Oops! There's a problem with sharing cancel process!"
      });
      console.log(receipt);
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message}.`, {
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
        await handleCancelSharing();
      } catch (e: any) {
        console.error(e);
      }
    }
  };

  const handleRevokeDiaglogClose = () => {
    setAnchorRevokeDiaglog(null);
  };

  const handleRevokeClick = async () => {
    try {
      await handleCancelSharing();
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (sharer) {
          const userRes = await axios.get(`/api/users/wallet/${sharer}`);

          if (userRes.data.success === true) {
            setSharerName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [sharer]);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        sx={{ width: "100%" }}
        onClick={handleRevokeDiaglogClick}
      >
        Cancel Share
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
                <Typography>{sharerName}</Typography>
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
                {sharedPer && !isEnded && (
                  <>
                    <Typography>
                      {sharedPer} is in a rental term duration. Are you sure you
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
                  No
                </StyledButton>
                <StyledButton onClick={() => handleRevokeClick()}>
                  Yes
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </Dialog>
      )}
    </>
  );
};

export default RevokeSharingButton;
