/* eslint-disable prettier/prettier */
import { useState } from "react";

import { Box } from "@mui/material";

import { Dialog } from "@/components/shared/Dialog";
import { StyledButton } from "@/styles/components/Button";

interface BookDialogProps {
  content: string | React.ReactNode;
  title: string;
  children: React.ReactNode;
  variant: any;
  selfClose?: boolean;
  buttonSize?: string;
}

const BookDialog = ({
  content,
  title,
  children,
  variant,
  selfClose = false,
  buttonSize
}: BookDialogProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {(() => {
        if (typeof content === "string")
          return (
            <StyledButton
              customVariant={variant}
              onClick={handleOpen}
              sx={buttonSize === "full" ? { width: "100%" } : {}}
            >
              {content}
            </StyledButton>
          );
        return (
          <StyledButton customVariant={variant} onClick={handleOpen}>
            {content}
          </StyledButton>
        );
      })()}

      <Dialog title={title} open={open} onClose={handleClose}>
        {selfClose ? (
          <Box onClick={handleClose}>{children}</Box>
        ) : (
          <Box>{children}</Box>
        )}
      </Dialog>
    </>
  );
};

export default BookDialog;
