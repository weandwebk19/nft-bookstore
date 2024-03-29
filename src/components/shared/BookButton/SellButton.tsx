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

import { usePricingHistory } from "@/components/hooks/api";
import { useAccount, useMetadata } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { TextFieldController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { createBookHistory } from "@/components/utils/createBookHistory";
import { StyledButton } from "@/styles/components/Button";
import { toastErrorTransaction } from "@/utils/toast";

import { createPricingHistory, createTransactionHistory } from "../../utils";
import { getGasFee } from "../../utils/getGasFee";
import { Image } from "../Image";

interface SellButtonProps {
  owner: string;
  tokenId: number;
  amountTradeable: number;
}

const defaultValues = {
  price: 0,
  amount: 1
};

const SellButton = ({ owner, tokenId, amountTradeable }: SellButtonProps) => {
  const { t } = useTranslation("bookButtons");

  const [ownerName, setOwnerName] = useState();
  const { provider, bookStoreContract } = useWeb3();
  const { metadata } = useMetadata(tokenId);
  const { account } = useAccount();
  const [bookId, setBookId] = useState();

  const schema = yup
    .object({
      price: yup
        .number()
        .min(0, t("textErrorSell1") as string)
        .typeError(t("textErrorSell2") as string),
      amount: yup
        .number()
        .min(1, t("textErrorSell3") as string)
        .typeError(t("textErrorSell4") as string)
    })
    .required();

  useEffect(() => {
    (async () => {
      // get bookId
      try {
        const bookRes = await axios.get(`/api/books/token/${tokenId}/bookId`);
        if (bookRes.data.success === true) {
          setBookId(bookRes.data.data);
        }
      } catch (err) {}
    })();
  }, [tokenId]);

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

  const { handleSubmit } = methods;
  const sellPricingHistory = usePricingHistory(
    bookId as unknown as string,
    "SELL"
  );

  const sellBooks = useCallback(
    async (
      tokenId: number,
      price: number,
      amount: number,
      amountTradeable: number
    ) => {
      try {
        // handle errors
        if (amount > amountTradeable) {
          return toast.error(
            `${t("textErrorSell5") as string} ${amountTradeable}.`,
            {
              position: toast.POSITION.TOP_CENTER
            }
          );
        }

        const listingPrice = await bookStoreContract!.listingPrice();
        const tx = await bookStoreContract?.sellBooks(
          tokenId,
          ethers.utils.parseEther(price.toString()),
          amount,
          {
            value: listingPrice
          }
        );

        const receipt: any = await toast.promise(tx!.wait(), {
          pending: t("pendingSell") as string,
          success: t("successSell") as string,
          error: t("errorSell") as string
        });

        if (receipt) {
          // create Transaction History For Seller
          const gasFee = await getGasFee(provider, receipt);
          // Caculate total fee
          const listingPriceNumber = parseFloat(
            ethers.utils.formatEther(listingPrice)
          );
          const totalFee = 0 - listingPriceNumber - parseFloat(gasFee);
          // Get current balance of account
          const balance = await provider?.getBalance(account.data!);
          const balanceInEther = ethers.utils.formatEther(balance!);
          await createTransactionHistory(
            tokenId,
            totalFee,
            balanceInEther,
            "Sell book",
            "Bán sách",
            receipt.transactionHash,
            receipt.from,
            receipt.to,
            `Gas fee = ${gasFee} ETH, listing fee =  ${listingPriceNumber} ETH, total fee = ${
              0 - totalFee
            } ETH`,
            `Phí gas= ${gasFee} ETH, Phí liệt kê =  ${listingPriceNumber} ETH, Tổng cộng = ${
              0 - totalFee
            } ETH`
          );
        }
      } catch (e: any) {
        toastErrorTransaction(e.message);
      }
    },
    [account.data, bookStoreContract, provider]
  );

  const createPricingHistoryCallback = useCallback(
    async (tokenId: number, price: number) => {
      if (account.data) {
        await createPricingHistory(tokenId, price, "SELL", account.data);
      }
    },
    [account.data]
  );

  const createBookHistoryCallback = useCallback(
    async (tokenId: number, price: number, amount: number) => {
      if (account.data) {
        await createBookHistory(
          tokenId,
          "Sale",
          "Bán",
          account.data,
          price,
          amount
        );
      }
    },
    [account.data]
  );

  const onSubmit = async (data: any) => {
    await sellBooks(tokenId, data.price, data.amount, amountTradeable);
    await createPricingHistoryCallback(tokenId, data.price);
    await createBookHistoryCallback(tokenId, data.price, data.amount);
  };

  useEffect(() => {
    (async () => {
      try {
        if (owner) {
          const userRes = await axios.get(`/api/users/wallet/${owner}`);

          if (userRes.data.success === true) {
            setOwnerName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log("Something went wrong, please try again later!");
      }
    })();
  }, [owner]);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        sx={{ width: "100%" }}
        onClick={handleBookCardClick}
      >
        {t("sellBtn") as string}
      </Button>

      <Dialog
        title={t("sellTitle") as string}
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
                <Typography>{ownerName}</Typography>
                <Typography>
                  {amountTradeable} {t("left") as string}
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
                {sellPricingHistory?.data?.lastest && (
                  <Stack spacing={2}>
                    <Typography variant="h6" mb={1}>
                      {t("pricingHistory$listing")}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Typography variant="label">{t("average")}:</Typography>
                      <Typography>
                        {sellPricingHistory.data.average} ETH
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Typography variant="label">{t("highest")}:</Typography>
                      <Typography>
                        {sellPricingHistory.data.highest} ETH
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Typography variant="label">{t("lowest")}:</Typography>
                      <Typography>
                        {sellPricingHistory.data.lowest} ETH
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                      <Typography variant="label">{t("lastest")}:</Typography>
                      <Typography>
                        {sellPricingHistory.data.lastest} ETH
                      </Typography>
                    </Stack>
                  </Stack>
                )}
                <FormGroup label={t("listingPrice") as string} required>
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
                  {t("startSellingBtn") as string}
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

export default SellButton;
