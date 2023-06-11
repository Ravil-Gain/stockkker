import * as React from "react";

export interface IShelfStatusProps {
  onShelf: number;
  onHold: number;
  //   max?: number;
}

export function ShelfStatus(props: IShelfStatusProps) {
  const { onShelf, onHold } = props;
  const positive: boolean = onShelf > onHold;

  const n1:number = (onShelf - onHold) / onShelf;
  const n2 = 1-n1;

//   const onShelfSize =  (onShelf - onHold / onShelf).toFixed();
// //   const onHoldSize = 

//   const completed: number = 50;

  const negativeLabel = positive ? "" : `${(onShelf - onHold).toFixed(0)}`;
//   const positiveLabel = positive ? `${(onShelf - onHold).toFixed(0)}` : "";

  const containerStyles = {
    display: "flex",
    height: 20,
    width: "100%",
    borderRadius: 5,
  };

  const negativeContainerStyles = {
    display: "flex",
    flexDirection: "row-reverse",
    height: 20,
    width: "50%",
    borderRadius: 5,
  };

  const positiveContainerStyles = {
    display: "flex",
    height: 20,
    width: "50%",
    borderRadius: 5,
  };

  const negativeFillerStyles = {
    height: "100%",
    width: `${positive ? 0 : 0.3}`,
    backgroundColor: "red",
    borderRadius: "inherit",
  };

  const positiveFillerStyles = {
    height: "100%",
    width: `${positive ? n1*100 : 0}%`,
    backgroundColor: "green",
    borderRadius: "inherit",
  };

  const onHoldFillerStyles = {
    height: "100%",
    width: `${ n2*100 }%`,
    backgroundColor: "rgb(255, 190, 190)",
    borderRadius: "inherit",
  };

  const labelStyles = {
    padding: 5,
    color: "white",
  };

  return (
    <div style={containerStyles}>
      <div style={negativeContainerStyles}>
        <div style={negativeFillerStyles}>
          <span style={labelStyles}>{negativeLabel}</span>
        </div>
      </div>
      <div style={positiveContainerStyles}>
        <div style={positiveFillerStyles}></div>
        <div style={onHoldFillerStyles}></div>
      </div>
    </div>
  );
}
