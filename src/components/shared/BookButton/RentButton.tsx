import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  Divider,
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
import { useRouter } from "next/router";
import * as yup from "yup";

import { useAccount, useMetadata } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
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

  const router = useRouter();
  const [renterName, setAuthorName] = useState();
  const { provider, bookStoreContract } = useWeb3();
  const { account } = useAccount();
  const { metadata } = useMetadata(tokenId);

  const [anchorBookCard, setAnchorBookCard] = useState<Element | null>(null);
  const openBookCard = Boolean(anchorBookCard);

  const [activeStep, setActiveStep] = useState(0);

  const steps = [t("stepRent1") as string, t("stepRent2") as string];

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

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 supplyAmount={supplyAmount} />;
      default:
        return null;
    }
  };

  const handleNext = async () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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

  const { handleSubmit, setValue } = methods;

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
            setAuthorName(userRes.data.data.fullname);
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
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
            >
              <Image
                src={metadata.data?.bookCover}
                alt={metadata.data?.title}
                sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                className={styles["book-item__book-cover"]}
              />
              <Box>
                <Typography variant="h5">{metadata.data?.title}</Typography>
                <Typography>{renterName}</Typography>
                <Typography variant="h4">{price} ETH</Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack flexGrow={1}>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                  return (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <div style={{ minHeight: "50%" }}>
                {activeStep === steps.length ? (
                  <>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      {t("textRentNow1") as string}
                    </Typography>
                    <StyledButton
                      onClick={() => {
                        router.push("/account/bookshelf/owned-books");
                      }}
                    >
                      {t("myBorrowedBooksBtn") as string}
                    </StyledButton>
                  </>
                ) : (
                  <>
                    <Box my={2} sx={{ minHeight: "25vh" }}>
                      {getStepContent()}
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="center"
                      style={{ paddingTop: "5vh" }}
                    >
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        {t("backBtn") as string}
                      </Button>
                      {activeStep === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSubmit(onSubmit)}
                        >
                          {t("confirmPurchaseBtn") as string}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                        >
                          {t("nextBtn") as string}
                        </Button>
                      )}
                    </Box>
                  </>
                )}
              </div>
            </Stack>
          </Stack>
        </FormProvider>
        <ToastContainer />
      </Dialog>
    </>
  );
};

export default RentButton;
