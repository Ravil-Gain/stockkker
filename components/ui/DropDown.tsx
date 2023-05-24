import * as React from "react";

export interface IOption {
  id: string;
  name: string;
}

export interface IAppProps {
  title: string;
  onSelect: any;
  options: IOption[];
}

export function DropDown(props: IAppProps) {
  const { title, options, onSelect } = props;
  return (
    <label className="flex items-center">
      {title}
      <select
        className="w-48 bg-gray-200 shadow-inner rounded-l p-2 flex-1 ml-5"

        onChange={(e) => {
            onSelect(e.target.value);
        }}
      >
        {options.map((p) => (
          <option value={p.id}>{p.name}</option>
        ))}
      </select>
    </label>
  );
}
