import { useEffect, useState } from "react";
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
import axios from "axios";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import * as yup from "yup";

import { NumericStepperController } from "@/components/shared/FormController";
import { ReadMore } from "@/components/shared/ReadMore";
import { StyledButton } from "@/styles/components/Button";
import { ListedBookCore, NftBookDetails } from "@/types/nftBook";

import { AddToWatchlistButton } from "../../BookButton";
import BuyButton from "../../BookButton/BuyButton";

interface BookBriefingProps {
  // bookCover: string;
  // tokenId: number;
  // bookSample?: string;
  // title: string;
  // authorName: string;
  // contractAddress: string | undefined;
  // listedCore?: ListedBookCore;
  // isOpenForSale?: boolean;
  // isOpenForTradeIn?: boolean;
  // isOpenForBorrow?: boolean;
  bookDetail?: NftBookDetails;
}

const BookBriefing = ({ bookDetail }: BookBriefingProps) => {
  const { t } = useTranslation("bookDetail");

  const theme = useTheme();
  const [authorName, setAuthorName] = useState<string>("");
  const isOpenForSale =
    bookDetail?.listedCore?.amount && bookDetail?.listedCore?.amount > 0
      ? true
      : false;
  const isOpenForTradeIn = false;
  const isOpenForBorrow = false;

  useEffect(() => {
    (async () => {
      try {
        if (bookDetail && bookDetail?.nftCore) {
          const userRes = await axios.get(
            `/api/users/wallet/${bookDetail.nftCore?.author}`
          );

          if (userRes.data.success === true) {
            setAuthorName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [bookDetail]);

  return (
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
                alt={bookDetail?.meta.title!}
                src={bookDetail?.meta.bookCover!}
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
                  Contract address:
                </Typography>
                <Box sx={{ wordWrap: "break-word", width: "100%" }}>
                  <Link href="#">{bookDetail?.info.contractAddress}</Link>
                </Box>
              </Stack>
            </Stack>
            {bookDetail?.meta.bookSample !== "" && (
              <StyledButton
                customVariant="secondary"
                sx={{ width: "100%" }}
                onClick={() => {
                  redirect(bookDetail?.meta.bookSample!);
                }}
              >
                Read sample
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
              <Typography variant="h4">{bookDetail?.meta.title}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>By</Typography>
              <Link href="#">
                <Typography variant="h6" color="secondary">
                  {authorName}
                </Typography>
              </Link>
            </Stack>
          </Box>
          <Stack spacing={3}>
            {isOpenForSale && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h4">
                  {bookDetail?.listedCore?.price?.toString()} ETH
                </Typography>
                {/* <Typography>(0.59489412 USD)</Typography> */}
              </Stack>
            )}
            {/* "Buy now" button [dep] / "Add to watchlist" button */}
            <Stack direction="row" spacing={2}>
              {isOpenForSale && (
                <BuyButton
                  tokenId={bookDetail?.nftCore.tokenId!}
                  title={bookDetail?.meta.title!}
                  bookCover={bookDetail?.meta.bookCover!}
                  seller={bookDetail?.listedCore?.seller!}
                  price={bookDetail?.listedCore?.price!}
                  supplyAmount={bookDetail?.listedCore?.amount!}
                />
              )}
              {/* <StyledButton customVariant="secondary">
                + Add to watchlist
              </StyledButton> */}
              <AddToWatchlistButton
                isFirstInButtonGroup
                bookId={bookDetail?.bookId!}
              />
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
        </Box>
      </Box>
    </Box>
  );
};

export default BookBriefing;
