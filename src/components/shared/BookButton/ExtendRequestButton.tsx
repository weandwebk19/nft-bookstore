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
import { StyledButton } from "@/styles/components/Button";
import { daysToSeconds } from "@/utils/timeConvert";

import Step1 from "../../ui/borrow/steps/Step1";
import Step2 from "../../ui/borrow/steps/Step2";

interface ExtendRequestButtonProps {
  tokenId: number;
  renter: string;
  startTime: number;
  endTime: number;
  supplyAmount: number;
}

const schema = yup
  .object({
    amount: yup
      .number()
      .min(1, `The price must be higher than 0.`)
      .typeError("Amount must be a number"),
    extendDays: yup
      .number()
      .min(1, `The day must be higher than 0.`)
      .typeError("Rental days must be a number")
  })
  .required();

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
  const [renterName, setRenterName] = useState();
  const { bookStoreContract } = useWeb3();
  const { account } = useAccount();
  const { metadata } = useMetadata(tokenId);

  const [anchorBookCard, setAnchorBookCard] = useState<Element | null>(null);
  const openBookCard = Boolean(anchorBookCard);

  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Balance checking", "Confirm purchase"];

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
        if (extendedTime < 604800) {
          return toast.error(`Extend time must be greater than 7 days.`, {
            position: toast.POSITION.TOP_CENTER
          });
        }
        if (extendedAmount > supplyAmount) {
          return toast.error(`Amount must be less than ${supplyAmount}.`, {
            position: toast.POSITION.TOP_CENTER
          });
        }
        if (account.data == renter) {
          return toast.error(
            "You are not allowed to extend the book borrowed by yourself.",
            {
              position: toast.POSITION.TOP_CENTER
            }
          );
        }

        const tx = await bookStoreContract?.requestExtendTimeOfBorrowedBooks(
          tokenId,
          renter,
          startTime,
          endTime,
          extendedAmount,
          extendedTime
        );

        const receipt: any = await toast.promise(tx!.wait(), {
          pending: "Processing transaction",
          success: "Request extend successfully.",
          error: "Processing error"
        });
      } catch (error: any) {
        console.error(error);
        toast.error(`${error.message}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    },
    [bookStoreContract, account.data]
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
        Extend
      </Button>

      <Dialog
        title="Make an Extension Request"
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
                <Typography>{supplyAmount} left</Typography>
              </Stack>
            </Grid>
            <Grid item md={8}>
              <Stack
                spacing={3}
                sx={{
                  mb: 5
                }}
              >
                <FormGroup label="Amount" required>
                  <TextFieldController name="amount" type="number" />
                </FormGroup>
                <FormGroup label="Extend for (day)" required>
                  <NumericStepperController name="extendDays" />
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
                  Request extend
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
