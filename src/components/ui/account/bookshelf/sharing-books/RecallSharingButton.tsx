import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { AlertColor, Box, Grid, Stack, Typography } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import * as yup from "yup";

import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { Image } from "@/components/shared/Image";
import { Snackbar } from "@/components/shared/Snackbar";
import { StyledButton } from "@/styles/components/Button";

interface RecallSharingButtonProps {
  sharedPer?: string;
  amount: number;
  isEnded?: boolean;
  countDown?: string;
  title: string;
  bookCover: string;
  sharer: string;
  tokenId: number;
  buttonName?: string;
  handleRecall: () => Promise<any>;
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

const RecallSharingButton = ({
  sharedPer,
  amount,
  isEnded,
  countDown,
  bookCover,
  title,
  sharer,
  tokenId,
  buttonName = "Recall",
  handleRecall
}: RecallSharingButtonProps) => {
  const [sharerName, setSharerName] = useState();

  const [anchorRecallDiaglog, setAnchorRecallDiaglog] =
    useState<Element | null>(null);
  const openRecallDiaglog = Boolean(anchorRecallDiaglog);

  const handleRecallDiaglogClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorRecallDiaglog(e.currentTarget);
    if (isEnded) {
      try {
        await handleRecall();
      } catch (e: any) {
        console.error(e);
        toast.error(`${e.message}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    }
  };

  const handleRecallDiaglogClose = () => {
    setAnchorRecallDiaglog(null);
  };

  const handleRecallClick = async () => {
    try {
      await handleRecall();
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message}.`, {
        position: toast.POSITION.TOP_CENTER
      });
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
      <StyledButton
        onClick={handleRecallDiaglogClick}
        customVariant={isEnded ? "primary" : "secondary"}
      >
        Recall Sharing
      </StyledButton>

      {!isEnded && (
        <Dialog
          title={buttonName}
          open={openRecallDiaglog}
          onClose={handleRecallDiaglogClose}
        >
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
            <Grid item md={4}>
              <Stack>
                <Image
                  src={bookCover}
                  alt={title}
                  sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                  className={styles["book-item__book-cover"]}
                />
                <Typography variant="h5">{title}</Typography>
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
                      want to recall this?
                    </Typography>
                    <Typography>{countDown} left</Typography>
                  </>
                )}
              </Stack>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <StyledButton
                  customVariant="secondary"
                  sx={{ mr: 2 }}
                  onClick={handleRecallDiaglogClose}
                >
                  Cancel
                </StyledButton>
                <StyledButton onClick={() => handleRecallClick()}>
                  Recall
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </Dialog>
      )}
    </>
  );
};

export default RecallSharingButton;
