import { AlertColor, Snackbar as MUISnackbar } from "@mui/material";

import Portal from "@mui/base/Portal";
import { Alert } from "@mui/lab";

interface SnackbarProps {
  severity?: AlertColor;
  open: boolean;
  handleClose: () => void;
  message: string;
}

const Snackbar = ({
  severity = "success",
  open,
  handleClose,
  message
}: SnackbarProps) => {
  return (
    <Portal>
      <MUISnackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </MUISnackbar>
    </Portal>
  );
};

export default Snackbar;
