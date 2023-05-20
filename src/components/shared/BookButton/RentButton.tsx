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
import { useRouter } from "next/router";
import * as yup from "yup";

import { useAccount, useMetadata } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import {
  NumericStepperController,
  TextFieldController
} from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { Image } from "@/components/shared/Image";
import { createTransactionHistory } from "@/components/utils";
import { getGasFee } from "@/components/utils/getGasFee";
import { StyledButton } from "@/styles/components/Button";
import { daysToSeconds } from "@/utils/timeConvert";

import Step1 from "../../ui/borrow/steps/Step1";
import Step2 from "../../ui/borrow/steps/Step2";

interface RentButtonProps {
  tokenId: number;
  renter: string;
  price: number;
  supplyAmount: number;
}

const schema = yup
  .object({
    amount: yup
      .number()
      .min(1, `The price must be higher than 0.`)
      .typeError("Amount must be a number"),
    rentalDays: yup
      .number()
      .min(1, `The day must be higher than 0.`)
      .typeError("Rental days must be a number")
  })
  .required();

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
  const [renterName, setRenterName] = useState();
  const { provider, bookStoreContract } = useWeb3();
  const { account } = useAccount();
  const { metadata } = useMetadata(tokenId);

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
          return toast.error("Minimum borrow book period is 7 days", {
            position: toast.POSITION.TOP_CENTER
          });
        } else if (amount > supplyAmount) {
          return toast.error(`Amount must be less than ${supplyAmount}.`, {
            position: toast.POSITION.TOP_CENTER
          });
        } else if (account.data == renter) {
          return toast.error(
            "You are not allowed to borrow the book lent by yourself.",
            {
              position: toast.POSITION.TOP_CENTER
            }
          );
        }

        const value = ((price * amount * rentalDuration) / 604800).toFixed(3);
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
          pending: "Processing transaction",
          success: "Nft is yours! Go to Profile page",
          error: "Processing error"
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
              transactionHash,
              borrowerAddress,
              renterAddress,
              `Gas fee = ${gasFee} ETH, borrow fee = ${parseFloat(
                value
              )} ETH, total price = ${-totalFee} ETH`
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
              "From borrow book",
              transactionHash,
              renterAddress,
              borrowerAddress,
              `Total price received = ${parseFloat(value)} ETH`
            );
          };

          await createTransactionHistoryForBorrower(
            account.data!,
            renter,
            value,
            gasFee,
            receipt.transactionHash
          );
          await createTransactionHistoryForRenter(
            account.data!,
            renter,
            value,
            receipt.transactionHash
          );
        }
      } catch (e: any) {
        console.error(e.message);
        toast.error(`${e.message.substr(0, 65)}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    },
    [account.data, bookStoreContract, provider]
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
        Rent now
      </Button>

      <Dialog
        title="Rent book"
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
                    <FormGroup label="Amount" required>
                      <NumericStepperController name="amount" />
                    </FormGroup>
                    <Typography>{supplyAmount} left</Typography>
                  </Box>
                  <FormGroup label="Number of rental days" required>
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
                <Typography>Total:</Typography>
                <Typography variant="h6">{totalPayment} ETH</Typography>
              </Stack>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ textAlign: "end" }}
              >
                Gas fee not included
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <StyledButton
                  customVariant="secondary"
                  sx={{ mr: 2 }}
                  onClick={handleBookCardClose}
                >
                  Cancel
                </StyledButton>
                <StyledButton onClick={handleSubmit(onSubmit)}>
                  Confirm purchase
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
