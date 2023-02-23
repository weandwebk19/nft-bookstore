import { Box, Typography } from "@mui/material";

interface FormGroupProps {
  label: React.ReactNode | string;
  children?: React.ReactNode;
  required?: Boolean;
  style?: Object;
  className?: string;
}

const FormGroup = ({
  label,
  children,
  required = false,
  style = {},
  className
}: FormGroupProps) => {
  return (
    <Box className={`form-control ${className}`} style={style}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: 400, lineHeight: 1.3, fontSize: 18 }}
        className={`form-label ${required ? "required" : ""}`}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
};

export default FormGroup;
