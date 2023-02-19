import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import LaunchIcon from "@mui/icons-material/Launch";

import style from "@styles/BookTicket.module.scss";
import { useRouter } from "next/router";

import images from "@/assets/images";
import { truncate } from "@/utils/truncate";

interface BookTicketProps {
  owner: string;
  date: string;
  contractAddress: string;
  price: number | string;
  link: string;
}

const BookTicket = ({
  owner,
  date,
  contractAddress,
  price,
  link
}: BookTicketProps) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box className={style["ticket"]} onClick={() => router.push(`${owner}`)}>
      <Box
        className={style["ticket__top"]}
        sx={{
          backgroundColor: `${theme.palette.background.paper} !important`
        }}
      >
        <header className={style["ticket__wrapper"]}>
          <div className={style["ticket__header"]}>
            NFT Bookstore
            <LaunchIcon color="primary" />
          </div>
        </header>
        <Box
          className={`${style["ticket__divider"]} ${style["ticket__divider--top"]}`}
          sx={{
            backgroundColor: `${theme.palette.background.paper} !important`,
            "&::after": {
              borderBottom: `6px dotted ${theme.palette.background.default} !important`
            }
          }}
        >
          {/* <div className={style["ticket__notch"]}></div> */}
          <Box
            className={`${style["ticket__notch"]} ${style["ticket__notch--topright"]}`}
            sx={{
              "&::after": {
                borderTopColor: `${theme.palette.background.paper} !important`
              }
            }}
          ></Box>
          <Box
            className={`${style["ticket__notch"]} ${style["ticket__notch--topleft"]}`}
            sx={{
              "&::after": {
                borderRightColor: `${theme.palette.background.paper} !important`
              }
            }}
          ></Box>
        </Box>
      </Box>
      <Box className={style["ticket__bottom"]} sx={{}}>
        <Box
          className={`${style["ticket__divider"]} ${style["ticket__divider--bottom"]}`}
          sx={{
            backgroundColor: `${theme.palette.background.paper} !important`,
            "&::after": {
              borderTop: `6px dotted ${theme.palette.background.default} !important`
            }
          }}
        >
          <Box
            className={`${style["ticket__notch"]} ${style["ticket__notch--bottomright"]}`}
            sx={{
              "&::after": {
                borderLeftColor: `${theme.palette.background.paper} !important`
              }
            }}
          ></Box>
          <Box
            className={`${style["ticket__notch"]} ${style["ticket__notch--bottomleft"]}`}
            sx={{
              "&::after": {
                borderBottomColor: `${theme.palette.background.paper} !important`
              }
            }}
          ></Box>
        </Box>
        <Box
          className={style["ticket__body"]}
          sx={{
            backgroundColor: `${theme.palette.background.paper} !important`
          }}
        >
          <Box component="section" className={style["ticket__section"]}>
            <Typography variant="h6">{owner}</Typography>
            <Typography>{date}</Typography>
            <Typography>{truncate(contractAddress, 6, -4)}</Typography>
          </Box>
        </Box>
        <Box
          className={style["ticket__footer"]}
          sx={{
            backgroundColor: `${theme.palette.background.paper} !important`
          }}
        >
          {/* <span>Total Paid</span> */}
          <span>{price} ETH</span>
        </Box>
      </Box>
    </Box>
  );
};

export default BookTicket;
