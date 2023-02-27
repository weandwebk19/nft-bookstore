import { ChangeEvent } from "react";

import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface UploadFieldProps {
  content: string;
  description?: string;
  required?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  uploaded?: File;
}

const UploadField = ({
  content,
  description,
  onChange,
  required = false,
  uploaded
}: UploadFieldProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "250px",
        border: `1px dashed ${theme.palette.primary.light}`,
        borderRadius: "5px",
        position: "relative"
      }}
    >
      <Button
        variant={required ? "contained" : "outlined"}
        component="label"
        onChange={onChange}
      >
        {content}
        <input type="file" hidden />
      </Button>
      <Typography variant="caption" sx={{ position: "absolute", bottom: 0 }}>
        {uploaded?.name}
      </Typography>
    </Box>
  );
};

export default UploadField;
