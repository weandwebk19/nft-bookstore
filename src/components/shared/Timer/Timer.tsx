import { useState } from "react";

type TimerProps = {
  startDate: Date;
  endDate: Date;
};

const Timer = ({ startDate, endDate }: TimerProps) => {
  const [state, setState] = useState({
    endDate: new Date(),
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
};

export default Timer;
