import * as React from "react";

export interface IShelfStatusProps {
  onShelf: number;
  onHold: number;
  maxValue: number;
}

export function ShelfStatusBar(props: IShelfStatusProps) {
  const { onShelf, onHold, maxValue } = props;
  const positive: boolean = onShelf > onHold;

  // calculate % of green area
  const avalibleValue = (onShelf - onHold) / onShelf;
  const onHoldValue = 1 - avalibleValue;

  const negativeLabel = positive ? "" : `${(onShelf - onHold).toFixed(0)}`;

  return (
    <div className="flex h-6 w-full rounded-lg">
      <div className="flex flex-row-reverse h-full w-1/3 rounded-l-lg">
        <div
          className={`h-full ${
            positive ? "w-0" : "w-full"
          } bg-red-600 rounded-l-lg`}
        >
          <span className={"p-1 text-white"}>{negativeLabel}</span>
        </div>
      </div>
      <div className="flex h-full w-2/3">
        <div
          className="flex"
          style={{ width: `${Math.min(onShelf / maxValue, 1) * 100}%` }}
        >
          <div
            className={`h-full bg-green-600 ${
              onHold === 0 ? "rounded-r-lg" : ""
            }`}
            style={{ width: `${positive ? avalibleValue * 100 : 0}%` }}
          ></div>
          <div
            className="h-full bg-red-300 rounded-r-lg"
            style={{ width: `${onHoldValue * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
