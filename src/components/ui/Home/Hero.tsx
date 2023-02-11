import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Stack,
  Typography
} from "@mui/material";

import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import styles from "@styles/Hero.module.scss";

import images from "@/assets/images";
import { StyledButton } from "@/styles/components/Button";

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
            <Stack sx={{ mt: 3 }} direction="row" spacing={2}>
              <StyledButton customVariant="primary">
                <InsertDriveFileOutlinedIcon sx={{ mr: 1 }} />
                whitepaper
              </StyledButton>
              <StyledButton
                component={Link}
                customVariant="secondary"
                href="https://github.com/weandwebk19/nft-bookstore"
                target="_blank"
              >
                <CodeOutlinedIcon sx={{ mr: 1 }} />
                github
              </StyledButton>
            </Stack>
          </Stack>
          <Box component="img" src="" />
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
