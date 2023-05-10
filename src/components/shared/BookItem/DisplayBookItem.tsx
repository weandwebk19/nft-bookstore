import { useCallback, useEffect, useState } from "react";

import { Box, Stack, Typography } from "@mui/material";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { useRouter } from "next/router";

import { useMetadata } from "@/components/hooks/web3";

import { Image } from "../Image";

interface DisplayBookItemProps {
  tokenId: number;
  seller: string;
}

const DisplayBookItem = ({ tokenId, seller }: DisplayBookItemProps) => {
  const [sellerName, setSellerName] = useState();
  const router = useRouter();
  const { metadata } = useMetadata(tokenId);

  const handleBookClick = useCallback(
    (tokenId: number) => {
      (async () => {
        const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
        if (res.data.success === true) {
          const bookId = res.data.data;
          router.push(`/books/${bookId}/${seller}`);
        }
      })();
    },
    [tokenId]
  );

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
        console.log(err);
      }
    })();
  }, [seller]);

  return (
    <Stack
      className={styles["book-item"]}
      onClick={() => {
        handleBookClick(tokenId);
      }}
      spacing={1}
      sx={{
        "&:hover": {
          scale: "0.97",
          "&::before": {
            content: "''",
            inset: "0px",
            filter: "blur(12px)",
            margin: "-4px",
            display: "block",
            opacity: "0.2",
            zIndex: "-1",
            position: "absolute",
            borderRadius: "16px",
            backgroundSize: "cover",
            backgroundImage: `url(${metadata.data?.bookCover})`,
            backgroundRepeat: "no-repeat"
          }
        }
      }}
    >
      <Image
        src={metadata.data?.bookCover}
        alt={metadata.data?.title}
        sx={{ flexShrink: 0, aspectRatio: "2 / 3" }}
        className={styles["book-item__book-cover"]}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          className="book-item__chips"
          sx={{ flexShrink: 0, marginBottom: "auto" }}
        >
          <Stack direction="row">
            <InsertDriveFileIcon fontSize="small" color="disabled" />
            <Typography variant="caption">{metadata.data?.fileType}</Typography>
          </Stack>

          {/* {meta.attributes?.map((stat, i) => {
            switch (stat.statType) {
              case "stars":
                return (
                  <Stack key={i} direction="row">
                    <StarIcon fontSize="small" color="disabled" />
                    <Typography variant="caption">{`${stat.value} ${stat.statType}`}</Typography>
                  </Stack>
                );
              default:
                return "";
            }
          })} */}
        </Stack>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography
            className="text-limit text-limit--2"
            variant="h6"
            sx={{ flex: 1 }}
          >
            {metadata.data?.title}
          </Typography>
          <Typography
            className="text-limit text-limit--1"
            variant="body2"
            sx={{ flexShrink: 0, marginTop: "auto" }}
          >
            {sellerName}
          </Typography>

          {/* <Typography
            className="text-limit text-limit--1"
            variant="body2"
            sx={{ flexShrink: 0, marginTop: "auto" }}
          >
            {amount ? `Amount: ${amount}` : ``}
          </Typography>

          <Typography
            className="text-limit text-limit--1"
            variant="body2"
            sx={{ flexShrink: 0, marginTop: "auto" }}
          >
            {price ? `Price: ${price} ETH` : ``}
          </Typography> */}
        </Box>
      </Box>
    </Stack>
  );
};

export default DisplayBookItem;
