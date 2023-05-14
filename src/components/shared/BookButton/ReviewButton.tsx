import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import * as yup from "yup";

import { useAccount, useMetadata } from "@/components/hooks/web3";
import { Dialog } from "@/components/shared/Dialog";
import {
  RatingController,
  TextAreaController,
  TextFieldController
} from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";

import { ContentGroup } from "../ContentGroup";
import { Image } from "../Image";

interface ReviewButtonProps {
  author: string;
  tokenId: number;
}

const schema = yup
  .object({
    rating: yup.number(),
    review: yup.string()
  })
  .required();

const defaultValues = {
  rating: 5,
  review: ""
};

const ReviewButton = ({ author, tokenId }: ReviewButtonProps) => {
  const [authorName, setAuthorName] = useState();
  const [reviews, setReviews] = useState<any>();
  const { metadata } = useMetadata(tokenId);
  const { account } = useAccount();

  const [anchorBookCard, setAnchorBookCard] = useState<Element | null>(null);
  const openBookCard = Boolean(anchorBookCard);

  const handleBookCardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorBookCard(e.currentTarget);
  };

  const handleBookCardClose = () => {
    setAnchorBookCard(null);
  };

  const methods = useForm({
    shouldUnregister: false,
    defaultValues,
    resolver: yupResolver(schema),
    mode: "all"
  });

  const { handleSubmit, setValue } = methods;

  useEffect(() => {
    setValue("rating", 5);
    setValue("review", "");
  });

  const onSubmit = async (data: any) => {
    try {
      const reviewRes = await axios.post(`/api/reviews/create`, {
        walletAddress: account.data,
        tokenId,
        review: data.review,
        rating: data.rating ? data.review : 5
      });
      if (reviewRes.data.success === true) {
        toast.success("Review book successfully.");
      } else {
        toast.error(`${reviewRes.data.message.substr(0, 65)}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    } catch (e: any) {
      toast.error(`${e.message.substr(0, 65)}.`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  const onEditSubmit = async (data: any) => {
    try {
    } catch (e: any) {
      toast.error(`${e.message.substr(0, 65)}.`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
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

  useEffect(() => {
    (async () => {
      try {
        if (tokenId && account.data) {
          const userRes = await axios.get(
            `/api/users/wallet/${account.data?.toLowerCase()}`
          );

          const bookRes = await axios.get(`/api/books/token/${tokenId}/bookId`);

          if (userRes.data.success === true && bookRes.data.success === true) {
            const reviewRes = await axios.get(
              `/api/books/${bookRes.data.data}/reviews/${userRes.data.data.id}`
            );
            if (reviewRes.data.success == true) {
              setReviews(reviewRes.data.data);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [tokenId, account.data]);

  return (
    <>
      <Button
        variant={reviews ? "outlined" : "contained"}
        color="secondary"
        size="small"
        sx={{ width: "100%" }}
        onClick={handleBookCardClick}
      >
        {reviews ? "reviewed" : "review"}
      </Button>

      <Dialog title="Review" open={openBookCard} onClose={handleBookCardClose}>
        <FormProvider {...methods}>
          <Stack spacing={3} sx={{ overflowX: "hidden" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
            >
              <Image
                src={metadata.data?.bookCover}
                alt={metadata.data?.title}
                sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                className={styles["book-item__book-cover"]}
              />
              <Box>
                <Typography variant="h5">{metadata.data?.title}</Typography>
                <Typography>{authorName}</Typography>
                {/* <Typography variant="h4">{price} ETH</Typography> */}
              </Box>
            </Stack>
            <Divider />
            <Stack flexGrow={1}>
              <ContentGroup
                title={
                  reviews
                    ? "You can edit your review"
                    : "Leave your rating here"
                }
              >
                {/* Waiting for your signing... */}
                <Stack spacing={3}>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      scale: "2"
                    }}
                  >
                    <RatingController
                      name="rating"
                      defaultValue={reviews?.rating}
                    />
                  </Box>
                  <FormGroup label="Review">
                    <TextAreaController
                      name="review"
                      maxCharacters={8000}
                      defaultValue={reviews?.review}
                    />
                  </FormGroup>
                </Stack>
              </ContentGroup>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <StyledButton
                  customVariant="secondary"
                  sx={{ mr: 2 }}
                  onClick={handleBookCardClose}
                >
                  Cancel
                </StyledButton>
                {reviews ? (
                  <StyledButton onClick={handleSubmit(onEditSubmit)}>
                    Edit review
                  </StyledButton>
                ) : (
                  <StyledButton onClick={handleSubmit(onSubmit)}>
                    Send review
                  </StyledButton>
                )}
              </Box>
            </Stack>
          </Stack>
        </FormProvider>
        <ToastContainer />
      </Dialog>
    </>
  );
};

export default ReviewButton;
