import React, { useState } from "react";

import { Box, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import { useTranslation } from "next-i18next";

const ScrollButton = () => {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  window.addEventListener("scroll", toggleVisible);

  return (
    <Box className="scroll-wrapper">
      <Tooltip title={t("scrollToTop") as string} placement="top">
        <IconButton
          color="primary"
          onClick={scrollToTop}
          className="scroll-button"
          sx={{
            display: visible ? "flex" : "none",
            color: `${theme.palette.common.black}`
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ScrollButton;
