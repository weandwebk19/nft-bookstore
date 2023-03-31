import { useLayoutEffect, useRef, useState } from "react";
import React from "react";

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

import Spline from "@splinetool/react-spline";
import styles from "@styles/Hero.module.scss";
import { useTranslation } from "next-i18next";

import images from "@/assets/images";
import { useTranslate } from "@/components/hooks/common";
import { StackedLogo } from "@/components/shared/Logo";
import { StyledButton } from "@/styles/components/Button";
import cssFilter from "@/utils/cssFilter";

const Hero = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box className={styles.hero}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          p: 6
        }}
      >
        <Stack sx={{ maxWidth: "450px" }}>
          <Box
            component="img"
            src={images.stackedLogo}
            mb={3}
            sx={{
              maxWidth: "385px",
              filter: cssFilter(`${theme.palette.common.white}`)
            }}
          />
          <Typography color={`${theme.palette.common.white}`}>
            {t("home:subtitle")}
          </Typography>
          <Stack sx={{ mt: 3 }} direction="row" spacing={2}>
            <StyledButton customVariant="primary" customColor="light">
              <InsertDriveFileOutlinedIcon sx={{ mr: 1 }} />
              whitepaper
            </StyledButton>
            <StyledButton
              component={Link}
              customVariant="secondary"
              customColor="light"
              href="https://github.com/weandwebk19/nft-bookstore"
              target="_blank"
            >
              <CodeOutlinedIcon sx={{ mr: 1 }} />
              github
            </StyledButton>
          </Stack>
        </Stack>
      </Box>

      <Spline scene="https://prod.spline.design/juq9OBGTG4B5Kmx1/scene.splinecode" />

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "12px",
          backgroundColor: `${theme.palette.primary.main}`
        }}
      />
    </Box>
  );
};

export default Hero;
