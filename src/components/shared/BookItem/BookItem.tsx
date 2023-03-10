/* eslint-disable prettier/prettier */
import { Box, Stack, Typography } from "@mui/material";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import StarIcon from "@mui/icons-material/Star";

import styles from "@styles/BookItem.module.scss";

import { ListedBook, NftBook } from "@/types/nftBook";
import { truncate } from "@/utils/truncate";

type BookItemProps = {
  onClick: () => void;
} & ListedBook &
  NftBook;

const BookItem = ({
  meta,
  seller,
  amount,
  price,
  author,
  onClick
}: BookItemProps) => {
  return (
    <Stack
      className={styles["book-item"]}
      onClick={onClick}
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
            backgroundImage: `url(${meta.bookCover})`,
            backgroundRepeat: "no-repeat"
          }
        }
      }}
    >
      <Box
        component="img"
        className={styles["book-item__book-cover"]}
        src={meta.bookCover}
        alt={meta.title}
        sx={{ flexShrink: 0, aspectRatio: "2 / 3" }}
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
            <Typography variant="caption">{meta.bookFile}</Typography>
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
            {meta.title}
          </Typography>
          <Typography
            className="text-limit text-limit--1"
            variant="body2"
            sx={{ flexShrink: 0, marginTop: "auto" }}
          >
            {/* {truncate(seller, 6, -4)} */}
          </Typography>

          <Typography
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
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
};

export default BookItem;
