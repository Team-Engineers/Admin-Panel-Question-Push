import React from "react";
import "./Loader.css"
const CuetLoader = () => {
  const loaderStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    background: "#FCFCFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    overflow: "hidden",
  };

  return (
    <div style={loaderStyles}>
      <div class="three-body">
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
      </div>
    </div>
  );
};

export default CuetLoader;