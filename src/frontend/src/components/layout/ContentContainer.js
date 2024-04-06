import React from "react";

const ContentContainer = ({ children }) => {
  return (
    <div className="ContentContainer d-flex-col full-height p-4">
      <div className="Content d-flex-col flex-grow-1 p-4">{children}</div>
    </div>
  );
};

export default React.memo(ContentContainer);
