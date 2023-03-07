import * as React from "react";

import TextField from "@mui/material/TextField";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";

interface DatePickerProps {
  label?: string;
  inputFormat?: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}

export default function DatePicker({
  label,
  inputFormat = "MM/DD/YYYY",
  value,
  onChange
}: DatePickerProps) {
  // const [value, setValue] = React.useState<Dayjs | null>(dayjs());

  // const handleChange = (newValue: Dayjs | null) => {
  //   setValue(newValue);
  // };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        disablePast
        label={label}
        inputFormat={inputFormat}
        value={value}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
