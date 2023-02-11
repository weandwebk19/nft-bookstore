import { Box, Stack, Typography } from "@mui/material";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import StarIcon from "@mui/icons-material/Star";

import { BookItemProps } from "@_types/bookItem";
import styles from "@styles/BookItem.module.scss";

const BookItem = ({
  bookCover,
  type,
  star,
  title,
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
            backgroundImage: `url(${bookCover})`,
            backgroundRepeat: "no-repeat"
          }
        }
      }}
    >
      <Box
        component="img"
        className={styles["book-item__book-cover"]}
        src={bookCover}
        alt={title}
      />
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        className="book-item__chips"
      >
        <Stack direction="row">
          <InsertDriveFileIcon fontSize="small" color="disabled" />
          <Typography variant="caption">{type}</Typography>
        </Stack>

        <Stack direction="row">
          <StarIcon fontSize="small" color="disabled" />
          <Typography variant="caption">{star}</Typography>
        </Stack>
      </Stack>
      <Typography className="text-limit text-limit--2" variant="h6">
        {title}
      </Typography>
      <Typography className="text-limit text-limit--1" variant="body2">
        {author}
      </Typography>
    </Stack>
  );
};

export default BookItem;
