import React from "react";
import CustomButton from "../components/common/CustomButton";
import { useNavigate } from "../lib/rrfs/index.js";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="NotFoundPage">
      <div className="d-flex-col full-height text-center justify-content-center align-items-center">
        <h1 className="mb-4" style={{ color: "white", fontFamily: "Orbit" }}>
          이런! 유효하지 않은 경로입니다.
        </h1>
        <CustomButton label={"홈으로 이동"} color={"blue"} onClick={handleGoHome} overrideStyle={{ width: "200px" }} />
      </div>
    </div>
  );
};

export default NotFoundPage;
