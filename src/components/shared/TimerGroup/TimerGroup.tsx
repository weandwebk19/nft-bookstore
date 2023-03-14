import { useEffect, useState } from "react";

import { Stack } from "@mui/material";

import { useCountdown } from "@/components/hooks/common";

import { Timer } from "../Timer";

interface TimerGroupProps {
  endDate: string;
}

const TimerGroup = ({ endDate }: TimerGroupProps) => {
  const [days, hours, minutes, seconds] = useCountdown(endDate);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    setCountdown({ days, hours, minutes, seconds });
  }, [days, hours, minutes, seconds]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Timer value={countdown.days} type="days" typoVariant="h6" />:
      <Timer value={countdown.hours} typoVariant="h6" />:
      <Timer value={countdown.minutes} typoVariant="h6" />:
      <Timer value={countdown.seconds} typoVariant="h6" />
    </Stack>
  );
};

export default TimerGroup;
