import { Box, Stack, Typography } from "@mui/material";

import { useRouter } from "next/router";

import { StyledButton } from "@/styles/components/Button";

interface UnauthorizedMessageProps {
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

const UnauthorizedMessage = ({
  timeout = 2500,
  textVariant = "h5"
}: UnauthorizedMessageProps) => {
  const router = useRouter();
  // setTimeout(() => {
  //   try {
  //     router.push("/author/request");
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }, timeout);
  return (
    <Box>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translateX(-50%) translateY(-50%)"
        }}
      >
        <Stack alignItems="center" spacing={3}>
          <Typography>
            Please register to become an author before creating new book
          </Typography>
          <StyledButton
            onClick={() => {
              router.push("/author/request");
            }}
          >
            Become an author
          </StyledButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default UnauthorizedMessage;
