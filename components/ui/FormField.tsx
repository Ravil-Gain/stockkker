import * as React from "react";

export interface IFormFieldProps {
  title: string;
  name: string;
  value:any;
  type: "number" | "string";
  onChange?: any;
  pattern?: string;
}

export function FormField(props: IFormFieldProps) {
  const { title, type, name, value, onChange, pattern } = props;
  return (
    <label className="flex items-center">
      {title}
      <input
        className="w-48 bg-gray-200 shadow-inner rounded-l p-2 flex-1 ml-5"
        id={name}
        type={type}
        pattern={pattern}
        value={value}
        onKeyPress={
          type === "number"
            ? (event) => !/[0-9]/.test(event.key) && event.preventDefault()
            : () => {}
        }
        onChange={onChange}
      />
    </label>
  );
}
