import React from "react";
import Img from "../../assets/img/mi.png";

const LogoDown = (props) => {
  return (
    <a href="/">
      <img
      alt="Logo"
      style={{ width: "140px",marginLeft:'20%', height: "100px" }}
      /* src="/static/logo.svg" */
      src={Img}
      {...props}
    />
    </a>
  );
};

export default LogoDown;
