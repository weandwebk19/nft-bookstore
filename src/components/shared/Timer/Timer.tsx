import { useState } from "react";

import { Stack, Typography } from "@mui/material";

type TimerProps = {
  value: number;
  type?: string;
  isDanger?: boolean;
  typoVariant?:
    | "button"
    | "caption"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "label"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "overline"
    | "inherit"
    | undefined;
};

const Timer = ({ value, type, isDanger, typoVariant }: TimerProps) => {
  return (
    <Stack direction="row" spacing={1}>
      {(() => {
        if (type === "days") {
          return <Typography variant={typoVariant}>{value}D</Typography>;
        }
        return (() => {
          if (value < 10)
            return <Typography variant={typoVariant}>0{value}</Typography>;
          return <Typography variant={typoVariant}>{value}</Typography>;
        })();
      })()}
    </Stack>
  );
};

export default Timer;
