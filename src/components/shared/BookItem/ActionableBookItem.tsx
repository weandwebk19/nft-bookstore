import { useEffect, useState } from "react";

import {
  Box,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import InventoryIcon from "@mui/icons-material/Inventory";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import TripOriginIcon from "@mui/icons-material/TripOrigin";

import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useAccount } from "wagmi";

import { useMetadata } from "@/components/hooks/web3";

import { Image } from "../Image";
import { NumericContainer } from "../NumericContainer";

type ActionableBookItemStatus =
  | "isCreated"
  | "isOwned"
  | "isShared"
  | "isBorrowed"
  | "isSharing"
  | "isListing"
  | "isLending"
  | "isPurchased";

interface ActionableBookItemProps {
  tokenId: number;
  author?: string; // !!! 'author' should ALWAYS be display !!!  => /// In some cases, we can use seller instead
  onClick: (tokenId: number) => void;
  buttons?: React.ReactNode;
  seller?: string;
  renter?: string;
  borrower?: string;
  status?: ActionableBookItemStatus;
  countDown?: string;
  price?: string | number;
  quantity?: number;
  amountOwned?: number;
  amountTradeable?: number;
  amount?: number;
  sharer?: string;
  sharedPerson?: string;
  isApproved?: boolean;
}

const ActionableBookItem = ({
  tokenId,
  author,
  onClick,
  buttons,
  seller,
  renter,
  borrower,
  status,
  countDown,
  price,
  quantity,
  amountOwned,
  amountTradeable,
  amount,
  sharer,
  sharedPerson,
  isApproved
}: ActionableBookItemProps) => {
  const { t } = useTranslation("bookButtons");

  const account = useAccount();

  const theme = useTheme();
  const [authorName, setAuthorName] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sharerName, setSharerName] = useState("");
  const [renterName, setRenterName] = useState("");
  const [sharedPersonName, setSharedPersonName] = useState("");
  const [borrowerName, setBorrowerName] = useState("");

  const { metadata } = useMetadata(tokenId);

  useEffect(() => {
    (async () => {
      try {
        if (author) {
          const userRes = await axios.get(`/api/authors/wallet/${author}`);

          if (userRes.data.success === true) {
            setAuthorName(userRes.data.data.pseudonym);
          }
        }
      } catch (err) {
        console.log("Something went wrong, please try again later!");
      }
    })();
  }, [author]);

  useEffect(() => {
    (async () => {
      try {
        if (seller) {
          const userRes = await axios.get(`/api/users/wallet/${seller}`);

          if (userRes.data.success === true) {
            setSellerName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log("Something went wrong, please try again later!");
      }
    })();
  }, [seller]);

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

  useEffect(() => {
    (async () => {
      try {
        if (borrower) {
          const userRes = await axios.get(`/api/users/wallet/${borrower}`);

          if (userRes.data.success === true) {
            setBorrowerName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log("Something went wrong, please try again later!");
      }
    })();
  }, [borrower]);

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
        console.log("Something went wrong, please try again later!");
      }
    })();
  }, [sharer]);

  useEffect(() => {
    (async () => {
      try {
        if (sharedPerson) {
          const userRes = await axios.get(`/api/users/wallet/${sharedPerson}`);

          if (userRes.data.success === true) {
            setSharedPersonName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log("Something went wrong, please try again later!");
      }
    })();
  }, [sharedPerson]);

  return (
    <Box
      sx={{
        backgroundColor: `${theme.palette.background.default}`,
        borderRadius: "5px",
        height: "100%"
      }}
    >
      <Stack
        direction={{ xs: "column" }}
        sx={{
          height: "100%"
        }}
      >
        <Box
          sx={{ flexShrink: 0, aspectRatio: "1 / 1", cursor: "pointer" }}
          onClick={() => onClick(tokenId)}
        >
          {metadata.isLoading || !metadata || !metadata.data?.bookCover ? (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          ) : (
            <Image
              src={metadata.data?.bookCover}
              alt={metadata.data?.title}
              sx={{ flexShrink: 0, aspectRatio: "1 / 1" }}
              className={styles["book-item__book-cover"]}
            />
          )}
        </Box>
        <Stack
          justifyContent="space-between"
          sx={{
            p: 3,
            width: "100%",
            height: "100%"
          }}
        >
          <Stack>
            <Stack direction="row" spacing={0.5}>
              <InsertDriveFileIcon fontSize="small" color="action" />
              <Typography variant="caption">
                {metadata.data?.fileType}
              </Typography>
            </Stack>

            <Typography
              variant="h6"
              className="text-limit text-limit--2"
              sx={{ minHeight: "64px" }}
            >
              {metadata.data?.title}
            </Typography>

            <Stack spacing={1} mb={2}>
              {status !== "isCreated" && (
                <Typography variant="body2">{authorName}</Typography>
              )}

              {status === "isListing" ||
                (status === "isPurchased" && (
                  <Stack>
                    <Typography variant="subtitle2">
                      {t("soldBy") as string}:
                    </Typography>
                    <Typography variant="label">{sellerName}</Typography>
                  </Stack>
                ))}

              {status === "isBorrowed" && (
                <Stack>
                  <Typography variant="subtitle2">
                    {t("borrowedFrom") as string}:
                  </Typography>
                  <Typography variant="label">{renterName}</Typography>
                </Stack>
              )}
              {status === "isShared" && (
                <Stack>
                  <Typography variant="subtitle2">
                    {t("sharedBy") as string}:
                  </Typography>
                  <Typography variant="label">{sharerName}</Typography>
                </Stack>
              )}
              {status === "isLending" && renter && (
                <Tooltip title={renter}>
                  <Stack>
                    <Typography variant="subtitle2">
                      {t("borrowedFrom") as string}:
                    </Typography>
                    <Typography variant="label">{renterName}</Typography>
                  </Stack>
                </Tooltip>
              )}
              {status === "isLending" && borrower && (
                <Tooltip title={borrower}>
                  <Stack>
                    <Typography variant="subtitle2">
                      {t("borrowedBy") as string}:
                    </Typography>
                    <Typography variant="label">{borrowerName}</Typography>
                  </Stack>
                </Tooltip>
              )}
              {status === "isSharing" && renter && (
                <Stack>
                  <Typography variant="subtitle2">
                    {t("borrowedFrom") as string}:
                  </Typography>
                  <Typography variant="label">{renterName}</Typography>
                </Stack>
              )}
              {status === "isSharing" && sharedPerson && (
                <Stack>
                  <Typography variant="subtitle2">
                    {t("sharedTo") as string}:
                  </Typography>
                  <Typography variant="label">{sharedPersonName}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={2} mt={2}>
            {/* {status !== "isCreated" &&
              status !== "isOwned" &&
              status !== "isPurchased" &&
              status !== "isShared" &&
              status !== "isListing" &&
              status !== "isSharing" && (
                <NumericContainer
                  icon={<TripOriginIcon fontSize="inherit" color="action" />}
                  label={`${t("origSupply") as string}:`}
                  amount={quantity}
                />
              )} */}

            {(status === "isCreated" || status === "isOwned") && (
              <NumericContainer
                icon={<TripOriginIcon fontSize="inherit" color="action" />}
                label={`${t("origSupply") as string}:`}
                amount={quantity}
              />
            )}
            {(status === "isPurchased" ||
              status === "isLending" ||
              status === "isBorrowed" ||
              status === "isShared" ||
              status === "isSharing" ||
              status === "isListing") && (
              <NumericContainer
                icon={<InventoryIcon fontSize="inherit" color="action" />}
                label={`${t("inventory") as string}:`}
                amount={amount}
              />
            )}
            {(status === "isBorrowed" ||
              status === "isShared" ||
              status === "isSharing" ||
              (status === "isLending" && borrower)) && (
              <Stack>
                <Typography variant="subtitle2">
                  {t("returnIn") as string}:
                </Typography>
                <Typography variant="label">
                  {(countDown === "0D:0:0:0" || !countDown)
                    ? (t("ended") as string)
                    : countDown}
                </Typography>
              </Stack>
            )}
            {status === "isOwned" && (
              <NumericContainer
                icon={<InventoryIcon fontSize="inherit" color="action" />}
                label={`${t("inventory") as string}:`}
                amount={amountOwned}
              />
            )}
            {status !== "isCreated" &&
              status !== "isOwned" &&
              status !== "isPurchased" && (
                <Stack>
                  <Typography variant="subtitle2">
                    {t("price") as string}:
                  </Typography>
                  <Typography
                    variant="label"
                    color={`${theme.palette.success.main}`}
                  >
                    {price} ETH
                  </Typography>
                </Stack>
              )}
            {(status === "isOwned" ||
              status === "isCreated" ||
              status === "isPurchased") && (
              <NumericContainer
                variant="outlined"
                icon={<SellOutlinedIcon fontSize="inherit" color="action" />}
                label={`${t("tradeable") as string}:`}
                amount={amountTradeable}
              />
            )}

            {/* {status === "isCreated" && (
                <Stack>
                  <Typography variant="subtitle2">Tradeable amount:</Typography>
                  <Typography variant="label">{amountTradeable}</Typography>
                </Stack>
              )} */}
          </Stack>
          {/* <Stack direction="row" justifyContent="space-between">
              <Typography>{renter}</Typography>
              {status !== undefined ? <Chip label={status} /> : <></>}
            </Stack> */}

          {(() => {
            if (status === "isOwned" && (metadata.isLoading || !metadata)) {
              return (
                <Stack direction="row" spacing={0.5} mt={3}>
                  <Skeleton variant="rectangular" width="50%" height={36.5} />
                  <Skeleton variant="rectangular" width="50%" height={36.5} />
                </Stack>
              );
            } else if (isApproved === false) {
              return (
                <Chip
                  label={t("waitingForReview") as string}
                  sx={{
                    mt: 3,
                    color: `${theme.palette.common.black}`,
                    fontWeight: "bold",
                    lineHeight: "20px",
                    background: `linear-gradient(to right, ${theme.palette.common.black} 15%, ${theme.palette.common.white} 15%)`
                  }}
                />
              );
            } else {
              return (
                <Stack direction="row" spacing={2} mt={3}>
                  {buttons}
                </Stack>
              );
            }
          })()}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ActionableBookItem;
