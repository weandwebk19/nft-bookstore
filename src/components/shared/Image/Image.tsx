import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

import NextImage from "next/image";

interface ImageProps {
  sx?: SxProps<Theme>;
  src?: string;
  alt?: string;
  className?: any;
}

const Image = ({ sx, src, alt, className }: ImageProps) => {
  return (
    <Box sx={{ position: "relative", ...sx }}>
      <NextImage
        className={className}
        src={src!}
        alt={alt!}
        fill
        style={{
          width: "100%",
          height: "100%"
        }}
      />
    </Box>
  );
};

export default Image;
