import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "@shared/Dialog";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { useRouter } from "next/router";
import * as yup from "yup";

import { InputController } from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";

interface BookItemProps {
  bookCover: string;
  bookTitle: string;
  fileType: string;
  tokenId: string;
  author: string;
  onClick: (tokenId: string) => void;
}

const schema = yup
  .object({
    price: yup
      .number()
      .min(0, `The price must be higher than 0.`)
      .typeError("Price must be a number"),
    amount: yup
      .number()
      .min(1, `The price must be higher than 0.`)
      .typeError("Amount must be a number")
  })
  .required();

const defaultValues = {
  price: 0,
  amount: 1
};

const BookCard = ({
  bookCover,
  bookTitle,
  fileType,
  tokenId,
  author,
  onClick
}: BookItemProps) => {
  const router = useRouter();

  const handleEditBookClick = (tokenId: number | string) => {
    (async () => {
      const res = await axios.get(`/api/books/token/${tokenId}/bookId`);
      console.log("res", res);
      if (res.data.success === true) {
        const bookId = res.data.data;
        router.push(`/books/${bookId}/edit`);
      }
    })();
  };

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  const [authorName, setAuthorName] = useState();
  const theme = useTheme();

  const [anchorBookCard, setAnchorBookCard] = useState<Element | null>(null);
  const openBookCard = Boolean(anchorBookCard);

  const handleBookCardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorBookCard(e.currentTarget);
  };

  const handleBookCardClose = () => {
    setAnchorBookCard(null);
  };

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
            alt={bookTitle}
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
              <Typography variant="h5">{bookTitle}</Typography>
              <Typography variant="body2">{authorName}</Typography>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={2}>
              <StyledButton onClick={handleBookCardClick}>Sell</StyledButton>

              <Dialog
                title="Sell"
                open={openBookCard}
                onClose={handleBookCardClose}
              >
                <FormProvider {...methods}>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    spacing={3}
                  >
                    <Grid item md={4}>
                      <Stack>
                        <Box
                          component="img"
                          className={styles["book-item__book-cover"]}
                          src={bookCover}
                          alt={bookTitle}
                          sx={{ width: "100%" }}
                        />
                        <Typography variant="h5">{bookTitle}</Typography>
                        <Typography>{authorName}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item md={8}>
                      <Stack
                        spacing={3}
                        sx={{
                          mb: 5
                        }}
                      >
                        <FormGroup label="Listing price" required>
                          <InputController name="price" type="number" />
                        </FormGroup>
                        <FormGroup label="Amount" required>
                          <InputController name="amount" type="number" />
                        </FormGroup>
                      </Stack>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <StyledButton
                          customVariant="secondary"
                          sx={{ mr: 2 }}
                          onClick={handleBookCardClose}
                        >
                          Cancel
                        </StyledButton>
                        <StyledButton onClick={handleSubmit(onSubmit)}>
                          Start selling
                        </StyledButton>
                      </Box>
                    </Grid>
                  </Grid>
                </FormProvider>
              </Dialog>

              <StyledButton
                customVariant="secondary"
                onClick={() => handleEditBookClick(tokenId)}
              >
                Edit
              </StyledButton>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookCard;
