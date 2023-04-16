import { Box, Typography } from "@mui/material";

import styles from "@styles/ContentGroup.module.scss";

interface ContentGroupProps {
  title: React.ReactNode | string;
  desc?: string;
  children: React.ReactNode;
  classTitle?: string;
}

const ContentGroup = ({
  title,
  desc,
  children,
  classTitle
}: ContentGroupProps) => {
  return (
    <Box>
      <Box className={styles["content__group"]}>
        <Typography
          variant="h5"
          gutterBottom
          className={`${classTitle ? classTitle : ""}`}
        >
          {title}
        </Typography>
        {desc && (
          <Typography
            variant="caption"
            sx={{ fontStyle: "italic", fontSize: "14px" }}
          >
            {desc}
          </Typography>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default ContentGroup;
