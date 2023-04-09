import React, { useState } from "react";

import { Box, IconButton } from "@mui/material";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const ScrollButton = () => {
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
      <IconButton
        color="primary"
        onClick={scrollToTop}
        className="scroll-button"
        sx={{
          display: visible ? "flex" : "none"
        }}
      >
        <ArrowUpwardIcon />
      </IconButton>
    </Box>
  );
};

export default ScrollButton;
