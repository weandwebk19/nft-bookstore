import { Box, IconButton, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import PropTypes from "prop-types";
import { StyledDialog, StyledDialogTitle } from "@styles/components/Dialog";

interface DialogProps {
  title?: string;
  children: React.ReactNode;
  dialogSize?: any;
  selfClose?: boolean;
  open: boolean;
  onClose(...args: unknown[]): unknown;
}

const Dialog = ({
  title,
  dialogSize,
  selfClose,
  onClose,
  open,
  children,
}: DialogProps) => {
  const handleClose = () => {
    onClose(false);
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth={dialogSize}
      fullWidth
    >
      <StyledDialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4">{title}</Typography>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </StyledDialogTitle>
      {selfClose ? (
        <Box sx={{ p: 3 }} onClick={handleClose}>
          {children}
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>{children}</Box>
      )}
    </StyledDialog>
  );
};

Dialog.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  dialogSize: PropTypes.string,
  selfClose: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

Dialog.defaultProps = {
  title: "",
  dialogSize: "md",
  selfClose: false,
};

export default Dialog;
