import { Box, Typography } from "@mui/material";

import styles from "@styles/Profile.module.scss";

interface ProfileGroupProps {
  title: React.ReactNode | string;
  children: React.ReactNode;
}

const ProfileGroup = ({ title, children }: ProfileGroupProps) => {
  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        className={styles["profile__group__title"]}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
};

export default ProfileGroup;
