import { Box, Typography } from "@mui/material";

import images from "@/assets/images";

interface BigTitleProps {
  title1: string;
  title2?: string;
}

const BigTitle = ({ title1, title2 }: BigTitleProps) => {
  return (
    <Box component="section" sx={{ marginTop: "100px" }}>
      <Box sx={{ textAlign: "center", position: "relative", mb: 8 }}>
        <Typography variant="h2">{title1} </Typography>
        <Typography variant="h2">{title2} </Typography>
        <Box
          component="img"
          src={images.decoLine}
          sx={{
            position: "absolute",
            maxWidth: "385px",
            transform: "translateX(-50%) translateY(-40%)"
          }}
        />
      </Box>
    </Box>
  );
};

export default BigTitle;
