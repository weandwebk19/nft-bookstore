import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import LaunchIcon from "@mui/icons-material/Launch";

import style from "@styles/BookTicket.module.scss";
import { useRouter } from "next/router";

import { Image } from "../Image";

interface TicketProps {
  header?: string;
  body?: string[] | string;
  image?: string;
  footer?: string;
  href: string;
  icon?: string;
}

const Ticket = ({ header, body, image, footer, href, icon }: TicketProps) => {
  const theme = useTheme();
  const router = useRouter();

  const handleNavigate = (e: any) => {
    e.preventDefault();
    router.push(`${href}`);
  };

  return (
    // older UI
    // <Box
    //   className={style["ticket"]}
    //   onClick={(e) => {
    //     handleNavigate(e);
    //   }}
    // >
    //   <Box
    //     className={style["ticket__top"]}
    //     sx={{
    //       backgroundColor: `${theme.palette.background.paper} !important`
    //     }}
    //   >
    //     <header className={style["ticket__wrapper"]}>
    //       <div className={style["ticket__header"]}>
    //         {header}
    //         <LaunchIcon color="primary" />
    //       </div>
    //     </header>
    //     <Box
    //       className={`${style["ticket__divider"]} ${style["ticket__divider--top"]}`}
    //       sx={{
    //         backgroundColor: `${theme.palette.background.paper} !important`,
    //         "&::after": {
    //           borderBottom: `6px dotted ${theme.palette.background.default} !important`
    //         }
    //       }}
    //     >
    //       {/* <div className={style["ticket__notch"]}></div> */}
    //       <Box
    //         className={`${style["ticket__notch"]} ${style["ticket__notch--topright"]}`}
    //         sx={{
    //           "&::after": {
    //             borderTopColor: `${theme.palette.background.paper} !important`
    //           }
    //         }}
    //       ></Box>
    //       <Box
    //         className={`${style["ticket__notch"]} ${style["ticket__notch--topleft"]}`}
    //         sx={{
    //           "&::after": {
    //             borderRightColor: `${theme.palette.background.paper} !important`
    //           }
    //         }}
    //       ></Box>
    //     </Box>
    //   </Box>
    //   <Box className={style["ticket__bottom"]} sx={{}}>
    //     <Box
    //       className={`${style["ticket__divider"]} ${style["ticket__divider--bottom"]}`}
    //       sx={{
    //         backgroundColor: `${theme.palette.background.paper} !important`,
    //         "&::after": {
    //           borderTop: `6px dotted ${theme.palette.background.default} !important`
    //         }
    //       }}
    //     >
    //       <Box
    //         className={`${style["ticket__notch"]} ${style["ticket__notch--bottomright"]}`}
    //         sx={{
    //           "&::after": {
    //             borderLeftColor: `${theme.palette.background.paper} !important`
    //           }
    //         }}
    //       ></Box>
    //       <Box
    //         className={`${style["ticket__notch"]} ${style["ticket__notch--bottomleft"]}`}
    //         sx={{
    //           "&::after": {
    //             borderBottomColor: `${theme.palette.background.paper} !important`
    //           }
    //         }}
    //       ></Box>
    //     </Box>
    //     <Box
    //       className={style["ticket__body"]}
    //       sx={{
    //         backgroundColor: `${theme.palette.background.paper} !important`
    //       }}
    //     >
    //       {image && (
    //         <Box
    //           sx={{
    //             width: "100%",
    //             height: "10em",
    //             backgroundImage: `url(${image})`,
    //             backgroundSize: "cover"
    //           }}
    //         />
    //       )}
    //       {body && (
    //         <Box component="section" className={style["ticket__section"]}>
    //           {body?.map((text, i) => {
    //             if (!i) return <Typography variant="h6">{text}</Typography>;
    //             return <Typography key={i}>{text}</Typography>;
    //           })}
    //           {/* <Typography>{date}</Typography>
    //         <Typography>{truncate(contractAddress, 6, -4)}</Typography> */}
    //         </Box>
    //       )}
    //     </Box>
    //     <Box
    //       className={style["ticket__footer"]}
    //       sx={{
    //         backgroundColor: `${theme.palette.background.paper} !important`
    //       }}
    //     >
    //       {/* <span>Total Paid</span> */}
    //       <span>{footer}</span>
    //     </Box>
    //   </Box>
    // </Box>

    // latest UI

    <Box
      onClick={(e) => {
        handleNavigate(e);
      }}
      sx={{
        cursor: "pointer",
        position: "relative",
        p: 1,
        transition: "all 0.3s ease",
        minHeight: "337px",
        ":hover": {
          p: 0,
          "> .ticket-text": {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            width: "100%",
            textAlign: "center",
            color: `${theme.palette.common.white}`
          },
          "> .ticket-border": {
            transform: "rotate(3deg)"
          },
          "> .ticket-image": {
            backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2)), url(${image})`,
            height: "21em"
          },
          "> .ticket-image .ticket-icon": {
            display: "none"
          }
        }
      }}
    >
      <Box
        className="ticket-border"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          border: `1px solid ${theme.palette.primary.main}`,
          outline: `1px solid ${theme.palette.primary.main}`,
          outlineOffset: "3px",
          width: "100%",
          height: "100%",
          transition: "all 0.3s ease"
        }}
      ></Box>
      {image && (
        <Box
          className="ticket-image"
          sx={{
            width: "100%",
            height: "12em",
            backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.0)), url(${image})`,
            backgroundSize: "cover",
            transition: "all 0.3s ease",
            position: "relative"
          }}
        >
          {icon && (
            // <img src={icon} />
            <Box
              className="ticket-icon"
              sx={{
                position: "absolute",
                width: 170,
                height: 150,
                top: "50%",
                left: "50%",
                transform: "translateX(-50%) translateY(-50%)"
              }}
            >
              <Image
                src={icon}
                alt={header}
                sx={{ width: "100%", height: "100%" }}
              />
            </Box>
          )}
        </Box>
      )}

      <Stack
        className="ticket-text"
        sx={{
          transition: "all 0.3s ease",
          position: "absolute",
          color: `${theme.palette.primary.main}`
        }}
      >
        <Typography variant="h5" gutterBottom>
          {header}
        </Typography>
        <Typography
          sx={{
            minHeight: "96px"
          }}
        >
          {body}
        </Typography>
        <Typography>{footer}</Typography>
      </Stack>
    </Box>
  );
};

export default Ticket;
