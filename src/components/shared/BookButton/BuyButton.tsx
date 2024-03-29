import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";
import * as yup from "yup";

import { useAccount, useMetadata } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { Image } from "@/components/shared/Image";
import { createBookHistory } from "@/components/utils/createBookHistory";
import { StyledButton } from "@/styles/components/Button";
import { toastErrorTransaction } from "@/utils/toast";

import { createTransactionHistory } from "../../utils";
import { getGasFee } from "../../utils/getGasFee";
import { NumericStepperController } from "../FormController";
import { FormGroup } from "../FormGroup";

interface BuyButtonProps {
  tokenId: number;
  seller: string;
  price: number;
  supplyAmount: number;
}

const defaultValues = {
  amount: 1
};

const BuyButton = ({
  tokenId,
  seller,
  price,
  supplyAmount
}: BuyButtonProps) => {
  const { t } = useTranslation("bookButtons");

  const { provider, bookStoreContract } = useWeb3();
  const { account } = useAccount();
  const [sellerName, setSellerName] = useState();
  const { metadata } = useMetadata(tokenId);

  const [anchorBookCard, setAnchorBookCard] = useState<Element | null>(null);
  const openBookCard = Boolean(anchorBookCard);

  const schema = yup
    .object({
      amount: yup
        .number()
        .min(1, t("textErrorBuy1") as string)
        .typeError(t("textErrorBuy2") as string)
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

  const { handleSubmit, watch } = methods;

  const currentAmount = watch("amount");
  const [totalPayment, setTotalPayment] = useState<number>(0);

  useEffect(() => {
    const total = currentAmount * price;
    setTotalPayment(total);
  }, [currentAmount, price]);

  const buyBooks = useCallback(
    async (
      tokenId: number,
      seller: string,
      price: number,
      amount: number,
      supplyAmount: number
    ) => {
      try {
        // Handle errors
        if (amount > supplyAmount) {
          return toast.error(
            `${t("textErrorBuy3") as string} ${supplyAmount}.`,
            {
              position: toast.POSITION.TOP_CENTER
            }
          );
        } else if (account.data == seller) {
          return toast.error(t("textErrorBuy4") as string, {
            position: toast.POSITION.TOP_CENTER
          });
        }

        const tx = await bookStoreContract?.buyBooks(tokenId, seller, amount, {
          value: ethers.utils.parseEther((price * amount).toFixed(3).toString())
        });

        const receipt: any = await toast.promise(tx!.wait(), {
          pending: t("pendingBuy") as string,
          success: t("successBuy") as string,
          error: t("errorBuy") as string
        });

        if (receipt) {
          const gasFee = await getGasFee(provider, receipt);

          const createTransactionHistoryForBuyer = async (
            buyerAddress: string,
            sellerAddress: string,
            price: number,
            amount: number,
            gasFee: string,
            transactionHash: string
          ) => {
            // Caculate total fee
            const totalFee = 0 - price * amount - parseFloat(gasFee);
            // Get current balance of account
            const balance = await provider?.getBalance(buyerAddress);
            const balanceInEther = ethers.utils.formatEther(balance!);
            await createTransactionHistory(
              tokenId,
              totalFee,
              balanceInEther,
              "Buy book",
              "Mua sách",
              transactionHash,
              buyerAddress,
              sellerAddress,
              `Gas fee = ${gasFee} ETH, book fee = ${
                price * amount
              } ETH, total price =  = ${0 - totalFee} ETH`,
              `Phí gas = ${gasFee} ETH, Giá quyển sách = ${
                price * amount
              } ETH, Tổng cộng =  = ${0 - totalFee} ETH`
            );
          };

          const createTransactionHistoryForSeller = async (
            buyerAddress: string,
            sellerAddress: string,
            price: number,
            amount: number,
            transactionHash: string
          ) => {
            // Get current balance of account
            const balance = await provider?.getBalance(sellerAddress);
            const balanceInEther = ethers.utils.formatEther(balance!);
            await createTransactionHistory(
              tokenId,
              price * amount,
              balanceInEther,
              "Reader buy book",
              "Độc giả mua sách",
              transactionHash,
              sellerAddress,
              buyerAddress,
              `Total price received = ${price * amount} ETH`,
              `Tổng tiền nhận = ${price * amount} ETH`
            );
          };

          await createTransactionHistoryForBuyer(
            account.data!,
            seller,
            price,
            amount,
            gasFee,
            receipt.transactionHash
          );
          await createTransactionHistoryForSeller(
            account.data!,
            seller,
            price,
            amount,
            receipt.transactionHash
          );
        }

        await createBookHistoryCallback(tokenId, price, amount);
      } catch (e: any) {
        toastErrorTransaction(e.message);
      }
    },
    [account.data, bookStoreContract, provider]
  );

  const createBookHistoryCallback = useCallback(
    async (tokenId: number, price: number, amount: number) => {
      if (account.data) {
        await createBookHistory(
          tokenId,
          "Buy",
          "Mua",
          account.data,
          price,
          amount
        );
      }
    },
    [account.data]
  );

  const onSubmit = async (data: any) => {
    await buyBooks(tokenId, seller, price, data.amount, supplyAmount);
  };

  useEffect(() => {
    (async () => {
      try {
        if (seller) {
          const userRes = await axios.get(`/api/users/wallet/${seller}`);

          if (userRes.data.success === true) {
            setSellerName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log("Something went wrong, please try again later!");
      }
    })();
  }, [seller]);

  return (
    <>
      <Button
        variant="contained"
        sx={{ flexGrow: 1, borderTopLeftRadius: 0 }}
        onClick={handleBookCardClick}
      >
        {t("buyNowBtn") as string}
      </Button>

      <Dialog
        title={t("buyNowTitle") as string}
        open={openBookCard}
        onClose={handleBookCardClose}
      >
        <FormProvider {...methods}>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
            <Grid item md={4} xs={4}>
              <Stack sx={{ alignItems: { xs: "center", md: "start" } }}>
                <Image
                  src={metadata?.data?.bookCover}
                  alt={metadata?.data?.title}
                  sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                  className={styles["book-item__book-cover"]}
                />
                <Typography variant="h5">{metadata?.data?.title}</Typography>
                <Typography>{sellerName}</Typography>
                <Typography variant="h4">{price} ETH</Typography>
              </Stack>
            </Grid>

            <Grid
              item
              md={8}
              xs={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Stack
                spacing={3}
                sx={{
                  mb: 5
                }}
              >
                <FormGroup label={t("amount") as string} required>
                  <NumericStepperController name="amount" />
                  <Typography>
                    {supplyAmount} {t("left") as string}
                  </Typography>
                </FormGroup>
              </Stack>
              <Divider />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>{t("total") as string}:</Typography>
                <Typography variant="h6">{totalPayment} ETH</Typography>
              </Stack>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ textAlign: "end" }}
              >
                {t("gasFee") as string}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <StyledButton
                  customVariant="secondary"
                  sx={{ mr: 2 }}
                  onClick={handleBookCardClose}
                >
                  {t("cancelBtn") as string}
                </StyledButton>
                <StyledButton onClick={handleSubmit(onSubmit)}>
                  {t("confirmPurchaseBtn") as string}
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

export default BuyButton;
