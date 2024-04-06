import React, { useState } from "react";

const DropdownSelector = ({ title, options, reflectSelect }) => {
  const [selected, setSelected] = useState(options[0].value);

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    setSelected(newValue);
    reflectSelect(newValue);
  };

  return (
    <>
      <label htmlFor={`${title}_id`}>
        <b>{title}</b>
      </label>
      <select className="form-control" id={`${title}_id`} value={selected} onChange={handleSelectChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default DropdownSelector;
