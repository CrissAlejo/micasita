import React from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../../contextapi/hooks/useAuth";
const AdminGuard = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  let rol = null;
  if (typeof user?.Rol !== "undefined") {
    rol = JSON.parse(user?.Rol);
  }
  if (!isAuthenticated) {
    if (rol?.administrador) {
      return <Redirect to="/administrador/dashboard" />;
    }else{
      return <Redirect to="/404" />;

    }
  }

  return <>{children}</>;
};

AdminGuard.propTypes = {
  children: PropTypes.node,
};

export default AdminGuard;
