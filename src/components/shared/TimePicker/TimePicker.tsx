import * as React from "react";

import TextField from "@mui/material/TextField";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker as MUITimePicker } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";

interface TimePickerProps {
  label?: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}

export default function TimePicker({
  label,
  value,
  onChange
}: TimePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MUITimePicker
        label={label}
        value={value}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
