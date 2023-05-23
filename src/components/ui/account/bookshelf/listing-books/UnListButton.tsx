import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";
import * as yup from "yup";

import { useAccount, useMetadata } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { Image } from "@/components/shared/Image";
import { createTransactionHistoryOnlyGasFee } from "@/components/utils";
import { StyledButton } from "@/styles/components/Button";

interface UnListButtonProps {
  borrower?: string;
  amount: number;
  isEnded?: boolean;
  seller: string;
  tokenId: number;
}

// const schema = yup
//   .object({
//     price: yup
//       .number()
//       .min(0, `The price must be higher than 0.`)
//       .typeError("Price must be a number"),
//     amount: yup
//       .number()
//       .min(1, `The price must be higher than 0.`)
//       .typeError("Amount must be a number")
//   })
//   .required();

// const defaultValues = {
//   price: 0,
//   amount: 1
// };

const UnListButton = ({
  borrower,
  amount,
  isEnded,
  seller,
  tokenId
}: UnListButtonProps) => {
  const { t: t2 } = useTranslation("bookButtons");

  const [sellerName, setSellerName] = useState();
  const { provider, bookStoreContract } = useWeb3();
  const { account } = useAccount();
  const { metadata } = useMetadata(tokenId);

  const [anchorRevokeDiaglog, setAnchorRevokeDiaglog] =
    useState<Element | null>(null);
  const openRevokeDiaglog = Boolean(anchorRevokeDiaglog);

  const handleCancelLending = async () => {
    try {
      // handle errors
      if (seller !== account.data) {
        return toast.error("Seller address is not valid.", {
          position: toast.POSITION.TOP_CENTER
        });
      }

      const tx = await bookStoreContract?.updateBookFromSale(
        tokenId,
        0,
        0,
        seller
      );

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Pending.",
        success: "Cancel listing NftBook successfully",
        error: "Oops! There's a problem with lending cancel process!"
      });

      if (receipt) {
        await createTransactionHistoryOnlyGasFee(
          provider,
          receipt,
          tokenId,
          "Unlist listing book"
        );
      }
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message.substr(0, 65)}.`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  const handleRevokeDiaglogClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorRevokeDiaglog(e.currentTarget);
    if (isEnded) {
      try {
        await handleCancelLending();
      } catch (e: any) {
        console.error(e);
        toast.error(`${e.message.substr(0, 65)}.`, {
          position: toast.POSITION.TOP_CENTER
        });
      }
    }
  };

  const handleRevokeDiaglogClose = () => {
    setAnchorRevokeDiaglog(null);
  };

  // const methods = useForm({
  //   shouldUnregister: false,
  //   defaultValues,
  //   resolver: yupResolver(schema),
  //   mode: "all"
  // });

  // const { handleSubmit } = methods;

  const handleRevokeClick = async () => {
    try {
      await handleCancelLending();
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message.substr(0, 65)}.`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (seller) {
          const userRes = await axios.get(`/api/users/wallet/${seller}`);

          if (userRes.data.success === true) {
            setSellerName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [seller]);

  return (
    <>
      <Button
        variant={isEnded ? "contained" : "outlined"}
        size="small"
        sx={{ width: "100%" }}
        onClick={handleRevokeDiaglogClick}
      >
        {t2("unlistBtn") as string}
      </Button>

      {!isEnded && (
        <Dialog
          title={t2("unlistTitle") as string}
          open={openRevokeDiaglog}
          onClose={handleRevokeDiaglogClose}
        >
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
            <Grid item md={4}>
              <Stack>
                <Image
                  src={metadata.data?.bookCover}
                  alt={metadata.data?.title}
                  sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                  className={styles["book-item__book-cover"]}
                />
                <Typography variant="h5">{metadata.data?.title}</Typography>
                <Typography>{sellerName}</Typography>
                <Typography>
                  {t2("amount") as string}: {amount}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={8}>
              <Stack
                spacing={3}
                sx={{
                  mb: 5
                }}
              >
                {borrower && !isEnded && (
                  <>
                    <Typography>
                      {borrower} {t2("textUnlist1") as string}
                    </Typography>
                  </>
                )}
              </Stack>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <StyledButton
                  customVariant="secondary"
                  sx={{ mr: 2 }}
                  onClick={handleRevokeDiaglogClose}
                >
                  {t2("noBtn") as string}
                </StyledButton>
                <StyledButton onClick={() => handleRevokeClick()}>
                  {t2("yesBtn") as string}
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </Dialog>
      )}
    </>
  );
};

export default UnListButton;
