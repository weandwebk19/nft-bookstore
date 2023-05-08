import { useState } from "react";
import { toast } from "react-toastify";

import { Stack, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";

import { useAccount } from "@/components/hooks/web3";
import { useWeb3 } from "@/components/providers/web3";
import { Dialog } from "@/components/shared/Dialog";
import { StyledButton } from "@/styles/components/Button";
import { LendBook } from "@/types/nftBook";

interface CancelAllLendingButtonProps {
  allBooks: LendBook[];
}

const RevokeAllLendingButton = ({ allBooks }: CancelAllLendingButtonProps) => {
  const { t } = useTranslation("lendingBooks");
  const { bookStoreContract } = useWeb3();
  const { account } = useAccount();

  const [anchorRevokeButton, setAnchorRevokeButton] = useState<Element | null>(
    null
  );

  const openRevokeDialog = Boolean(anchorRevokeButton);

  const handleRevokeClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await Promise.all(
      allBooks.map(async (book) => {
        try {
          // handle errors
          if (book.renter !== account.data) {
            return toast.error("Renter address is not valid.", {
              position: toast.POSITION.TOP_CENTER
            });
          }

          const tx = await bookStoreContract?.updateBookFromRenting(
            book.tokenId,
            0,
            0,
            book.renter
          );

          const receipt: any = await toast.promise(tx!.wait(), {
            pending: "Pending.",
            success: "Cancel Lending NftBook successfully",
            error: "Oops! There's a problem with lending cancel process!"
          });
          return receipt;
        } catch (e: any) {
          console.error(e);
          return toast.error(`${e.message}.`, {
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
    );
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
        Cancel All
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
              {t("button_no")}
            </StyledButton>
            <StyledButton onClick={(e) => handleRevokeClick(e)}>
              {t("button_yes")}
            </StyledButton>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default RevokeAllLendingButton;
