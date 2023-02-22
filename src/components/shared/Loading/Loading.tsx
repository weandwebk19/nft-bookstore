import { forwardRef, useEffect, useState } from "react";

import { Box, Fade } from "@mui/material";

import { useRouter } from "next/router";

import images from "@/assets/images";

const Loading = forwardRef<HTMLDivElement>((props, ref) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        setLoading(true);
      }
    };

    const handleComplete = (url: string) => {
      if (url === router.asPath) {
        setTimeout(() => setLoading(false), 500);
      }
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return (
    <>
      {loading && (
        <Fade in={loading}>
          <div ref={ref as React.RefObject<HTMLDivElement>} className="loader">
            <Box
              component="img"
              src={images.loading}
              alt="Loading..."
              sx={{
                height: "200px",
                width: "200px",
                position: "absolute",
                borderRadius: "10em"
              }}
            />
          </div>
        </Fade>
      )}
    </>
  );
});

Loading.displayName = "Loading";

export default Loading;
