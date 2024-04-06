import React from "react";

const BootstrapButton = ({ styleType, label, onClick, overrideStyle, disabled }) => {
  const btnClass = `btn btn-${styleType}`;
  const buttonStyle = {
    ...overrideStyle,
    opacity: disabled ? 0.5 : 1, // 비활성화 상태일 때 투명도를 조절하여 비활성화 효과를 줌
  };

  return (
    <button
      type="button"
      className={`BootstrapButton ${btnClass}`}
      onClick={onClick}
      style={buttonStyle}
      disabled={disabled}>
      {label}
    </button>
  );
};

export default BootstrapButton;
