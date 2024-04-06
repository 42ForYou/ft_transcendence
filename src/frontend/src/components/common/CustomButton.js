import React from "react";

const CustomButton = ({ label, color, onClick, overrideStyle, disabled, opacity }) => {
  const backgroundColorClass = `background-${color}` || "background-default";

  const computedOpacity = opacity || (disabled ? 0.5 : 1);

  const buttonStyle = {
    opacity: computedOpacity,
    ...overrideStyle,
  };

  return (
    <button
      type="button"
      className={`CustomButton ${backgroundColorClass}`}
      onClick={onClick}
      style={buttonStyle}
      disabled={disabled}>
      {label}
    </button>
  );
};

export default CustomButton;
