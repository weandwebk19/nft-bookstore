import { useState } from "react";
import { toast } from "react-toastify";

import { Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";

import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { StyledButton } from "@/styles/components/Button";

const RecallAllLeasingButton = () => {
  const { t } = useTranslation("leasingBooks");
  const { contract } = useWeb3();

  const [anchorRecallButton, setAnchorRecallButton] = useState<Element | null>(
    null
  );

  const openRecallDialog = Boolean(anchorRecallButton);

  const handleRecallClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // try {
    //   const tx = await contract?.recallAllLeasingBooks();

    //   const receipt: any = await toast.promise(tx!.wait(), {
    //     pending: "Pending.",
    //     success: "Recall leasing books successfully",
    //     error: "Oops! There's a problem with leasing process!"
    //   });
    // } catch (e: any) {
    //   console.error(e);
    //   toast.error(`${e.message}.`, {
    //     position: toast.POSITION.TOP_CENTER
    //   });
    // }
    setAnchorRecallButton(null);
  };

  const handleCancelClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorRecallButton(null);
  };

  const handleRecallClose = () => {
    setAnchorRecallButton(null);
  };

  const handleOpenRecallDialogClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setAnchorRecallButton(e.currentTarget);
  };

  return (
    <>
      <StyledButton
        customVariant="secondary"
        onClick={(e) => handleOpenRecallDialogClick(e)}
      >
        Recall All
      </StyledButton>
      <Dialog
        title={t("dialogTitle") as string}
        open={openRecallDialog}
        onClose={handleRecallClose}
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
            <StyledButton onClick={(e) => handleRecallClick(e)}>
              {t("button_recall")}
            </StyledButton>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default RecallAllLeasingButton;
