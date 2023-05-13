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
import { InputController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { Image } from "@/components/shared/Image";
import { createTransactionHistory } from "@/components/utils";
import { getGasFee } from "@/components/utils/getGasFee";
import { StyledButton } from "@/styles/components/Button";

import Step1 from "../../ui/publishing/steps/Step1";
import Step2 from "../../ui/publishing/steps/Step2";

interface TakeButtonProps {
  tokenId: number;
  fromRenter: string;
  sharer: string;
  price: number;
  startTime: number;
  endTime: number;
  supplyAmount: number;
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
  const router = useRouter();
  const [sharerName, setSharerName] = useState();
  const { provider, bookStoreContract, bookSharingContract } = useWeb3();
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
          return toast.error(
            "You are not allowed to take the book shared or lent by yourself.",
            {
              position: toast.POSITION.TOP_CENTER
            }
          );
        }

        const idBooksOnSharing = await bookSharingContract!.getIdBookOnSharing(
          tokenId,
          fromRenter,
          sharer,
          startTime,
          endTime
        );

        console.log("idBooksOnSharing", idBooksOnSharing.toNumber());
        console.log("price", price);

        const tx = await bookStoreContract?.takeBooksOnSharing(
          idBooksOnSharing,
          {
            value: ethers.utils.parseEther(price.toString())
          }
        );

        const receipt: any = await toast.promise(tx!.wait(), {
          pending: "Processing transaction",
          success: "Nft Book is yours! Go to Profile page",
          error: "Processing error"
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
              transactionHash,
              sharedPerAddress,
              sharerAddress,
              `Gas fee = ${gasFee}, take book fee = ${price}, total price = ${-totalFee} ETH`
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
              "From share book",
              transactionHash,
              sharerAddress,
              sharedPerAddress,
              `Total price received = ${price} ETH`
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
        console.error(error);
        toast.error(`${error.message.substr(0, 65)}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    },
    [account.data, bookSharingContract, bookStoreContract, provider]
  );

  const onSubmit = async (data: any) => {
    await takeBooks(tokenId, price, fromRenter, sharer, startTime, endTime);
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
        Take now
      </Button>

      <Dialog
        title="Take book on share"
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
                <Typography>{sharerName}</Typography>
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
                src={metadata?.data?.bookCover}
                alt={metadata?.data?.title}
                sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                className={styles["book-item__book-cover"]}
              />
              <Box>
                <Typography variant="h5">{metadata?.data?.title}</Typography>
                <Typography>{sharerName}</Typography>
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
        <ToastContainer />
      </Dialog>
    </>
  );
};

export default TakeButton;
