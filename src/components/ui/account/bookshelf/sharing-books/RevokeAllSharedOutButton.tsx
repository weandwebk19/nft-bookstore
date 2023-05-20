import { useState } from "react";
import { toast } from "react-toastify";

import { Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";

import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { createTransactionHistoryOnlyGasFee } from "@/components/utils";
import { StyledButton } from "@/styles/components/Button";

const RevokeAllSharedOutButton = () => {
  const { t } = useTranslation("lendingBooks");
  const { t: t2 } = useTranslation("bookButtons");

  const { provider, bookStoreContract } = useWeb3();

  const [anchorRevokeButton, setAnchorRevokeButton] = useState<Element | null>(
    null
  );

  const openRevokeDialog = Boolean(anchorRevokeButton);

  const handleRevokeClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      const tx = await bookStoreContract?.recallAllSharedBooks();

      const receipt: any = await toast.promise(tx!.wait(), {
        pending: "Pending.",
        success: "Revoke shared out book successfully",
        error: "Oops! There's a problem with shared out process!"
      });

      if (receipt) {
        await createTransactionHistoryOnlyGasFee(
          provider,
          receipt,
          NaN,
          "Revoke all shared out book"
        );
      }
    } catch (e: any) {
      console.error(e);
      toast.error(`${e.message.substr(0, 65)}.`, {
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
        {t2("revokeAllBtn") as string}
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

export default RevokeAllSharedOutButton;
