import React from "react";
import Img from "../../assets/img/data-missing/data-missing-icon.svg";

const Logo = (props) => {
  return (
    <img
      alt="Logo"
      style={{ width: "140px", height: "100px" }}
      src={Img}
      {...props}
    />
  );
};

export default Logo;
