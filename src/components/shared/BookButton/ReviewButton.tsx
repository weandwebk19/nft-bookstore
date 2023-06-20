import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { useTranslation } from "next-i18next";
import * as yup from "yup";

import { useAccount, useMetadata } from "@/components/hooks/web3";
import { Dialog } from "@/components/shared/Dialog";
import {
  RatingController,
  TextAreaController
} from "@/components/shared/FormController";
import { FormGroup } from "@/components/shared/FormGroup";
import { StyledButton } from "@/styles/components/Button";
import { ReviewInfo } from "@/types/reviews";

import { ContentGroup } from "../ContentGroup";
import { Image } from "../Image";
import { toastErrorSubmit } from "@/utils/toast";

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
  const { t } = useTranslation("bookButtons");

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
      const newReview = {
        walletAddress: account.data,
        tokenId,
        review: data.review,
        rating: data.rating ? data.rating : 5
      };
      const reviewRes = await axios.post(`/api/reviews/create`, newReview);
      if (reviewRes.data.success === true) {
        toast.success(t("textReview1") as string);
        setReviews(newReview);
      } else {
        toast.error("Oops! Something went wrong!", {
          position: toast.POSITION.TOP_CENTER
        });
      }
    } catch (e: any) {
      toastErrorSubmit("review");
    }
  };

  const updateReview = useCallback(async (review: ReviewInfo) => {
    const res = await axios.put(`/api/reviews/${review.id}/update`, {
      reviewInfo: review
    });
    if (res.data.success === true) {
      toast.success(t("textReview2") as string);
    } else {
      toast.error("Oops! Something went wrong!", {
        position: toast.POSITION.TOP_CENTER
      });
    }
    return res.data.data;
  }, []);

  const onEditSubmit = async (data: any) => {
    try {
      await updateReview({
        ...reviews,
        review: data.review,
        rating: data.rating
      });

      const reviewRes = await axios.get(`/api/reviews/${reviews.id}`);
      if (reviewRes.data.success == true) {
        setReviews(reviewRes.data.data);
      }
    } catch (e: any) {
      toastErrorSubmit("update review");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (author) {
          const userRes = await axios.get(`/api/authors/wallet/${author}`);

          if (userRes.data.success === true) {
            setAuthorName(userRes.data.data.pseudonym);
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
          const userRes = await axios.get(`/api/users/wallet/${account.data}`);

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
      {account.data !== author && (
        <Button
          variant={reviews ? "outlined" : "contained"}
          color="secondary"
          size="small"
          sx={{ width: "100%" }}
          onClick={handleBookCardClick}
        >
          {reviews ? t("reviewedBtn") : t("reviewBtn")}
        </Button>
      )}

      <Dialog
        title={t("reviewTitle") as string}
        open={openBookCard}
        onClose={handleBookCardClose}
      >
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
                    ? (t("textReview3") as string)
                    : (t("textReview4") as string)
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
                  <FormGroup label={t("reviewTitle") as string}>
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
                  {t("cancelBtn")}
                </StyledButton>
                {reviews ? (
                  <StyledButton onClick={handleSubmit(onEditSubmit)}>
                    {t("editReviewBtn")}
                  </StyledButton>
                ) : (
                  <StyledButton onClick={handleSubmit(onSubmit)}>
                    {t("sendReviewBtn")}
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
