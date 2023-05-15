import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import * as yup from "yup";

import { useAccount, useMetadata } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { TextFieldController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { Image } from "@/components/shared/Image";
import { getGasFee } from "@/components/utils/getGasFee";
import { StyledButton } from "@/styles/components/Button";

import { createPricingHistory, createTransactionHistory } from "../../utils";

interface LendButtonProps {
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

const LendButton = ({ owner, tokenId, amountTradeable }: LendButtonProps) => {
  const [ownerName, setOwnerName] = useState();
  const { provider, bookStoreContract } = useWeb3();
  const { metadata } = useMetadata(tokenId);
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

  const lendBooks = useCallback(
    async (
      tokenId: number,
      price: number,
      amount: number,
      amountTradeable: number
    ) => {
      try {
        // handle errors
        if (amount > amountTradeable) {
          return toast.error(`Amount must be less than ${amountTradeable}.`, {
            position: toast.POSITION.TOP_CENTER
          });
        }

        const lendingPrice = await bookStoreContract!.lendingPrice();
        const tx = await bookStoreContract?.lendBooks(
          tokenId,
          ethers.utils.parseEther(price.toString()),
          amount,
          {
            value: lendingPrice
          }
        );

        const receipt: any = await toast.promise(tx!.wait(), {
          pending: "Lend NftBook Token",
          success: "NftBook is successfully lent out!",
          error: "Oops! There's a problem with lending process!"
        });

        if (receipt) {
          // create Transaction History
          const gasFee = await getGasFee(provider, receipt);
          // Caculate total fee
          const lendingPriceNumber = parseFloat(
            ethers.utils.formatEther(lendingPrice)
          );
          const totalFee = 0 - lendingPriceNumber - parseFloat(gasFee);
          // Get current balance of account
          const balance = await provider?.getBalance(account.data!);
          const balanceInEther = ethers.utils.formatEther(balance!);
          await createTransactionHistory(
            tokenId,
            totalFee,
            balanceInEther,
            "Lend book",
            receipt.transactionHash,
            receipt.from,
            receipt.to,
            `Gas fee = ${gasFee}, lending fee = ${lendingPriceNumber}, total fee = ${
              0 - totalFee
            } ETH`
          );
        }
      } catch (e: any) {
        console.log(e.message);
        toast.error(`${e.message.substr(0, 65)}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    },
    [account.data, bookStoreContract, provider]
  );

  const createPricingHistoryCallback = useCallback(
    async (tokenId: number, price: number) => {
      if (account.data) {
        await createPricingHistory(tokenId, price, "LEND", account.data);
      }
    },
    [account.data]
  );

  const onSubmit = async (data: any) => {
    await lendBooks(tokenId, data.price, data.amount, amountTradeable);
    await createPricingHistoryCallback(tokenId, data.price);
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
      <Button
        variant="outlined"
        size="small"
        sx={{ width: "100%" }}
        onClick={handleBookCardClick}
      >
        Lend
      </Button>

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
                  src={metadata.data?.bookCover}
                  alt={metadata.data?.title}
                  sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                  className={styles["book-item__book-cover"]}
                />
                <Typography variant="h5">{metadata.data?.title}</Typography>
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
                  <TextFieldController name="price" type="number" />
                </FormGroup>
                <FormGroup label="Amount" required>
                  <TextFieldController name="amount" type="number" />
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
