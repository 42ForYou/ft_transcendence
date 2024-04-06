import React from "react";

const FlexContainer = ({ alignment = "start", children }) => {
  const justifyContentClass =
    {
      between: "justify-content-between",
      end: "justify-content-end",
      start: "justify-content-start",
      center: "justify-content-center",
    }[alignment] || "justify-content-start"; // 기본값은 'justify-content-start'

  return <div className={`row d-flex ${justifyContentClass}`}>{children}</div>;
};

export default FlexContainer;
