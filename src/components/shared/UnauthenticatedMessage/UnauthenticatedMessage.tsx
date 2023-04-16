import { Typography } from "@mui/material";

import { useRouter } from "next/router";

interface UnauthenticatedMessageProps {
  timeout?: number;
  textVariant?:
    | "button"
    | "caption"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "label"
    | "inherit"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "overline"
    | undefined;
}

const UnauthenticatedMessage = ({
  timeout = 2500,
  textVariant = "h5"
}: UnauthenticatedMessageProps) => {
  const router = useRouter();
  setTimeout(() => {
    router.push("/");
  }, timeout);
  return (
    <Typography variant={textVariant} color="error">
      Unauthenticated! You will be redirected to home page.
    </Typography>
  );
};

export default UnauthenticatedMessage;
