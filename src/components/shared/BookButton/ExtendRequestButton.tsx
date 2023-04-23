import { useEffect, useState } from "react";
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
  title: string;
  bookCover: string;
  renter: string;
  price: number;
  supplyAmount: number;
  borrowBooks: (
    tokenId: number,
    renter: string,
    price: number,
    amount: number,
    rentalDuration: number
  ) => Promise<void>;
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

const ExtendRequestButton = ({
  tokenId,
  bookCover,
  title,
  renter,
  price,
  supplyAmount,
  borrowBooks
}: ExtendRequestButtonProps) => {
  const router = useRouter();
  const [renterName, setAuthorName] = useState();
  const { ethereum, contract } = useWeb3();

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

  const onSubmit = async (data: any) => {
    try {
      const rentalDuration = daysToSeconds(data.rentalDays);
      await borrowBooks(tokenId, renter, price, data.amount, rentalDuration);
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
        Rent now
      </Button>

      <Dialog title="Sell" open={openBookCard} onClose={handleBookCardClose}>
        <FormProvider {...methods}>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
            <Grid item md={4}>
              <Stack>
                <Image
                  src={bookCover}
                  alt={title}
                  sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                  className={styles["book-item__book-cover"]}
                />
                <Typography variant="h5">{title}</Typography>
                <Typography>{renter}</Typography>
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
                <FormGroup label="Listing price" required>
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
                  Start selling
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
