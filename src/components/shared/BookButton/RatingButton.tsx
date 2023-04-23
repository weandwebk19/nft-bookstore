import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Box, Divider, Grid, Stack, Typography } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import * as yup from "yup";

import { useWeb3 } from "@/components/providers/web3";
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

interface RatingButtonProps {
  title: string;
  bookCover: string;
  author: string;
  tokenId: number;
  amountTradeable: number;
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

const RatingButton = ({
  bookCover,
  title,
  author,
  tokenId,
  amountTradeable
}: RatingButtonProps) => {
  const [authorName, setAuthorName] = useState();
  const { ethereum, contract } = useWeb3();

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

  const { handleSubmit } = methods;

  const onSubmit = async (data: any) => {
    try {
      // handle errors
      if (data.amount > amountTradeable) {
        return toast.error(`Amount must be less than ${amountTradeable}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }

      const listingPrice = await contract!.listingPrice();
      const tx = await contract?.sellBooks(
        tokenId,
        ethers.utils.parseEther(data.price.toString()),
        data.amount,
        {
          value: listingPrice
        }
      );

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Sending your review",
        success: "Your review has been posted",
        error: "Oops! There's a problem with review process!"
      });
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message}.`, {
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

  return (
    <>
      <StyledButton onClick={handleBookCardClick}>Rating</StyledButton>

      <Dialog title="Rating" open={openBookCard} onClose={handleBookCardClose}>
        <FormProvider {...methods}>
          <Stack spacing={3} sx={{ overflowX: "hidden" }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1, sm: 2, md: 4 }}
            >
              <Image
                src={bookCover}
                alt={title}
                sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                className={styles["book-item__book-cover"]}
              />
              <Box>
                <Typography variant="h5">{title}</Typography>
                <Typography>{authorName}</Typography>
                {/* <Typography variant="h4">{price} ETH</Typography> */}
              </Box>
            </Stack>
            <Divider />
            <Stack flexGrow={1}>
              <ContentGroup title="Leave your rating here">
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
                    <RatingController name="rating" />
                  </Box>
                  <FormGroup label="Review">
                    <TextAreaController name="review" maxCharacters={8000} />
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
                <StyledButton onClick={handleSubmit(onSubmit)}>
                  Send review
                </StyledButton>
              </Box>
            </Stack>
          </Stack>
        </FormProvider>
        <ToastContainer />
      </Dialog>
    </>
  );
};

export default RatingButton;
