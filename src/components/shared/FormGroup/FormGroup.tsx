import { Stack, Typography } from "@mui/material";

interface FormGroupProps {
  label: React.ReactNode | string;
  desc?: string;
  children?: React.ReactNode;
  required?: Boolean;
  style?: Object;
  className?: string;
}

const FormGroup = ({
  label,
  desc,
  children,
  required = false,
  style = {},
  className
}: FormGroupProps) => {
  return (
    <Stack className={`form-control ${className}`} style={style}>
      <Typography
        variant="label"
        gutterBottom
        className={`form-label ${required ? "required" : ""}`}
      >
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontStyle: "italic" }}>
        {desc}
      </Typography>
      {children}
    </Stack>
  );
};

export default FormGroup;
