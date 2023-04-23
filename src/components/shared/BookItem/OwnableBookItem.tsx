import { useEffect, useState } from "react";

import { Box, ButtonGroup, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import useSWR from "swr";

import { useMetadata } from "@/components/hooks/api/useMetadata";
import { useWeb3 } from "@/components/providers/web3";
import { NftBookMeta } from "@/types/nftBook";

import { Image } from "../Image";

interface OwnableBookItemProps {
  tokenId: number;
  author: string;
  onClick: (tokenId: number) => void;
  price: number;
  buttons: React.ReactNode;
}

const OwnableBookItem = ({
  tokenId,
  author,
  onClick,
  price,
  buttons
}: OwnableBookItemProps) => {
  const theme = useTheme();
  const [authorName, setAuthorName] = useState();
  const metadata = useMetadata(tokenId);

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
      spacing={1}
      sx={{
        background: `${theme.palette.background.default}`,
        borderRadius: "5px",
        "&:hover": {
          transform: "translateY(-10px)",
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
            backgroundImage: `url(${metadata?.data?.bookCover})`,
            backgroundRepeat: "no-repeat"
          }
        }
      }}
    >
      <Stack
        sx={{ padding: 1 }}
        onClick={() => {
          onClick(tokenId);
        }}
      >
        <Image
          src={metadata?.data?.bookCover}
          alt={metadata?.data?.title}
          sx={{ flexShrink: 0, aspectRatio: "2 / 3" }}
          className={styles["book-item__book-cover"]}
        />
        <Box
          sx={{
            mt: 2,
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
              <Typography variant="caption">
                {metadata?.data?.fileType}
              </Typography>
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
              {metadata?.data?.title}
            </Typography>
            <Typography
              className="text-limit text-limit--1"
              variant="body2"
              sx={{ flexShrink: 0, marginTop: "auto" }}
              gutterBottom
            >
              {authorName}
            </Typography>
            <Typography variant="h6" color={`${theme.palette.success.main}`}>
              {price} ETH
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Stack sx={{ width: "100%" }}>
        <ButtonGroup>{buttons}</ButtonGroup>
      </Stack>
    </Stack>
  );
};

export default OwnableBookItem;
