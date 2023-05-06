import { Typography } from "@mui/material";

interface PageIndicatorProps {
  page: string;
}

const PageIndicator = ({ page }: PageIndicatorProps) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "1rem",
        right: "1rem",
        left: "1rem",
        textAlign: "center",
        zIndex: 1
      }}
    >
      <Typography>{page}</Typography>
    </div>
  );
};

export default PageIndicator;
