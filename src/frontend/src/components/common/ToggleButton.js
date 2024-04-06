import React from "react";

const ToggleButton = ({ label, isToggled, onToggle, loading }) => {
  const handleToggle = () => {
    if (!loading) {
      onToggle();
    }
  };

  return (
    <div className={`toggle-button ${isToggled ? "toggled" : ""}`} onClick={handleToggle}>
      <div className="toggle-button-circle"></div>
    </div>
  );
};

export default ToggleButton;
