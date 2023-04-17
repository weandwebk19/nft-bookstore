import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Grid, Stack, Typography } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import * as yup from "yup";

import { useAccount } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { InputController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";

import { Image } from "../Image";

interface ShareButtonProps {
  title: string;
  bookCover: string;
  renter: string;
  borrower: string;
  tokenId: number;
  startTime: number;
  endTime: number;
  borrowedAmount: number;
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

const ShareButton = ({
  bookCover,
  title,
  renter,
  borrower,
  startTime,
  endTime,
  tokenId,
  borrowedAmount
}: ShareButtonProps) => {
  const [renterName, setRenterName] = useState();
  const { contract } = useWeb3();
  const { account } = useAccount();

  const [anchorBookCard, setAnchorBookCard] = useState<Element | null>(null);
  const openBookCard = Boolean(anchorBookCard);

  const handleBookCardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorBookCard(e.currentTarget);
  };

  const handleBookCardClose = () => {
    setAnchorBookCard(null);
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
      // handle errors
      if (data.amount > borrowedAmount) {
        return toast.error(`Amount must be less than ${borrowedAmount}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      } else if (Math.floor(new Date().getTime() / 1000) >= endTime) {
        return toast.error("Borrowing time has expired", {
          position: toast.POSITION.TOP_CENTER
        });
      }

      const sharingPrice = await contract!.sharingPrice();
      const idBorrowedBook = await contract!.getIdBorrowedBook(
        tokenId,
        renter,
        borrower,
        startTime,
        endTime
      );
      console.log("idBorrowedBook", idBorrowedBook.toNumber());
      console.log("price", ethers.utils.parseEther(data.price.toString()));
      console.log("data.amount", data.amount);
      console.log("sharingPrice", sharingPrice.toNumber());
      const tx = await contract?.shareBooks(
        idBorrowedBook.toNumber(),
        ethers.utils.parseEther(data.price.toString()),
        data.amount,
        {
          value: sharingPrice
        }
      );
      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Sharing NftBook Token",
        success: "Share book successfully",
        error: "There's an error in sharing process!"
      });
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
      <StyledButton onClick={handleBookCardClick}>Share</StyledButton>

      <Dialog title="Share" open={openBookCard} onClose={handleBookCardClose}>
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
                <Typography>{renterName}</Typography>
                <Typography>{borrowedAmount} left</Typography>
              </Stack>
            </Grid>
            <Grid item md={8}>
              <Stack
                spacing={3}
                sx={{
                  mb: 5
                }}
              >
                <FormGroup label="Price" required>
                  <InputController name="price" type="number" />
                </FormGroup>
                <FormGroup label="Amount" required>
                  <InputController name="amount" type="number" />
                </FormGroup>
              </Stack>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <StyledButton
                  customVariant="secondary"
                  sx={{ mr: 2 }}
                  onClick={handleBookCardClose}
                >
                  Cancel
                </StyledButton>
                <StyledButton onClick={handleSubmit(onSubmit)}>
                  Start sharing
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </FormProvider>
        <ToastContainer />
      </Dialog>
    </>
  );
};

export default ShareButton;
