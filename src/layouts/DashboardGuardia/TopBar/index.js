import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  AppBar,
  Box,
  Hidden,
  Toolbar,
  makeStyles,
} from "@material-ui/core";
import Logo from "../../../components/Common/Logo";
import Account from "./Account";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "transparent",

    zIndex: "1029",


    
  },
  toolbar: {
    minHeight: 64,

  },
}));

const TopBar = ({ className, onMobileNavOpen, img, ...rest }) => {
const classes = useStyles();

  return (
    <AppBar className={clsx(classes.root, className)} {...rest}>
      <Toolbar className={classes.toolbar}>
        <Hidden >
        <Logo img={img} />
        </Hidden>
        <Box ml={2} flexGrow={1} />

        <Box ml={2}>
          <Account />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

TopBar.defaultProps = {
  onMobileNavOpen: () => {},
};

export default TopBar;
