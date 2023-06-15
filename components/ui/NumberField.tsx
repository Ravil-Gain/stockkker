import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import * as React from "react";

export interface IAppProps {
  label: string;
  required?: boolean;
  value: number;
  setValue: any;
  endAdornment?: string;
  disabled?: boolean;
  sx?: any;
}

export function NumberField(props: IAppProps) {
  const {
    required = false,
    value,
    setValue,
    label,
    endAdornment,
    disabled,
    sx,
  } = props;
  return (
    <TextField
      sx={sx}
      required={required}
      id="outlined-basic"
      label={label}
      variant="outlined"
      value={value}
      disabled={disabled}
      onChange={(e) => {
        const numberValue: number = Number(e.target.value);
        setValue(numberValue);
      }}
      onKeyPress={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">{endAdornment || ""}</InputAdornment>
        ),
      }}
    />
  );
}
