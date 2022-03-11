import React from "react";
import Img from "../../assets/img/TGLabsLogo.svg";

const Logo = (props) => {
  return (
    <img
      alt="Logo"
      style={{ width: "120px", height: "50px", marginLeft: 256 }}
      /* 1 src="/static/logo1.svg" */
      src={props.img}
      {...props}
    />
  );
};

export default Logo;
