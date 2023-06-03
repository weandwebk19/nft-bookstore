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
import { NumericStepperController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { Image } from "@/components/shared/Image";
import { createTransactionHistory } from "@/components/utils";
import { createBookHistory } from "@/components/utils/createBookHistory";
import { getGasFee } from "@/components/utils/getGasFee";
import { StyledButton } from "@/styles/components/Button";
import { daysToSeconds } from "@/utils/timeConvert";

interface RentButtonProps {
  tokenId: number;
  renter: string;
  price: number;
  supplyAmount: number;
}

const defaultValues = {
  amount: 1,
  rentalDays: 7
};

const RentButton = ({
  tokenId,
  renter,
  price,
  supplyAmount
}: RentButtonProps) => {
  const { t } = useTranslation("bookButtons");

  const [renterName, setRenterName] = useState();
  const { provider, bookStoreContract } = useWeb3();
  const { account } = useAccount();
  const { metadata } = useMetadata(tokenId);

  const [anchorBookCard, setAnchorBookCard] = useState<Element | null>(null);
  const openBookCard = Boolean(anchorBookCard);

  const schema = yup
    .object({
      amount: yup
        .number()
        .min(0, t("textErrorRent1") as string)
        .typeError(t("textErrorRent2") as string),
      rentalDays: yup
        .number()
        .min(0, t("textErrorRent3") as string)
        .typeError(t("textErrorRent4") as string)
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

  const { handleSubmit, watch, getValues } = methods;

  const currentAmount = watch("amount");
  const currentRentalDays = watch("rentalDays");
  const [totalPayment, setTotalPayment] = useState<number>(0);

  const borrowBooks = useCallback(
    async (
      tokenId: number,
      renter: string,
      price: number,
      amount: number,
      rentalDuration: number,
      supplyAmount: number
    ) => {
      try {
        // Handle errors
        if (rentalDuration < 604800) {
          return toast.error(t("textErrorRent5") as string, {
            position: toast.POSITION.TOP_CENTER
          });
        } else if (amount > supplyAmount) {
          return toast.error(
            `${t("textErrorRent6") as string} ${supplyAmount}.`,
            {
              position: toast.POSITION.TOP_CENTER
            }
          );
        } else if (account.data == renter) {
          return toast.error(t("textErrorRent7") as string, {
            position: toast.POSITION.TOP_CENTER
          });
        }

        const value = (price * amount * rentalDuration) / 604800;
        const tx = await bookStoreContract!.borrowBooks(
          tokenId,
          renter,
          ethers.utils.parseEther(price.toString()),
          amount,
          rentalDuration,
          {
            value: ethers.utils.parseEther(value.toString())
          }
        );

        const receipt = await toast.promise(tx!.wait(), {
          pending: t("pendingRent") as string,
          success: t("successRent") as string,
          error: t("errorRent") as string
        });

        if (receipt) {
          const gasFee = await getGasFee(provider, receipt);

          const createTransactionHistoryForBorrower = async (
            borrowerAddress: string,
            renterAddress: string,
            value: string,
            gasFee: string,
            transactionHash: string
          ) => {
            // Caculate total fee
            const totalFee = 0 - parseFloat(value) - parseFloat(gasFee);
            // Get current balance of account
            const balance = await provider?.getBalance(borrowerAddress);
            const balanceInEther = ethers.utils.formatEther(balance!);
            await createTransactionHistory(
              tokenId,
              totalFee,
              balanceInEther,
              "Borrow book",
              "Mượn sách",
              transactionHash,
              borrowerAddress,
              renterAddress,
              `Gas fee = ${gasFee} ETH, borrow fee = ${parseFloat(
                value
              )} ETH, total price = ${-totalFee} ETH`,
              `Phí gas = ${gasFee} ETH, Giá mượn sách = ${parseFloat(
                value
              )} ETH, Tổng cộng = ${-totalFee} ETH`
            );
          };

          const createTransactionHistoryForRenter = async (
            borrowerAddress: string,
            renterAddress: string,
            value: string,
            transactionHash: string
          ) => {
            // Get current balance of account
            const balance = await provider?.getBalance(renterAddress);
            const balanceInEther = ethers.utils.formatEther(balance!);
            await createTransactionHistory(
              tokenId,
              parseFloat(value),
              balanceInEther,
              "Reader borrow book",
              "Độc giả mượn sách",
              transactionHash,
              renterAddress,
              borrowerAddress,
              `Total price received = ${parseFloat(value)} ETH`,
              `Tổng tiền nhận = ${parseFloat(value)} ETH`
            );
          };

          await createTransactionHistoryForBorrower(
            account.data!,
            renter,
            value.toString(),
            gasFee,
            receipt.transactionHash
          );
          await createTransactionHistoryForRenter(
            account.data!,
            renter,
            value.toString(),
            receipt.transactionHash
          );
        }

        await createBookHistoryCallback(tokenId, price, amount);
      } catch (e: any) {
        console.error(e.message);
        toast.error(`${e.message.substr(0, 65)}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    },
    [account.data, bookStoreContract, provider]
  );

  const createBookHistoryCallback = useCallback(
    async (tokenId: number, price: number, amount: number) => {
      if (account.data) {
        await createBookHistory(
          tokenId,
          "Borrow",
          "Mượn",
          account.data,
          price,
          amount
        );
      }
    },
    [account.data]
  );

  useEffect(() => {
    const total = currentAmount * currentRentalDays * price;
    setTotalPayment(total);
  }, [currentAmount, currentRentalDays, price]);

  const onSubmit = async (data: any) => {
    try {
      const rentalDuration = daysToSeconds(data.rentalDays);
      await borrowBooks(
        tokenId,
        renter,
        price,
        data.amount,
        rentalDuration,
        supplyAmount
      );
    } catch (e: any) {
      console.error(e.message);
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
      <Button
        variant="contained"
        sx={{ flexGrow: 1, borderTopLeftRadius: 0 }}
        onClick={handleBookCardClick}
      >
        {t("rentNowBtn") as string}
      </Button>

      <Dialog
        title={t("rentNowTitle") as string}
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
                <Typography>{renterName}</Typography>
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
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 1, sm: 2, md: 4 }}
                >
                  <Box sx={{ width: "100%" }}>
                    <FormGroup label={t("amount") as string} required>
                      <NumericStepperController name="amount" />
                    </FormGroup>
                    <Typography>
                      {supplyAmount} {t("left") as string}
                    </Typography>
                  </Box>
                  <FormGroup label={t("rentalDays") as string} required>
                    <NumericStepperController name="rentalDays" />
                  </FormGroup>
                </Stack>
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

export default RentButton;
