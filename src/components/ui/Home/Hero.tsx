import { Box, Container, Grid, Stack, Typography } from "@mui/material";

import styles from "@styles/Hero.module.scss";

import images from "@/assets/images";

const Hero = () => {
  return (
    <Box className={styles.hero}>
      <Container>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack>
            <Box component="img" src={images.stackedLogo} width={385} mb={3} />

            <Typography variant="body1">
              We wants to change the way people read
            </Typography>
            <Typography variant="body1">
              books by making them more accessible and
            </Typography>
            <Typography variant="body1">inexpensive for everyone.</Typography>
          </Stack>
          <Box component="img" src="" />
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
