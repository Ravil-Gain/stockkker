import TextField from "@mui/material/TextField";
import * as React from "react";

export interface IAppProps {
  label: string;
  required?: boolean;
  value: number;
  setValue: any;
}

export function NumberField(props: IAppProps) {
  const { required = false, value, setValue, label } = props;
  return (
    <TextField
      required={required}
      id="outlined-basic"
      label={label}
      variant="outlined"
      value={value}
      onChange={(e) => {
        const numberValue: number = Number(e.target.value);
        setValue(numberValue);
      }}
      onKeyPress={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }}
    />
  );
}
