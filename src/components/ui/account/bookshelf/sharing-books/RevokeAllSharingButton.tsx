import { useState } from "react";
import { toast } from "react-toastify";

import { Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";

import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { StyledButton } from "@/styles/components/Button";

const RevokeAllSharingButton = () => {
  const { t } = useTranslation("lendingBooks");
  const { bookStoreContract } = useWeb3();

  const [anchorRevokeButton, setAnchorRevokeButton] = useState<Element | null>(
    null
  );

  const openRevokeDialog = Boolean(anchorRevokeButton);

  const handleRevokeClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const tx = await bookStoreContract?.recallAllBooksOnSharing();

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Pending.",
        success: "Revoke sharing book successfully",
        error: "Oops! There's a problem with sharing process!"
      });
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message}.`, {
        position: toast.POSITION.TOP_CENTER
      });
    }
    setAnchorRevokeButton(null);
  };

  const handleCancelClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorRevokeButton(null);
  };

  const handleRevokeClose = () => {
    setAnchorRevokeButton(null);
  };

  const handleOpenRevokeDialogClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorRevokeButton(e.currentTarget);
  };

  return (
    <>
      <StyledButton
        customVariant="secondary"
        onClick={(e) => handleOpenRevokeDialogClick(e)}
      >
        Revoke All
      </StyledButton>
      <Dialog
        title={t("dialogTitle") as string}
        open={openRevokeDialog}
        onClose={handleRevokeClose}
      >
        <Stack spacing={3}>
          <Typography>{t("message")}</Typography>
          <Stack direction="row" spacing={3} justifyContent="end">
            <StyledButton
              customVariant="secondary"
              onClick={(e) => handleCancelClick(e)}
            >
              {t("button_cancel")}
            </StyledButton>
            <StyledButton onClick={(e) => handleRevokeClick(e)}>
              {t("button_revoke")}
            </StyledButton>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default RevokeAllSharingButton;
