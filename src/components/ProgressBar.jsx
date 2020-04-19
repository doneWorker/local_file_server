import React from "react";

const ProgressBar = ({ percent, color }) => {
  return (
    <progress className="progress is-success" value={percent} max="100">
      {percent} %
    </progress>
  );
};

export default ProgressBar;
