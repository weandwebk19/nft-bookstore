import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Box, Grid, Stack, Typography } from "@mui/material";

import styles from "@styles/BookItem.module.scss";
import axios from "axios";

import { useMetadata } from "@/components/hooks/api/useMetadata";
import { useAccount } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { Image } from "@/components/shared/Image";
import { StyledButton } from "@/styles/components/Button";

interface RevokeLentOutButtonProps {
  borrower: string;
  amount: number;
  isEnded?: boolean;
  countDown?: string;
  renter: string;
  tokenId: number;
  startTime: number;
  endTime: number;
  buttonName?: string;
}

const RevokeLentOutButton = ({
  borrower,
  amount,
  isEnded,
  countDown,
  renter,
  tokenId,
  startTime,
  endTime,
  buttonName = "Revoke"
}: RevokeLentOutButtonProps) => {
  const [renterName, setRenterName] = useState();
  const { contract } = useWeb3();
  const { account } = useAccount();
  const metadata = useMetadata(tokenId);

  const [anchorRevokeDiaglog, setAnchorRevokeDiaglog] =
    useState<Element | null>(null);
  const openRevokeDiaglog = Boolean(anchorRevokeDiaglog);

  const handleRevokeBorrowedBooks = async () => {
    try {
      // handle errors
      if (renter !== account.data) {
        return toast.error("Renter address is not valid.", {
          position: toast.POSITION.TOP_CENTER
        });
      }

      const idBorrowedBook = await contract!.getIdBorrowedBook(
        tokenId,
        renter,
        borrower,
        startTime,
        endTime
      );
      const tx = await contract?.recallBorrowedBooks(idBorrowedBook);

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Pending.",
        success: "Revoke lent out book successfully",
        error: "Oops! There's a problem with lent out process!"
      });
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
        await handleRevokeBorrowedBooks();
      } catch (e: any) {
        console.error(e);
        toast.error(`${e.message}.`, {
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
      await handleRevokeBorrowedBooks();
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
        onClick={handleRevokeDiaglogClick}
        customVariant={isEnded ? "primary" : "secondary"}
      >
        {buttonName}
      </StyledButton>

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
                {borrower && !isEnded && (
                  <>
                    <Typography>
                      {borrower} is in a rental term duration. Are you sure you
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

export default RevokeLentOutButton;
