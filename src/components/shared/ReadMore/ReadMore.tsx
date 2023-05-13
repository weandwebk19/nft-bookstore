import { useState } from "react";

import { Box, Collapse, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ReadMoreProps {
  children: React.ReactNode | string;
  maxLines?: number;
}

const ReadMore = ({ children, maxLines = 200 }: ReadMoreProps) => {
  const theme = useTheme();
  const typeofChildren = typeof children;

  const text = children;
  const textLength = typeof text === "string" ? text.length : 0;
  const [isReadMore, setIsReadMore] = useState(false);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <Box>
      {typeofChildren !== "string" && (
        <>
          <Collapse
            in={isReadMore}
            collapsedSize={maxLines}
            sx={{
              width: "100%",
              // height: isReadMore ? "250px" : "100%",
              overflowY: "hidden",
              position: "relative",
              "& :after": {
                content: `""`,
                position: "absolute",
                zIndex: 1,
                bottom: 0,
                left: 0,
                pointerEvents: "none",
                backgroundImage: isReadMore
                  ? ""
                  : `linear-gradient(to bottom, 
                    rgba(255,255,255, 0), 
                    ${theme.palette.background.default} 90%)`,
                opacity: "30%",
                width: "100%",
                height: "2em"
              }
            }}
          >
            {children}
          </Collapse>
          <Box
            onClick={toggleReadMore}
            sx={{
              color: `${theme.palette.text.secondary}`,
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {isReadMore ? "show less" : "...read more"}
          </Box>
        </>
      )}
      {typeofChildren === "string" && (
        <Typography>
          {!isReadMore ? (text as string).slice(0, maxLines) : (text as string)}
          <Box
            component="span"
            onClick={toggleReadMore}
            sx={{
              color: `${theme.palette.text.secondary}`,
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {textLength > maxLines
              ? isReadMore
                ? "show less"
                : "...read more"
              : ""}
          </Box>
        </Typography>
      )}
    </Box>
  );
};

export default ReadMore;
//                    rgba(234, 225, 217, 0.2) 90%)`,
