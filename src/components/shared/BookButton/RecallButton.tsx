import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Box, Grid, Stack, Typography } from "@mui/material";

import styles from "@styles/BookItem.module.scss";
import axios from "axios";

import { Dialog } from "@/components/shared/Dialog";
import { StyledButton } from "@/styles/components/Button";

import { Image } from "../Image";

interface RecallButtonProps {
  borrower?: string;
  amount: number;
  isEnded?: boolean;
  countDown?: string;
  title: string;
  bookCover: string;
  renter: string;
  tokenId: number;
  handleRecall: () => Promise<any>;
  buttonName?: string;
}

const RecallButton = ({
  borrower,
  amount,
  isEnded,
  countDown,
  bookCover,
  title,
  renter,
  tokenId,
  handleRecall,
  buttonName = "Recall"
}: RecallButtonProps) => {
  const [renterName, setRenterName] = useState();

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
        if (renter) {
          const userRes = await axios.get(`/api/users/wallet/${renter}`);

          if (userRes.data.success === true) {
            setRenterName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [renter]);

  return (
    <>
      <StyledButton
        onClick={handleRecallDiaglogClick}
        customVariant={isEnded ? "primary" : "secondary"}
      >
        {buttonName}
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
                {borrower && !isEnded && (
                  <>
                    <Typography>
                      {borrower} is in a rental term duration. Are you sure you
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

export default RecallButton;
