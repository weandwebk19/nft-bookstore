import { forwardRef } from "react";

import { Box } from "@mui/material";

import images from "@/assets/images";

const PageTransition = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    // <Box
    //   sx={
    //     {
    //       // "&.page-enter": {},
    //       // "&.page-enter-active": {
    //       //   position: "absolute",
    //       //   top: 0,
    //       //   left: 0,
    //       //   width: "100%",
    //       //   opacity: 0
    //       // },
    //       // "&.page-exit": {
    //       //   "~ .wipe": {
    //       //     transform: "translateY(100%)"
    //       //   }
    //       // },
    //       // "&.page-exit-active": {
    //       //   "~ .wipe": {
    //       //     transform: "translateY(0)",
    //       //     transition: "transform 1000ms ease"
    //       //   }
    //       // },
    //       // "&.page-enter-done": {
    //       //   "~ .wipe": {
    //       //     transform: "translateY(-100%)",
    //       //     transition: "transform 1000ms ease"
    //       //   }
    //       // }
    //     }
    //   }
    // ></Box>
    // {/* <Box
    //   className="wipe"
    //   sx={{
    //     position: "fixed",
    //     top: "0",
    //     left: "0",
    //     width: "100%",
    //     height: "100vh",
    //     backgroundColor: "teal",
    //     zIndex: 5
    //     // transform: "translateY(100%)"
    //   }}
    // /> */}
    // <div ref={ref as React.RefObject<HTMLDivElement>} className="loader">
    //   <Box
    //     component="img"
    //     src={images.loading}
    //     alt="Loading..."
    //     sx={{ height: "200px", width: "200px", position: "absolute" }}
    //   />
    // </div>
    <Box></Box>
  );
});

PageTransition.displayName = "PageTransition";

export default PageTransition;
