import React, { useEffect, useState } from "react";

const ProfileTextLine = ({ label, value, isEditing = false, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value, isEditing]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="ProfileTextLine d-flex justify-content-between mb-2">
      <label>{label}: </label>
      {isEditing ? <input type="text" value={inputValue} onChange={handleChange} /> : <span>{inputValue}</span>}
    </div>
  );
};

export default ProfileTextLine;
