import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  Box,
  Grid,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import * as yup from "yup";

import { NumericStepperController } from "@/components/shared/FormController";
import { ReadMore } from "@/components/shared/ReadMore";
import { StyledButton } from "@/styles/components/Button";

interface BookBriefingProps {
  bookCover: string;
  tokenId: number;
  bookSample?: string;
  title: string;
  author: string;
  authorName: string;
  contractAddress: string | undefined;
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
  bookCover,
  tokenId,
  bookSample,
  title,
  author,
  authorName,
  contractAddress,
  price,
  isOpenForSale,
  isOpenForTradeIn,
  isOpenForBorrow,
  isSold
}: BookBriefingProps) => {
  const { t } = useTranslation("bookDetail");

  const theme = useTheme();

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  useEffect(() => {
    setValue("tokenId", tokenId);
    setValue("seller", author);
    setValue("price", price!);
  }, [tokenId, author, price]);

  const { handleSubmit, setValue } = methods;

  const onSubmit = async (data: any) => {};

  return (
    <FormProvider {...methods}>
      <Box
        className="hide-scrollbar"
        sx={{
          border: `1px solid ${theme.palette.primary.main}`,
          position: "sticky",
          top: 64,

          overflowY: { sm: "scroll" },
          height: { sm: "90vh" }
        }}
      >
        <Grid
          container
          columns={{ xs: 4, sm: 5, md: 5 }}
          sx={{ borderBottom: "1px solid" }}
        >
          <Grid item xs={4} sm={5} md={3}>
            <Box sx={{ height: "60vh" }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  borderRight: "1px solid"
                }}
              >
                {/* Attributes */}

                {/* <Stack direction="row" spacing={2}>
                  {meta?.attributes.map((stat, i) => {
                    switch (stat.statType) {
                      case "views":
                        return (
                          <Stack
                            key={stat.statType}
                            direction="row"
                            spacing={0.5}
                          >
                            <VisibilityOutlinedIcon color="primary" />
                            <Typography>{`${stat.value} ${stat.statType}`}</Typography>
                          </Stack>
                        );
                      case "owners":
                        return (
                          <Stack
                            key={stat.statType}
                            direction="row"
                            spacing={0.5}
                          >
                            <PeopleAltOutlinedIcon color="primary" />
                            <Typography>{`${stat.value} ${stat.statType}`}</Typography>
                          </Stack>
                        );
                      default:
                        return "";
                    }
                  })}
                </Stack> */}

                <Image
                  alt={title}
                  src={bookCover}
                  fill
                  style={{
                    objectFit: "cover"
                  }}
                />
              </div>
            </Box>
          </Grid>
          <Grid item xs={4} sm={5} md={2} sx={{ p: 3 }}>
            <Stack justifyContent="space-between" sx={{ height: "100%" }}>
              <Stack>
                <Stack sx={{ flexWrap: "wrap" }}>
                  <Typography variant="label" mb={1}>
                    {t("contractAddress")}:
                  </Typography>
                  <Box sx={{ wordWrap: "break-word", width: "100%" }}>
                    <Link href="#">{contractAddress}</Link>
                  </Box>
                </Stack>
              </Stack>
              {bookSample !== "" && (
                <StyledButton
                  customVariant="secondary"
                  sx={{ width: "100%" }}
                  onClick={() => {
                    redirect(bookSample!);
                  }}
                >
                  {t("readSample")}
                </StyledButton>
              )}
            </Stack>
          </Grid>
        </Grid>
        <Box sx={{ height: "30vh", p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between"
            }}
          >
            <Box>
              <Stack spacing={1}>
                {/* Title */}
                <Typography variant="h4">{title}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>{t("author")}</Typography>
                <Link href="#">
                  <Typography variant="h6" color="secondary">
                    {authorName}
                  </Typography>
                </Link>
              </Stack>
            </Box>
            <Stack spacing={3}>
              {isOpenForSale && (
                <>
                  {/* Numeric Stepper [dep] */}
                  <NumericStepperController
                    name="amount"
                    defaultValue={defaultValues.amount}
                  />

                  {/* Price [dep] */}
                  {!isSold && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h4">
                        {price?.toString()} ETH
                      </Typography>
                      {/* <Typography>(0.59489412 USD)</Typography> */}
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
                    {t("buyNow")}
                  </StyledButton>
                )}
                <StyledButton customVariant="secondary">
                  {t("addToWatchlist")}
                </StyledButton>
                <Tooltip title="Add to favorites">
                  <IconButton>
                    <BookmarkAddOutlinedIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Stack>
              {/* Trade-in/Borrow navigate */}
              <Stack>
                {!isOpenForBorrow && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography>{t("borrowMessage")}</Typography>
                    <Link href="books">{t("goToBorrow")}</Link>
                  </Stack>
                )}
                {!isOpenForTradeIn && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography>{t("tradeInMessage")}</Typography>
                    <Link href="#">{t("goToTradeIn")}</Link>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
};

export default BookBriefing;
