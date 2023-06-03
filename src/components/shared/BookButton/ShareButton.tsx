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
import { createBookHistory } from "@/components/utils/createBookHistory";
import { getGasFee } from "@/components/utils/getGasFee";
import { StyledButton } from "@/styles/components/Button";

import { createPricingHistory, createTransactionHistory } from "../../utils";
import { Image } from "../Image";

interface ShareButtonProps {
  renter: string;
  borrower: string;
  tokenId: number;
  startTime: number;
  endTime: number;
  borrowedAmount: number;
}

const defaultValues = {
  price: 0,
  amount: 1
};

const ShareButton = ({
  renter,
  borrower,
  startTime,
  endTime,
  tokenId,
  borrowedAmount
}: ShareButtonProps) => {
  const { t } = useTranslation("bookButtons");

  const [renterName, setRenterName] = useState();
  const { provider, bookStoreContract, bookRentingContract } = useWeb3();
  const { account } = useAccount();
  const { metadata } = useMetadata(tokenId);

  const [anchorBookCard, setAnchorBookCard] = useState<Element | null>(null);
  const openBookCard = Boolean(anchorBookCard);

  const schema = yup
    .object({
      price: yup
        .number()
        .min(0, t("textErrorShare1") as string)
        .typeError(t("textErrorShare2") as string),
      amount: yup
        .number()
        .min(1, t("textErrorShare3") as string)
        .typeError(t("textErrorShare4") as string)
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

  const shareBooks = useCallback(
    async (
      tokenId: number,
      price: number,
      amount: number,
      borrowedAmount: number,
      renter: string,
      borrower: string,
      startTime: number,
      endTime: number
    ) => {
      try {
        // handle errors
        if (amount > borrowedAmount) {
          return toast.error(
            `${t("textErrorShare5") as string} ${borrowedAmount}.`,
            {
              position: toast.POSITION.TOP_CENTER
            }
          );
        } else if (Math.floor(new Date().getTime() / 1000) >= endTime) {
          return toast.error(t("textErrorShare6") as string, {
            position: toast.POSITION.TOP_CENTER
          });
        }

        const sharingPrice = await bookStoreContract!.sharingPrice();
        const idBorrowedBook = await bookRentingContract!.getIdBorrowedBook(
          tokenId,
          renter,
          borrower,
          startTime,
          endTime
        );
        const tx = await bookStoreContract?.shareBooks(
          idBorrowedBook.toNumber(),
          ethers.utils.parseEther(price.toString()),
          amount,
          {
            value: sharingPrice
          }
        );
        const receipt: any = await toast.promise(tx!.wait(), {
          pending: t("pendingShare") as string,
          success: t("successShare") as string,
          error: t("errorShare") as string
        });

        if (receipt) {
          // Create Transaction History
          const gasFee = await getGasFee(provider, receipt);
          // Caculate total fee
          const sharingPriceNumber = parseFloat(
            ethers.utils.formatEther(sharingPrice)
          );
          const totalFee = 0 - sharingPriceNumber - parseFloat(gasFee);
          // Get current balance of account
          const balance = await provider?.getBalance(account.data!);
          const balanceInEther = ethers.utils.formatEther(balance!);
          await createTransactionHistory(
            tokenId,
            totalFee,
            balanceInEther,
            "Share book",
            "Chia sẻ sách",
            receipt.transactionHash,
            receipt.from,
            receipt.to,
            `Gas fee = ${gasFee} ETH, sharing fee = ${sharingPriceNumber} ETH, total fee = ${
              0 - totalFee
            } ETH`,
            `Phí gas = ${gasFee} ETH, Phí liệt kê = ${sharingPriceNumber} ETH, Tổng cộng = ${
              0 - totalFee
            } ETH`
          );
        }
      } catch (e: any) {
        console.error(e);
        toast.error(`${e.message.substr(0, 65)}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    },
    [account.data, bookRentingContract, bookStoreContract, provider]
  );

  const createPricingHistoryCallback = useCallback(
    async (tokenId: number, price: number) => {
      if (account.data) {
        await createPricingHistory(tokenId, price, "SHARE", account.data);
      }
    },
    [account.data]
  );

  const createBookHistoryCallback = useCallback(
    async (tokenId: number, price: number, amount: number) => {
      if (account.data) {
        await createBookHistory(
          tokenId,
          "Share",
          "Chia sẻ",
          account.data,
          price,
          amount
        );
      }
    },
    [account.data]
  );

  const onSubmit = async (data: any) => {
    await shareBooks(
      tokenId,
      data.price,
      data.amount,
      borrowedAmount,
      renter,
      borrower,
      startTime,
      endTime
    );
    await createPricingHistoryCallback(tokenId, data.price);
    await createBookHistoryCallback(tokenId, data.price, data.amount);
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
      <Button
        variant="outlined"
        size="small"
        sx={{ width: "100%" }}
        onClick={handleBookCardClick}
      >
        {t("shareBtn") as string}
      </Button>

      <Dialog
        title={t("shareTitle") as string}
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
                <Typography>{renterName}</Typography>
                <Typography>
                  {borrowedAmount} {t("left") as string}
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
                <FormGroup label={t("price") as string} required>
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
                  {t("startSharingBtn") as string}
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
