import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Link,
  Skeleton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import axios from "axios";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

import {
  useAccount,
  useNftBookMeta,
  useNftBookSelling
} from "@/components/hooks/web3";

import { AddToWatchlistButton } from "../../BookButton";
import BuyButton from "../../BookButton/BuyButton";

const BookBriefing = () => {
  const { t } = useTranslation("bookDetail");
  const { account } = useAccount();
  const router = useRouter();
  const { bookId, seller } = router.query;
  const [authorName, setAuthorName] = useState<string>("");
  const [tokenId, setTokenId] = useState();
  const { nftBookMeta } = useNftBookMeta(bookId as string);
  const { nftBookSelling } = useNftBookSelling({
    bookId: bookId as string,
    seller: seller as string
  });

  const theme = useTheme();
  const isOpenForSale =
    nftBookSelling.data?.amount && nftBookSelling.data?.amount > 0
      ? true
      : false;
  const isOpenForPurchase = false;
  const isOpenForBorrow = false;

  useEffect(() => {
    (async () => {
      try {
        if (bookId) {
          const tokenRes = await axios.get(`/api/books/${bookId}/tokenId`);

          if (tokenRes.data.success === true) {
            setTokenId(tokenRes.data.data);
          }
        }
      } catch (err) {
        console.log("Something went wrong, please try again later!");
      }
    })();
  }, [bookId]);

  useEffect(() => {
    (async () => {
      try {
        if (nftBookMeta.data) {
          const userRes = await axios.get(
            `/api/authors/wallet/${nftBookMeta.data.author}`
          );

          if (userRes.data.success === true) {
            setAuthorName(userRes.data.data.pseudonym);
          }
        }
      } catch (err) {
        console.log("Something went wrong, please try again later!");
      }
    })();
  }, [nftBookMeta.data]);

  return (
    <Box className="hide-scrollbar">
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: "80%",
            height: "100%",
            position: "relative"
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

          {(() => {
            if (nftBookMeta.isLoading) {
              return (
                <Skeleton variant="rectangular" width="100%" height="100%" />
              );
            }
            return (
              <Image
                alt={nftBookMeta.data?.title}
                src={nftBookMeta.data?.bookCover}
                fill
                style={{
                  objectFit: "cover"
                }}
              />
            );
          })()}
        </div>
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 0
        }}
      >
        {nftBookMeta.data?.bookSample !== "" && (
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            onClick={() => {
              redirect(nftBookMeta.data?.bookSample);
            }}
          >
            {t("readSample")}
          </Button>
        )}
      </Box>

      <Box>
        <Box
          sx={{
            pt: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between"
          }}
        >
          <Box>
            <Stack spacing={1}>
              {/* Title */}
              <Typography variant="h5">{nftBookMeta.data?.title}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>{t("by")}</Typography>
              <Link href={`/author/profile/${nftBookMeta.data?.author}`}>
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
                  {nftBookSelling.data?.price?.toString()} ETH
                </Typography>
                {/* <Typography>(0.59489412 USD)</Typography> */}
              </Stack>
            )}

            {/* "Buy now" button [dep] / "Add to watchlist" button */}
            <Stack direction="row" spacing={2}>
              {isOpenForSale && (
                <BuyButton
                  tokenId={nftBookSelling.data?.tokenId}
                  seller={nftBookSelling.data?.seller}
                  price={nftBookSelling.data?.price}
                  supplyAmount={nftBookSelling.data?.amount}
                />
              )}

              {/* <StyledButton customVariant="secondary">
                + Add to watchlist
              </StyledButton> */}
              <Tooltip title="Add to watchlist">
                {tokenId ? <AddToWatchlistButton tokenId={tokenId} /> : <></>}
              </Tooltip>

              {/* Publishing/Borrow navigate */}
              {isOpenForBorrow && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography>You don’t want to own this book?</Typography>
                  <Link href="books">Go to borrow</Link>
                </Stack>
              )}
              {isOpenForPurchase && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography>This book is open for purchase</Typography>
                  <Link href="#">Go to publishing</Link>
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
