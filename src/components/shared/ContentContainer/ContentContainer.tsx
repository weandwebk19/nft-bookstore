import { Box, Stack, Typography } from "@mui/material";

import styles from "@styles/ContentContainer.module.scss";

import images from "@/assets/images";

interface ContentContainerProps {
  titles?: string[];
  children: React.ReactNode;
}

const ContentContainer = ({ titles, children }: ContentContainerProps) => {
  return (
    <Stack
      spacing={8}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "auto"
      }}
      className={styles["content__container"]}
    >
      <Box component="section" sx={{ marginTop: "100px" }}>
        <Box sx={{ textAlign: "center", position: "relative", mb: 8 }}>
          {titles?.map((title) => (
            <Typography variant="h2" key={title}>
              {title}
            </Typography>
          ))}
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
      {children}
    </Stack>
  );
};

export default ContentContainer;
