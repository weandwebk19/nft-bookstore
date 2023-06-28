import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";
import * as yup from "yup";

import { useAccount, useMetadata } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { TextFieldController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { Image } from "@/components/shared/Image";
import { createBookHistory } from "@/components/utils/createBookHistory";
import { getGasFee } from "@/components/utils/getGasFee";
import { StyledButton } from "@/styles/components/Button";

import { createPricingHistory, createTransactionHistory } from "../../utils";
import { toastErrorTransaction } from "@/utils/toast";

interface LendButtonProps {
  owner: string;
  tokenId: number;
  amountTradeable: number;
}

const defaultValues = {
  price: 0,
  amount: 1
};

const LendButton = ({ owner, tokenId, amountTradeable }: LendButtonProps) => {
  const { t } = useTranslation("bookButtons");

  const [ownerName, setOwnerName] = useState();
  const { provider, bookStoreContract } = useWeb3();
  const { metadata } = useMetadata(tokenId);
  const { account } = useAccount();

  const [anchorBookCard, setAnchorBookCard] = useState<Element | null>(null);
  const openBookCard = Boolean(anchorBookCard);

  const schema = yup
    .object({
      price: yup
        .number()
        .min(0, t("textErrorLend1") as string)
        .typeError(t("textErrorLend2") as string),
      amount: yup
        .number()
        .min(1, t("textErrorLend3") as string)
        .typeError(t("textErrorLend4") as string)
    })
    .required();

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
          return toast.error(
            `${t("textErrorLend5") as string} ${amountTradeable}.`,
            {
              position: toast.POSITION.TOP_CENTER
            }
          );
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
          pending: t("pendingLend") as string,
          success: t("successLend") as string,
          error: t("errorLend") as string
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
            "Cho thuê sách",
            receipt.transactionHash,
            receipt.from,
            receipt.to,
            `Gas fee = ${gasFee} ETH, Lending fee = ${lendingPriceNumber} ETH, Total = ${
              0 - totalFee
            } ETH`,
            `Phí gas = ${gasFee} ETH, Phí liệt kê = ${lendingPriceNumber} ETH, Tổng cộng = ${
              0 - totalFee
            } ETH`
          );
        }
      } catch (e: any) {
        toastErrorTransaction(e.message);
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

  const createBookHistoryCallback = useCallback(
    async (tokenId: number, price: number, amount: number) => {
      if (account.data) {
        await createBookHistory(
          tokenId,
          "Lend",
          "Cho thuê",
          account.data,
          price,
          amount
        );
      }
    },
    [account.data]
  );

  const onSubmit = async (data: any) => {
    await lendBooks(tokenId, data.price, data.amount, amountTradeable);
    await createPricingHistoryCallback(tokenId, data.price);
    await createBookHistoryCallback(tokenId, data.price, data.amount);
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
        console.log("Something went wrong, please try again later!");
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
        {t("lendBtn") as string}
      </Button>

      <Dialog
        title={t("lendTitle") as string}
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
                <Typography>
                  {amountTradeable} {t("left") as string}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={8}>
              <Stack
                spacing={3}
                sx={{
                  mb: 5
                }}
              >
                <FormGroup label={t("lendingPrice") as string} required>
                  <TextFieldController name="price" type="number" />
                </FormGroup>
                <FormGroup label={t("amount") as string} required>
                  <TextFieldController name="amount" type="number" />
                </FormGroup>
              </Stack>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <StyledButton
                  customVariant="secondary"
                  sx={{ mr: 2 }}
                  onClick={handleBookCardClose}
                >
                  {t("cancelBtn") as string}
                </StyledButton>
                <StyledButton onClick={handleSubmit(onSubmit)}>
                  {t("lendOutBtn") as string}
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
