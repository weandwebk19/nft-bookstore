import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography
} from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";
import * as yup from "yup";

import { useAccount, useMetadata } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { NumericStepperController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { Image } from "@/components/shared/Image";
import { createTransactionHistory } from "@/components/utils";
import { createBookHistory } from "@/components/utils/createBookHistory";
import { getGasFee } from "@/components/utils/getGasFee";
import { StyledButton } from "@/styles/components/Button";
import { toastErrorTransaction } from "@/utils/toast";

interface TakeButtonProps {
  tokenId: number;
  fromRenter: string;
  sharer: string;
  price: number;
  startTime: number;
  endTime: number;
  supplyAmount: number;
}

const defaultValues = {
  amount: 1
};

const TakeButton = ({
  tokenId,
  fromRenter,
  sharer,
  startTime,
  endTime,
  price,
  supplyAmount
}: TakeButtonProps) => {
  const { t } = useTranslation("bookButtons");

  const [sharerName, setSharerName] = useState();
  const { provider, bookStoreContract, bookSharingContract } = useWeb3();
  const { account } = useAccount();
  const { metadata } = useMetadata(tokenId);

  const [anchorBookCard, setAnchorBookCard] = useState<Element | null>(null);
  const openBookCard = Boolean(anchorBookCard);

  const schema = yup
    .object({
      amount: yup
        .number()
        .min(1, t("textErrorTake1") as string)
        .typeError(t("textErrorTake2") as string)
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
  const [totalPayment, setTotalPayment] = useState<number>(price);

  const takeBooks = useCallback(
    async (
      tokenId: number,
      price: number,
      fromRenter: string,
      sharer: string,
      startTime: number,
      endTime: number
    ) => {
      try {
        // Handle errors
        if (account.data == sharer || account.data == fromRenter) {
          return toast.error(t("textErrorTake4") as string, {
            position: toast.POSITION.TOP_CENTER
          });
        }

        const idBooksOnSharing = await bookSharingContract!.getIdBookOnSharing(
          tokenId,
          fromRenter,
          sharer,
          startTime,
          endTime
        );

        const tx = await bookStoreContract?.takeBooksOnSharing(
          idBooksOnSharing,
          {
            value: ethers.utils.parseEther(price.toString())
          }
        );

        const receipt: any = await toast.promise(tx!.wait(), {
          pending: t("pendingTake") as string,
          success: t("successTake") as string,
          error: t("errorTake") as string
        });

        if (receipt) {
          const gasFee = await getGasFee(provider, receipt);

          const createTransactionHistoryForSharedPer = async (
            sharedPerAddress: string,
            sharerAddress: string,
            price: number,
            gasFee: string,
            transactionHash: string
          ) => {
            // Caculate total fee
            const totalFee = 0 - price - parseFloat(gasFee);
            // Get current balance of account
            const balance = await provider?.getBalance(sharedPerAddress);
            const balanceInEther = ethers.utils.formatEther(balance!);
            await createTransactionHistory(
              tokenId,
              totalFee,
              balanceInEther,
              "Take book on share",
              "Độc giả nhận sách chia sẻ",
              transactionHash,
              sharedPerAddress,
              sharerAddress,
              `Gas fee = ${gasFee} ETH, take book fee = ${price} ETH, total price = ${-totalFee} ETH`,
              `Phí gas = ${gasFee} ETH, Giá nhận sách = ${price} ETH, Tổng cộng = ${-totalFee} ETH`
            );
          };

          const createTransactionHistoryForSharer = async (
            sharedPerAddress: string,
            sharerAddress: string,
            price: number,
            transactionHash: string
          ) => {
            // Get current balance of account
            const balance = await provider?.getBalance(sharerAddress);
            const balanceInEther = ethers.utils.formatEther(balance!);
            await createTransactionHistory(
              tokenId,
              price,
              balanceInEther,
              "Reader take sharing book",
              "Độc giả nhận sách",
              transactionHash,
              sharerAddress,
              sharedPerAddress,
              `Total price received = ${price} ETH`,
              `Tổng tiền nhận = ${price} ETH`
            );
          };

          await createTransactionHistoryForSharedPer(
            account.data!,
            sharer,
            price,
            gasFee,
            receipt.transactionHash
          );
          await createTransactionHistoryForSharer(
            account.data!,
            sharer,
            price,
            receipt.transactionHash
          );
        }
      } catch (error: any) {
        toastErrorTransaction(error.message);
      }
    },
    [account.data, bookSharingContract, bookStoreContract, provider]
  );

  const createBookHistoryCallback = useCallback(
    async (tokenId: number, price: number, amount: number) => {
      if (account.data) {
        await createBookHistory(
          tokenId,
          "Take",
          "Nhận",
          account.data,
          price,
          amount
        );
      }
    },
    [account.data]
  );

  const onSubmit = async (data: any) => {
    await takeBooks(tokenId, price, fromRenter, sharer, startTime, endTime);
    await createBookHistoryCallback(tokenId, price, 1);
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
      <Button
        variant="contained"
        sx={{ flexGrow: 1, borderTopLeftRadius: 0 }}
        onClick={handleBookCardClick}
      >
        {t("takeNowBtn") as string}
      </Button>

      <Dialog
        title={t("takeNowTitle") as string}
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
                <Typography>{sharerName}</Typography>
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
                justifyContent: "flex-end"
              }}
            >
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "24px"
                }}
              >
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

export default TakeButton;
