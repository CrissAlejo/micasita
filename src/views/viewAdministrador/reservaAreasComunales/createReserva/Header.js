import React from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Typography, Breadcrumbs, Link, makeStyles } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const useStyles = makeStyles(() => ({
  root: {
    paddingLeft: "20px",
  },
}));

const Header = (props, { className, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          color="inherit"
          to="/administrador/reservasxaprobar"
          component={RouterLink}
        >
          Reservar Áreas
        </Link>
        <Typography color="textPrimary">Formulario de Reserva - <b>{props.area}</b></Typography>
      </Breadcrumbs>

    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;