import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import styles from "@styles/Hero.module.scss";

import images from "@/assets/images";
import { StackedLogo } from "@/components/shared/Logo";
import { StyledButton } from "@/styles/components/Button";
import cssFilter from "@/utils/cssFilter";

const Hero = () => {
  const theme = useTheme();

  return (
    <Box className={styles.hero}>
      <Container>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ display: { xs: "none", sm: "none", md: "flex" } }}
        >
          <Stack>
            <Box
              component="img"
              src={images.stackedLogo}
              mb={3}
              sx={{
                maxWidth: "385px",
                filter: cssFilter(`${theme.palette.primary.main}`)
              }}
            />
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
          <Box>
            <Box component="img" src={images.heroImg} />
            <figcaption>
              Second Hand Stories by David Carmack Lewis, 2003.
            </figcaption>
          </Box>
        </Grid>

        {/* Tablet */}
        <Box sx={{ display: { sm: "flex", md: "none" } }}>
          <Box>
            <Box
              component="img"
              src={images.stackedLogo}
              mb={3}
              sx={{
                maxWidth: "385px",
                filter: cssFilter(`${theme.palette.primary.main}`)
              }}
            />
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
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: -1,
              width: "100vw",
              height: "100%",
              backgroundImage: `linear-gradient(to right, ${alpha(
                theme.palette.background.default,
                0.7
              )}, rgba(0, 0, 0, 0)), url(${images.heroImg})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover"
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
