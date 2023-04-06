import { useEffect, useState } from "react";

import { Box, Chip, Divider, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import styles from "@styles/BookItem.module.scss";
import axios from "axios";

import { Image } from "../Image";

interface ActionableBookItemProps {
  bookCover: string;
  title: string;
  fileType: string;
  tokenId: number;
  author: string;
  onClick: (tokenId: number) => void;
  buttons?: React.ReactNode;
  status?: string;
}

const ActionableBookItem = ({
  bookCover,
  title,
  fileType,
  tokenId,
  author,
  onClick,
  buttons,
  status
}: ActionableBookItemProps) => {
  const theme = useTheme();
  const [authorName, setAuthorName] = useState();

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
    <Box
      sx={{
        backgroundColor: `${theme.palette.background.default}`,
        borderRadius: "5px",
        height: "100%"
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          height: "100%"
        }}
      >
        <Image
          src={bookCover}
          alt={title}
          sx={{ flexShrink: 0, aspectRatio: "2 / 3" }}
          className={styles["book-item__book-cover"]}
        />
        <Stack
          justifyContent="space-between"
          sx={{
            p: 3,
            width: "100%",
            height: "100%"
          }}
        >
          <Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row">
                <InsertDriveFileIcon fontSize="small" color="disabled" />
                <Typography variant="caption">{fileType}</Typography>
              </Stack>
              {status !== undefined ? <Chip label={status} /> : <></>}
            </Stack>
            <Typography
              variant="h6"
              className="text-limit text-limit--2"
              sx={{ minHeight: "64px" }}
            >
              {title}
            </Typography>
            <Typography variant="body2">{authorName}</Typography>
          </Stack>

          <Divider sx={{ my: 3 }} />
          <Stack direction="row" spacing={2}>
            {buttons}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ActionableBookItem;
