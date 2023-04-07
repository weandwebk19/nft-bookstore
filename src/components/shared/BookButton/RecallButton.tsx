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
import { StyledButton } from "@/styles/components/Button";

import { Image } from "../Image";
import { Snackbar } from "../Snackbar";

interface RecallButtonProps {
  rentee: string;
  isEnded: boolean;
  title: string;
  bookCover: string;
  author: string;
  tokenId: number;
}

const schema = yup
  .object({
    price: yup
      .number()
      .min(0, `The price must be higher than 0.`)
      .typeError("Price must be a number"),
    amount: yup
      .number()
      .min(1, `The price must be higher than 0.`)
      .typeError("Amount must be a number")
  })
  .required();

const defaultValues = {
  price: 0,
  amount: 1
};

const RecallButton = ({
  rentee,
  isEnded,
  bookCover,
  title,
  author,
  tokenId
}: RecallButtonProps) => {
  const [authorName, setAuthorName] = useState();
  const { ethereum, contract } = useWeb3();

  const [anchorRecallDiaglog, setAnchorRecallDiaglog] =
    useState<Element | null>(null);
  const openRecallDiaglog = Boolean(anchorRecallDiaglog);

  const [severity, setSeverity] = useState<AlertColor>("success");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleRecallDiaglogClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorRecallDiaglog(e.currentTarget);
    if (isEnded) {
      setAlertMessage("Successfully recalled!");
      setOpenSnackbar(true);
    }
  };

  const handleRecallDiaglogClose = () => {
    setAnchorRecallDiaglog(null);
  };

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    try {
      const listingPrice = await contract!.listingPrice();
      // const tx = await contract?.sellBooks(
      //   tokenId,
      //   ethers.utils.parseEther(data.price.toString()),
      //   data.amount,
      //   {
      //     value: listingPrice
      //   }
      // );
      const tx = await contract?.sellBooks(
        tokenId,
        ethers.utils.parseEther(data.price.toString()),
        data.amount,
        {
          value: listingPrice
        }
      );

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Recall NftBook Token",
        success: "NftBook has been recalled successfully!",
        error: "Recall error"
      });

      console.log("recall info", receipt);
      setSeverity("success" as AlertColor);
      setAlertMessage("Successfully recalled!");
      setOpenSnackbar(true);
    } catch (e: any) {
      console.error(e);
      setSeverity("error" as AlertColor);
      setAlertMessage("Oops! Something went wrong!");
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (author) {
          const userRes = await axios.get(`/api/users/wallet/${author}`);

          if (userRes.data.success === true) {
            setAuthorName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [author]);

  return (
    <>
      <StyledButton
        onClick={handleRecallDiaglogClick}
        customVariant={isEnded ? "primary" : "secondary"}
      >
        Recall
      </StyledButton>

      {!isEnded && (
        <Dialog
          title="Recall"
          open={openRecallDiaglog}
          onClose={handleRecallDiaglogClose}
        >
          <FormProvider {...methods}>
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
                  <Typography>{authorName}</Typography>
                </Stack>
              </Grid>
              <Grid item md={8}>
                <Stack
                  spacing={3}
                  sx={{
                    mb: 5
                  }}
                >
                  {!isEnded && (
                    <Typography>
                      {rentee} is in a rental term duration. Are you sure you
                      want to recall this?
                    </Typography>
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
                  <StyledButton onClick={handleSubmit(onSubmit)}>
                    Recall
                  </StyledButton>
                </Box>
              </Grid>
            </Grid>
          </FormProvider>
        </Dialog>
      )}
      <Snackbar
        severity={severity}
        open={openSnackbar}
        handleClose={handleSnackbarClose}
        message={alertMessage}
      />
    </>
  );
};

export default RecallButton;