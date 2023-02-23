import { TextField } from "@mui/material";

import { styled } from "@mui/system";

const StyledTextArea = styled(TextField)(({ theme }) => ({
    "& label.MuiFormLabel-root.MuiInputLabel-root": {
        bottom: "0px !important",
        right: "16px !important",
        top: "initial",
        left: "initial",
    },
    "& .MuiInputBase-root": {
        paddingBottom: "40px"
    },
    "& legend": {
        width: 0,
    },
}));

export { StyledTextArea };
