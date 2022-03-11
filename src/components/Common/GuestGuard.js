import React from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../../contextapi/hooks/useAuth";

const GuestGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  let rol = null
  if (typeof user?.Rol !== 'undefined') {
    rol = JSON.parse(user?.Rol);
  }
  if (isAuthenticated) {
    if (rol?.superAdministrador) {
      return <Redirect to="/superAdmin/dashboard" />;
    }
    if (rol?.administrador) {
      return <Redirect to="/administrador/dashboard" />;
    }
    if (rol?.guardia) {
      return <Redirect to="/guardia/dashboard" />;
    }
    else{
      return <Redirect to="/" />;

    }


    
  }

  return <>{children}</>;
};

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default GuestGuard;
