/* eslint-disable prettier/prettier */
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
import {
  createTransactionHistory,
  createTransactionHistoryOnlyGasFee
} from "@/components/utils";
import { getGasFee } from "@/components/utils/getGasFee";
import { StyledButton } from "@/styles/components/Button";
import { daysToSeconds } from "@/utils/timeConvert";
import Step1 from "../../ui/borrow/steps/Step1";
import Step2 from "../../ui/borrow/steps/Step2";
import { toastErrorTransaction } from "@/utils/toast";
import { MIN_DURATION_TIME } from "@/utils/constants";

interface ExtendRequestButtonProps {
  tokenId: number;
  renter: string;
  startTime: number;
  endTime: number;
  supplyAmount: number;
}

const defaultValues = {
  amount: 1,
  extendDays: 7
};

const ExtendRequestButton = ({
  tokenId,
  renter,
  startTime,
  endTime,
  supplyAmount
}: ExtendRequestButtonProps) => {
  const { t } = useTranslation("bookButtons");

  const [renterName, setRenterName] = useState();
  const { provider, bookStoreContract, bookRentingContract } = useWeb3();
  const { account } = useAccount();
  const { metadata } = useMetadata(tokenId);

  const [anchorBookCard, setAnchorBookCard] = useState<Element | null>(null);
  const openBookCard = Boolean(anchorBookCard);

  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Balance checking", "Confirm purchase"];

  const schema = yup
    .object({
      amount: yup
        .number()
        .min(1, t("textErrorExtend1") as string)
        .typeError(t("textErrorExtend2") as string),
      extendDays: yup
        .number()
        .min(1, t("textErrorExtend3") as string)
        .typeError(t("textErrorExtend4") as string)
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

  const requestExtendTime = useCallback(
    async (
      tokenId: number,
      renter: string,
      startTime: number,
      endTime: number,
      extendedAmount: number,
      extendedTime: number
    ) => {
      try {
        // Handle errors
        if (extendedTime < MIN_DURATION_TIME) {
          return toast.error(t("textErrorExtend5") as string, {
            position: toast.POSITION.TOP_CENTER
          });
        }
        if (extendedAmount > supplyAmount) {
          return toast.error(
            `${t("textErrorExtend6") as string} ${supplyAmount}.`,
            {
              position: toast.POSITION.TOP_CENTER
            }
          );
        }
        if (account.data == renter) {
          return toast.error(t("textErrorExtend7") as string, {
            position: toast.POSITION.TOP_CENTER
          });
        }

        const idBorrowedBook = await bookRentingContract?.getIdBorrowedBook(
          tokenId,
          renter,
          account.data!,
          startTime,
          endTime
        );

        const isRequestExist = await bookRentingContract?.isRequestExist(
          idBorrowedBook!.toNumber(),
          account.data!,
          renter
        );

        let tx;
        if (!isRequestExist) {
          tx = await bookStoreContract?.requestExtendTimeOfBorrowedBooks(
            tokenId,
            renter,
            startTime,
            endTime,
            extendedAmount,
            extendedTime
          );
        } else {
          tx = await bookStoreContract?.updateRequestOfBorrowedBooks(
            tokenId,
            renter,
            startTime,
            endTime,
            extendedAmount,
            extendedTime
          );
        }

        const receipt: any = await toast.promise(tx!.wait(), {
          pending: t("pendingExtend") as string,
          success: t("successExtend") as string,
          error: t("errorExtend") as string
        });

        if (receipt) {
          await createTransactionHistoryOnlyGasFee(
            provider,
            receipt,
            tokenId,
            "Request extend borrowed book",
            "Yêu cầu gia hạn sách đang mượn"
          );
        }
      } catch (e: any) {
        toastErrorTransaction(e.message);
      }
    },
    [supplyAmount, account.data, bookStoreContract, provider]
  );

  const onSubmit = async (data: any) => {
    try {
      const extendedTime = daysToSeconds(data.extendDays);
      await requestExtendTime(
        tokenId,
        renter,
        startTime,
        endTime,
        data.amount,
        extendedTime
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
        console.log("Something went wrong, please try again later!");
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
        {t("extendBtn") as string}
      </Button>

      <Dialog
        title={t("extendTitle") as string}
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
                  {supplyAmount} {t("left") as string}
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
                <FormGroup label={t("amount") as string} required>
                  <TextFieldController name="amount" type="number" />
                </FormGroup>
                <FormGroup label={t("extendDays") as string} required>
                  <NumericStepperController name="extendDays" />
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
                  {t("requestExtendBtn") as string}
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

export default ExtendRequestButton;
