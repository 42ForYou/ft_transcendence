import React, { useState } from "react";

const RadioSelector = ({ title, options, reflectSelect }) => {
  const [selected, setSelected] = useState(options[0].value);

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    setSelected(newValue);
    reflectSelect(newValue);
  };

  return (
    <div className="form-group">
      <label>
        <b>{title}</b>
      </label>
      {options.map((option) => (
        <div className="form-check" key={option.value}>
          <input
            className="form-check-input"
            type="radio"
            name={title}
            id={`${option.value}_id`}
            value={option.value}
            checked={selected === option.value}
            onChange={handleSelectChange}
          />
          <label className="form-check-label" htmlFor={`${option.value}_id`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioSelector;
