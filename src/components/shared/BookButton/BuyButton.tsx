import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
import { InputController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { Image } from "@/components/shared/Image";
import { StyledButton } from "@/styles/components/Button";

import Step1 from "../../ui/publishing/steps/Step1";
import Step2 from "../../ui/publishing/steps/Step2";

interface BuyButtonProps {
  tokenId: number;
  title: string;
  bookCover: string;
  author: string;
  price: number;
}

const schema = yup
  .object({
    amount: yup
      .number()
      .min(1, `The price must be higher than 0.`)
      .typeError("Amount must be a number")
  })
  .required();

const defaultValues = {
  price: 0,
  amount: 1,
  seller: "",
  tokenId: -1
};

const BuyButton = ({
  tokenId,
  bookCover,
  title,
  author,
  price
}: BuyButtonProps) => {
  const router = useRouter();
  const [authorName, setAuthorName] = useState();
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
        return <Step2 />;
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

  useEffect(() => {
    setValue("price", price);
    setValue("tokenId", tokenId);
    setValue("seller", author);
  }, [price, tokenId, author]);

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      const tx = await contract?.buyBooks(
        ethers.utils.parseEther(tokenId.toString()),
        data.seller,
        ethers.utils.parseEther(data.amount.toString()),
        {
          value: ethers.utils.parseEther(data.price.toString())
        }
      );

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Buy NftBook Token",
        success: "NftBook has ben bought",
        error: "Buy error"
      });

      console.log("receipt", receipt);
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (author) {
          const userRes = await axios.get(`/api/users/wallet/${author}`);

          if (userRes.data.success === true) {
            setAuthorName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [author]);

  return (
    <>
      <Button
        variant="contained"
        sx={{ flexGrow: 1, borderTopLeftRadius: 0 }}
        onClick={handleBookCardClick}
      >
        Buy now
      </Button>

      <Dialog
        title="Buy book"
        open={openBookCard}
        onClose={handleBookCardClose}
      >
        <FormProvider {...methods}>
          {/* <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
            <Grid item md={4}>
              <Stack>
                <Box
                  component="img"
                  className={styles["book-item__book-cover"]}
                  src={bookCover}
                  alt={title}
                  sx={{ width: "100%" }}
                />
                <Typography variant="h5">{title}</Typography>
                <Typography>{authorName}</Typography>
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
                  <InputController name="price" type="number" />
                </FormGroup>
                <FormGroup label="Amount" required>
                  <InputController name="amount" type="number" />
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
          </Grid> */}
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
            >
              <Image
                src={bookCover}
                alt={title}
                sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                className={styles["book-item__book-cover"]}
              />
              <Box>
                <Typography variant="h5">{title}</Typography>
                <Typography>{authorName}</Typography>
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
                      Successfully purchased! Checkout your new book...
                    </Typography>
                    <StyledButton
                      onClick={() => {
                        router.push("/account/bookshelf/owned-books");
                      }}
                    >
                      My owned books
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
                        Back
                      </Button>
                      {activeStep === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSubmit(onSubmit)}
                        >
                          Confirm purchase
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                        >
                          Next
                        </Button>
                      )}
                    </Box>
                  </>
                )}
              </div>
            </Stack>
          </Stack>
        </FormProvider>
      </Dialog>
    </>
  );
};

export default BuyButton;