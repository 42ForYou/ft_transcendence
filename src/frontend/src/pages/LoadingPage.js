import React from "react";

const LoadingPage = ({ loadingMsg }) => {
  return (
    <div
      className="LoadingPage text-center d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="spinner-border" role="status" style={{ width: "3rem", height: "3rem", color: "white" }}>
          <span className="sr-only">Loading...</span>
        </div>
        <p style={{ color: "white", marginTop: "20px" }}>{loadingMsg ? loadingMsg : "Loading..."}</p>
      </div>
    </div>
  );
};

export default LoadingPage;
