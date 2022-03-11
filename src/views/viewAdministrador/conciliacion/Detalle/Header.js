import React from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Typography, Breadcrumbs, Link, makeStyles } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const useStyles = makeStyles(() => ({
  root: {},
}));

const Header = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          color="inherit"
          to="/administrador/conciliaciones"
          component={RouterLink}
        >
          Conciliaciones
        </Link>
        <Typography color="textPrimary">Ingresos y egresos</Typography>
      </Breadcrumbs>

    </div>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
