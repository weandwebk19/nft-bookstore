import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Box, Grid, Stack, Typography } from "@mui/material";

import styles from "@styles/BookItem.module.scss";
import axios from "axios";
import { useTranslation } from "next-i18next";

import { Dialog } from "@/components/shared/Dialog";
import { StyledButton } from "@/styles/components/Button";

import { Image } from "../Image";

interface RevokeButtonProps {
  borrower?: string;
  amount: number;
  isEnded?: boolean;
  countDown?: string;
  title: string;
  bookCover: string;
  renter: string;
  tokenId: number;
  handleRevoke: () => Promise<any>;
  buttonName?: string;
}

const RevokeButton = ({
  borrower,
  amount,
  isEnded,
  countDown,
  bookCover,
  title,
  renter,
  tokenId,
  handleRevoke,
  buttonName = "Revoke"
}: RevokeButtonProps) => {
  const { t } = useTranslation("bookButtons");

  const [renterName, setRenterName] = useState();

  const [anchorRevokeDiaglog, setAnchorRevokeDiaglog] =
    useState<Element | null>(null);
  const openRevokeDiaglog = Boolean(anchorRevokeDiaglog);

  const handleRevokeDiaglogClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorRevokeDiaglog(e.currentTarget);
    if (isEnded) {
      try {
        await handleRevoke();
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

  const handleRevokeClick = async () => {
    try {
      await handleRevoke();
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
        if (renter) {
          const userRes = await axios.get(`/api/users/wallet/${renter}`);

          if (userRes.data.success === true) {
            setRenterName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [renter]);

  return (
    <>
      <StyledButton
        onClick={handleRevokeDiaglogClick}
        customVariant={isEnded ? "primary" : "secondary"}
      >
        {t("revoke") as string}
      </StyledButton>

      {!isEnded && (
        <Dialog
          title={t("revokeTitle") as string}
          open={openRevokeDiaglog}
          onClose={handleRevokeDiaglogClose}
        >
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={3}>
            <Grid item md={4}>
              <Stack>
                <Image
                  src={bookCover}
                  alt={title}
                  sx={{ flexShrink: 0, aspectRatio: "2 / 3", width: "100px" }}
                  className={styles["book-item__book-cover"]}
                />
                <Typography variant="h5">{title}</Typography>
                <Typography>{renterName}</Typography>
                <Typography>
                  {t("amount") as string}: {amount}
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
                      {borrower} {t("unlistText3") as string}
                    </Typography>
                    <Typography>
                      {countDown} {t("left") as string}
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
                  {t("cancelBtn") as string}
                </StyledButton>
                <StyledButton onClick={() => handleRevokeClick()}>
                  {t("revokeBtn") as string}
                </StyledButton>
              </Box>
            </Grid>
          </Grid>
        </Dialog>
      )}
    </>
  );
};

export default RevokeButton;
