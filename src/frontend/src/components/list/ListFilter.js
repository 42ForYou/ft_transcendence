import React from "react";
import BootstrapButton from "../common/BootstrapButton";

const ListFilter = ({ filterTypes, currentFilter, onFilterClick, rightButton }) => {
  return (
    <div className="ListFilter d-flex justify-content-between py-1">
      <div className="FilterType">
        {filterTypes.map((type, index) => (
          <React.Fragment key={type.value}>
            <BootstrapButton
              label={type.label}
              styleType={`link ${currentFilter.value === type.value ? "selectedFilter" : ""}`}
              onClick={() => onFilterClick(type)}
            />
            {index < filterTypes.length - 1 && " | "}
          </React.Fragment>
        ))}
      </div>
      <div>{rightButton}</div>
    </div>
  );
};

export default ListFilter;
