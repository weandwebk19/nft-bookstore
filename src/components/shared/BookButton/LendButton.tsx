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

import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { InputController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { Image } from "@/components/shared/Image";
import { StyledButton } from "@/styles/components/Button";

interface LendButtonProps {
  title: string;
  bookCover: string;
  owner: string;
  tokenId: number;
  amountTradeable: number;
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

const LendButton = ({
  bookCover,
  title,
  owner,
  tokenId,
  amountTradeable
}: LendButtonProps) => {
  const [ownerName, setOwnerName] = useState();
  const { ethereum, contract } = useWeb3();

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
      if (data.amount > amountTradeable) {
        return toast.error(`Amount must be less than ${amountTradeable}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }

      const lendingPrice = await contract!.leasingPrice();
      const tx = await contract?.leaseBooks(
        tokenId,
        ethers.utils.parseEther(data.price.toString()),
        data.amount,
        {
          value: lendingPrice
        }
      );

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Lend NftBook Token",
        success: "NftBook is successfully lent out!",
        error: "Oops! There's a problem with lending process!"
      });
    } catch (e: any) {
      console.log(e.message);
      toast.error(`${e.message}.`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (owner) {
          const userRes = await axios.get(`/api/users/wallet/${owner}`);

          if (userRes.data.success === true) {
            setOwnerName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [owner]);

  return (
    <>
      <StyledButton onClick={handleBookCardClick}>Lend</StyledButton>

      <Dialog
        title="Open for lend"
        open={openBookCard}
        onClose={handleBookCardClose}
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
                <Typography>{ownerName}</Typography>{" "}
                <Typography>{amountTradeable} left</Typography>
              </Stack>
            </Grid>
            <Grid item md={8}>
              <Stack
                spacing={3}
                sx={{
                  mb: 5
                }}
              >
                <FormGroup label="Lending price/day" required>
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
                  Lend out
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

export default LendButton;