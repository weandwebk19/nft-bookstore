import { Typography } from "@mui/material";

import Link from "next/link";
import { useRouter } from "next/router";

import { StyledButton } from "@/styles/components/Button";

const Publish = () => {
  const router = useRouter();
  return (
    <>
      <Typography variant="h1">Publish PAGE NÈ</Typography>;
      <StyledButton
        customVariant="primary"
        onClick={() => router.push("/publish/1")}
      >
        Book Details
      </StyledButton>
    </>
  );
};

export default Publish;
