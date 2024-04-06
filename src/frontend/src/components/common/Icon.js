import React from "react";

const Icon = ({ filename, alt, invert = false }) => {
  return (
    <img
      className={`icon ${invert ? "invert-image" : ""}`}
      src={`${process.env.ASSETS_URL}/icons/${filename}`}
      alt={alt}
    />
  );
};

export default Icon;
