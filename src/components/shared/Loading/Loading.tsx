import { forwardRef, useEffect, useState } from "react";

import { Box, Fade } from "@mui/material";

import { useRouter } from "next/router";

import images from "@/assets/images";

interface LoadingProps {
  className?: string;
}

const Loading = forwardRef<HTMLDivElement>(
  ({ className = "" }: LoadingProps, ref) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const handleStart = (url: string) => {
        if (url !== router.asPath) {
          setLoading(true);
        }
      };

      const handleComplete = (url: string) => {
        console.log("url", String(url).split("?")[0]);
        console.log("router.asPath", router.pathname.split("?")[0]);
        if (router.locale === "en") {
          if (!url && !router.asPath) {
            setLoading(false);
          } else if (
            String(url).split("?")[0] === router.asPath.split("?")[0]
          ) {
            setLoading(false);
          }
        } else {
          const baseUrlWithoutLocale = `/${router.locale}`;
          if (url.toString().startsWith(baseUrlWithoutLocale)) {
            const pathWithoutLocale = url
              .split("?")[0] // get without the query string
              .substring(baseUrlWithoutLocale.length);
            console.log("pathWithoutLocale", pathWithoutLocale);

            if (!url && !router.asPath) {
              setLoading(false);
            } else if (pathWithoutLocale === router.asPath.split("?")[0]) {
              // setTimeout(() => setLoading(false), 0);

              setLoading(false);
            }
          }
        }

        if (router.asPath === "/") {
          setLoading(false);
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

    useEffect(() => {
      setLoading(false);
    }, [router.locale]);

    return (
      <Box sx={{ zIndex: 99999999 }}>
        {loading && (
          <Fade in={loading}>
            <div
              ref={ref as React.RefObject<HTMLDivElement>}
              className={`loader ${className}`}
            >
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
      </Box>
    );
  }
);

Loading.displayName = "Loading";

export default Loading;
