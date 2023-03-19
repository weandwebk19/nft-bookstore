import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";

import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { yupResolver } from "@hookform/resolvers/yup";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import * as yup from "yup";

import { useWeb3 } from "@/components/providers/web3";
import { StyledButton } from "@/styles/components/Button";

import { NumericStepperController } from "../../FormController";
import { ReadMore } from "../../ReadMore";
import { TimerGroup } from "../../TimerGroup";

interface BookBriefingProps {
  tokenId: number;
  bookSample?: string;
  title: string;
  author: string;
  authorName: string;
  contractAddress: string | undefined;
  description: string;
  price?: number;
  isOpenForSale?: boolean;
  isOpenForTradeIn?: boolean;
  isOpenForBorrow?: boolean;
  isSold?: boolean;
}

const schema = yup
  .object({
    amount: yup
      .number()
      .min(1, `Please select a minimum of 1 book to purchase.`)
  })
  .required();

const defaultValues = {
  tokenId: -1,
  seller: "",
  amount: 1,
  price: 0
};

const BookBriefing = ({
  tokenId,
  bookSample,
  title,
  author,
  authorName,
  contractAddress,
  description,
  price,
  isOpenForSale = false,
  isOpenForTradeIn,
  isOpenForBorrow,
  isSold
}: BookBriefingProps) => {
  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });
  const { ethereum, contract } = useWeb3();

  useEffect(() => {
    setValue("tokenId", tokenId);
    setValue("seller", author);
    setValue("price", price!);
  }, [tokenId, author, price]);

  const { handleSubmit, setValue } = methods;

  const onSubmit = async (data: any) => {
    console.log(data);
    // try {
    //   const tx = await contract?.buyBooks(tokenId, data.seller, data.amount, {
    //     value: ethers.utils.parseEther(data.price.toString())
    //   });

    //   const receipt: any = await toast.promise(tx!.wait(), {
    //     pending: "Minting NftBook Token",
    //     success: "NftBook has ben created",
    //     error: "Minting error"
    //   });

    //   console.log("receipt", receipt);
    // } catch (e: any) {
    //   console.error(e.message);
    // }
  };

  return (
    <FormProvider {...methods}>
      <form>
        <Stack spacing={3}>
          {/* Title */}
          <Typography variant="h2">{title}</Typography>

          {/* Attributes */}
          {/* {!isSold && (
        <Stack direction="row" spacing={2}>
          {meta?.attributes.map((stat, i) => {
            switch (stat.statType) {
              case "views":
                return (
                  <Stack key={stat.statType} direction="row" spacing={0.5}>
                    <VisibilityOutlinedIcon color="primary" />
                    <Typography>{`${stat.value} ${stat.statType}`}</Typography>
                  </Stack>
                );
              case "owners":
                return (
                  <Stack key={stat.statType} direction="row" spacing={0.5}>
                    <PeopleAltOutlinedIcon color="primary" />
                    <Typography>{`${stat.value} ${stat.statType}`}</Typography>
                  </Stack>
                );
              default:
                return "";
            }
          })}
        </Stack>
      )} */}

          {/* Author */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>By</Typography>
            <Link href="#">
              <Typography variant="h6" color="secondary">
                {authorName}
              </Typography>
            </Link>
          </Stack>
          {/* Contract address */}
          <Stack>
            <Typography variant="label" mb={1}>
              Contract address:
            </Typography>
            <Link href="#">{contractAddress}</Link>
          </Stack>
          {/* Description */}
          <Stack sx={{ maxWidth: "500px" }}>
            <Typography variant="label" mb={1}>
              Description:
            </Typography>
            {/* <>
              {details?.desc.split("\n").map((paragraph, i) => (
                <Typography key={i} gutterBottom>
                  {paragraph}
                </Typography>
              ))}
            </> */}
            {/* <ReadMore>{details!.desc}</ReadMore> */}

            <ReadMore>
              {description?.split("\n").map((paragraph, i) => (
                <Typography key={i} gutterBottom>
                  {paragraph}
                </Typography>
              ))}
            </ReadMore>
          </Stack>
          {/* Read sample */}
          {bookSample && (
            <StyledButton
              customVariant="secondary"
              size="small"
              onClick={() => {
                alert(`book sample link:\n ${bookSample}`);
              }}
            >
              Read sample
            </StyledButton>
          )}
          {/* Countdown [dep] */}
          {isOpenForSale && (
            <>
              <Stack>
                <Typography variant="label" mb={1}>
                  Registration closes in:
                </Typography>
                {/* <TimerGroup endDate="2023/03/12" /> */}
              </Stack>

              {/* Numeric Stepper [dep] */}
              <NumericStepperController
                name="amount"
                defaultValue={defaultValues.amount}
              />

              {/* Price [dep] */}
              {!isSold && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h4">{price?.toString()} ETH</Typography>
                  <Typography>(0.59489412 USD)</Typography>
                </Stack>
              )}
            </>
          )}
          {/* "Buy now" button [dep] / "Add to watchlist" button */}
          <Stack direction="row" spacing={2}>
            {isOpenForSale && (
              <StyledButton
                customVariant="primary"
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Buy now
              </StyledButton>
            )}
            <StyledButton customVariant="secondary">
              + Add to watchlist
            </StyledButton>
            <Tooltip title="Add to favorites">
              <IconButton>
                <BookmarkAddOutlinedIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Stack>
          {/* Trade-in/Borrow navigate */}
          <Stack>
            {isOpenForBorrow && (
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>You don’t want to own this book?</Typography>
                <Link href="books">Go to borrow</Link>
              </Stack>
            )}
            {isOpenForTradeIn && (
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography>This book is open for trade</Typography>
                <Link href="#">Go to trade-in</Link>
              </Stack>
            )}
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
};

export default BookBriefing;
