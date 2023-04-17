import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Box, Grid, Stack, Typography } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import * as yup from "yup";

import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { Image } from "@/components/shared/Image";
import { StyledButton } from "@/styles/components/Button";

interface RevokeLendingButtonProps {
  borrower?: string;
  amount: number;
  isEnded?: boolean;
  countDown?: string;
  title: string;
  bookCover: string;
  renter: string;
  tokenId: number;
  buttonName?: string;
  handleRevoke: () => Promise<any>;
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

const RevokeLendingButton = ({
  borrower,
  amount,
  isEnded,
  countDown,
  bookCover,
  title,
  renter,
  tokenId,
  buttonName = "Revoke",
  handleRevoke
}: RevokeLendingButtonProps) => {
  const [renterName, setRenterName] = useState();
  const { contract } = useWeb3();

  const [anchorRevokeDiaglog, setAnchorRevokeDiaglog] =
    useState<Element | null>(null);
  const openRevokeDiaglog = Boolean(anchorRevokeDiaglog);

  const handleRevokeDiaglogClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorRevokeDiaglog(e.currentTarget);
    if (isEnded) {
      try {
        await handleRevoke();
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

  // const methods = useForm({
  //   shouldUnregister: false,
  //   defaultValues,
  //   resolver: yupResolver(schema),
  //   mode: "all"
  // });

  // const { handleSubmit } = methods;

  const handleRevokeClick = async () => {
    try {
      await handleRevoke();
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
        Cancel Lending
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

export default RevokeLendingButton;
