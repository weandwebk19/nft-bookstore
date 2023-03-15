import { useEffect, useState } from "react";

import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import styles from "@styles/BookItem.module.scss";
import axios from "axios";

interface ActionableBookItemProps {
  bookCover: string;
  title: string;
  fileType: string;
  tokenId: number;
  author: string;
  onClick: (tokenId: string) => void;
  buttons?: React.ReactNode;
}

const ActionableBookItem = ({
  bookCover,
  title,
  fileType,
  tokenId,
  author,
  onClick,
  buttons
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
      // className={styles["book-item"]}
      sx={{
        backgroundColor: `${theme.palette.background.default}`,
        borderRadius: "5px"
      }}
    >
      <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid
          item
          md={4}
          onClick={() => onClick(tokenId)}
          sx={{ cursor: "pointer" }}
        >
          <Box
            component="img"
            className={styles["book-item__book-cover"]}
            src={bookCover}
            alt={title}
            sx={{ width: "100%", height: "100%" }}
          />
        </Grid>
        <Grid item md={8}>
          <Stack
            justifyContent="space-between"
            sx={{
              p: 3,
              width: "100%",
              height: "100%"
            }}
          >
            <Stack>
              <Stack direction="row">
                <InsertDriveFileIcon fontSize="small" color="disabled" />
                <Typography variant="caption">{fileType}</Typography>
              </Stack>
              <Typography variant="h5">{title}</Typography>
              <Typography variant="body2">{authorName}</Typography>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={2}>
              {buttons}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ActionableBookItem;
