import { useEffect, useState } from "react";

import { Box, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { useAccount } from "wagmi";

import { Image } from "../Image";

type ActionableBookItemStatus =
  | "isCreated"
  | "isOwned"
  | "isShared"
  | "isBorrowed"
  | "isSharing"
  | "isListing"
  | "isLeasing"
  | "isBought";

interface ActionableBookItemProps {
  bookCover: string;
  title: string;
  fileType: string;
  tokenId: number;
  author?: string; // !!! 'author' should ALWAYS be display !!!
  onClick: (tokenId: number) => void;
  buttons?: React.ReactNode;
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
}

const ActionableBookItem = ({
  bookCover,
  title,
  fileType,
  tokenId,
  author,
  onClick,
  buttons,
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
  sharedPerson
}: ActionableBookItemProps) => {
  const account = useAccount();

  const theme = useTheme();
  const [authorName, setAuthorName] = useState("");
  const [sharerName, setSharerName] = useState("");
  const [renterName, setRenterName] = useState("");
  const [sharedPersonName, setSharedPersonName] = useState("");
  const [borrowerName, setBorrowerName] = useState("");

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
        console.log(err);
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
        console.log(err);
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
        console.log(err);
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
          <Image
            src={bookCover}
            alt={title}
            sx={{ flexShrink: 0, aspectRatio: "1 / 1" }}
            className={styles["book-item__book-cover"]}
          />
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
              <Typography variant="caption">{fileType}</Typography>
            </Stack>
            <Typography
              variant="h6"
              className="text-limit text-limit--2"
              sx={{ minHeight: "64px" }}
            >
              {title}
            </Typography>
            {status !== "isCreated" && (
              <Typography variant="body2">{authorName}</Typography>
            )}
            {status === "isBorrowed" && (
              <Stack>
                <Typography variant="subtitle2">Borrowed from:</Typography>
                <Typography variant="label">{renterName}</Typography>
              </Stack>
            )}
            {status === "isShared" && (
              <Stack>
                <Typography variant="subtitle2">Shared by:</Typography>
                <Typography variant="label">{sharerName}</Typography>
              </Stack>
            )}
            {status === "isLeasing" && borrower && (
              <Stack>
                <Typography variant="subtitle2">Borrowed by:</Typography>
                <Typography variant="label">{borrowerName}</Typography>
              </Stack>
            )}
            {status === "isSharing" && (
              <Stack>
                <Typography variant="subtitle2">Shared to:</Typography>
                <Typography variant="label">{sharedPersonName}</Typography>
              </Stack>
            )}
          </Stack>

          <Divider />
          <Stack spacing={3}>
            <Stack spacing={{ xs: 1, sm: 2, md: 4 }}>
              <Stack
                direction={{ xs: "row", sm: "row", md: "row" }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                justifyContent="space-between"
              >
                {status !== "isCreated" &&
                  status !== "isOwned" &&
                  status !== "isBought" && (
                    <Stack>
                      <Typography variant="subtitle2">Price:</Typography>
                      <Typography variant="label">{price} ETH</Typography>
                    </Stack>
                  )}
                {status !== "isCreated" &&
                  status !== "isOwned" &&
                  status === "isBought" && (
                    <Stack>
                      <Typography variant="subtitle2">Amount:</Typography>
                      <Typography variant="label">{amount}</Typography>
                    </Stack>
                  )}
              </Stack>
              {(status === "isBorrowed" ||
                status === "isShared" ||
                status === "isSharing" ||
                (status === "isLeasing" && borrower)) && (
                <Stack>
                  <Typography variant="subtitle2">Return in:</Typography>
                  <Typography variant="label">
                    {countDown !== "0D:0:0:0" ? countDown : "Ended"}
                  </Typography>
                </Stack>
              )}
              {status === "isOwned" && (
                <Stack>
                  <Typography variant="subtitle2">Owned amount:</Typography>
                  <Typography variant="label">{amountOwned}</Typography>
                </Stack>
              )}
              {(status === "isOwned" ||
                status === "isCreated" ||
                status === "isBought") && (
                <Stack>
                  <Typography variant="subtitle2">Tradeable amount:</Typography>
                  <Typography variant="label">{amountTradeable}</Typography>
                </Stack>
              )}
              {status === "isCreated" && (
                <Stack>
                  <Typography variant="subtitle2">Quantity:</Typography>
                  <Typography variant="label">{quantity}</Typography>
                </Stack>
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
            <Stack direction="row" spacing={2}>
              {buttons}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ActionableBookItem;
