import { useEffect, useState } from "react";

import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import LaunchIcon from "@mui/icons-material/Launch";

import axios from "axios";
import { useRouter } from "next/router";

interface BookCardActionableProps {
  seller?: string;
  price?: Number;
  isRenting?: Boolean;
}

const BookCardActionable = ({
  seller,
  price,
  isRenting
}: BookCardActionableProps) => {
  const theme = useTheme();
  const [sellerName, setSellerName] = useState();
  const router = useRouter();
  const { bookId } = router.query;

  const handleNavigate = (e: any) => {
    e.preventDefault();
    router.push(`/books/${bookId}/${seller}`);
  };

  useEffect(() => {
    (async () => {
      try {
        if (seller) {
          const userRes = await axios.get(`/api/users/wallet/${seller}`);

          if (userRes.data.success === true) {
            setSellerName(userRes.data.data.fullname);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [seller]);

  return (
    <Stack
      onClick={(e) => {
        handleNavigate(e);
      }}
      sx={{
        width: "100%",
        height: "100%",
        // backgroundColor: `${theme.palette.background.default}`,
        backgroundColor: "#D1C5B4",
        borderRadius: "8px",
        boxShadow: "0 2px 4px hsla(200deg, 20%, 20%, 0.25)"
      }}
    >
      <Box
        sx={{
          padding: "20px",
          boxShadow: "0 2px 4px rgba(41, 54, 61, 0.25)",
          borderRadius: "8px 8px 0 0",
          overflow: "hidden",
          fontWeight: "bold",
          fontSize: "20px",
          display: "flex",
          justifyContent: "space-between",
          color: `${theme.palette.common.black}`
        }}
      >
        {sellerName}
        <LaunchIcon
          sx={{
            color: `${theme.palette.common.black}`
          }}
        />
      </Box>
      <Box
        sx={{
          padding: "10px",
          boxShadow: `0 2px 4px rgba(41, 54, 61, 0.25)`,
          borderRadius: "8px",
          overflow: "hidden",
          fontWeight: "bold",
          fontSize: "18px",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: `${theme.palette.primary.main}`,
          color: `${theme.palette.primary.contrastText}`
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: "12px",
            border: `1px solid ${theme.palette.primary.contrastText}`,
            borderRadius: "8px",
            padding: "12px"
          }}
        >
          {`${price ? price : 0} ETH${isRenting ? "/day" : ""}`}
          {/* <Typography variant="body1">($0.00...036)</Typography> */}
        </Box>
      </Box>
    </Stack>
  );
};

export default BookCardActionable;
