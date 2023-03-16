import { useCallback, useEffect, useState } from "react";

import { Box, Stack, Typography } from "@mui/material";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { useRouter } from "next/router";

import { Image } from "../Image";

interface DisplayBookItemProps {
  bookCover: string;
  title: string;
  fileType: string;
  tokenId: number;
  author: string;
  onClick: (tokenId: number) => void;
}

const DisplayBookItem = ({
  bookCover,
  title,
  fileType,
  tokenId,
  author,
  onClick
}: DisplayBookItemProps) => {
  const [authorName, setAuthorName] = useState();
  const router = useRouter();

  const handleBookClick = useCallback((tokenId: string) => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
      console.log("res", res);
      if (res.data.success === true) {
        const bookId = res.data.data;
        router.push(`/books/${bookId}`);
      }
    })();
  }, []);

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
    <Stack
      className={styles["book-item"]}
      onClick={() => {
        onClick(tokenId);
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
            backgroundImage: `url(${bookCover})`,
            backgroundRepeat: "no-repeat"
          }
        }
      }}
    >
      <Image
        src={bookCover}
        alt={title}
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
            <Typography variant="caption">{fileType}</Typography>
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
            {title}
          </Typography>
          <Typography
            className="text-limit text-limit--1"
            variant="body2"
            sx={{ flexShrink: 0, marginTop: "auto" }}
          >
            {authorName}
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
