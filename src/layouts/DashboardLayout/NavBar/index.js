import React, {  Fragment } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  ListSubheader,
  makeStyles,
} from "@material-ui/core";
import Dashboard from "@material-ui/icons/Dashboard";
import Home from "@material-ui/icons/Home";
import Logo from "../../../components/Common/Logo";
import LogoDown from "../../../components/Common/LogoDown";
import NavItem from "./NavItem";
import PeopleIcon from "@material-ui/icons/People";
import AddToQueue from "@material-ui/icons/AddToQueue";

const sectionsAdmin = [
  {
    items: [
      {
        title: "Dasboard",
        icon: Dashboard,
        href: "/superAdmin/dashboard",
      },
      {
        title: "Conjuntos",
        icon: Home,
        href: "/superAdmin/conjuntos",
      },
      {
        title: "Administradores",
        icon: PeopleIcon,
        href: "/superAdmin/administradores",
      },
      {
        title: "Splash",
        icon: AddToQueue,
        href: "/superAdmin/splash",
      },
      
    ],
  },
];

const renderNavItems = ({ items, pathname, depth = 0 }) => {
  return (
    <List disablePadding>
      {items.reduce(
        (acc, item) => reduceChildRoutes({ acc, item, pathname, depth }),
        []
      )}
    </List>
  );
};

const reduceChildRoutes = ({ acc, pathname, item, depth }) => {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false,
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({ depth: depth + 1, pathname, items: item.items })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        info={item.info}
        key={key}
        title={item.title}
      />
    );
  }

  return acc;
};

const useStyles = makeStyles((theme) => ({
  root: {
    background: "#051e34",
    //background: '-webkit-linear-gradient(59deg, #3A6073, #000000)',
    //background: 'linear-gradient(59deg, #3A6073, #000000)'
  },
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    height: "100%",
  },
  avatar: {
    cursor: "pointer",
    width: 100,
    height: 100,
  },
  textColor: {
    color: "#ffffff",
    fontSize: 15,
  },
  dividerColor: {
    backgroundColor: "#B0A36C",
  },
}));

const NavBar = ({  image }) => {
  const classes = useStyles();
  const location = useLocation();

  let userSection = sectionsAdmin;

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      className={classes.root}
      style={{ backgroundImage: "url(" + image + ")" }}
    >
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Hidden lgUp>
          <Box p={2} display="flex" justifyContent="center">
            <RouterLink to="/">
              <Logo />
            </RouterLink>
          </Box>
        </Hidden>
        <Box p={2}>
          <LogoDown />

        </Box>
        <Divider className={classes.dividerColor} variant="middle" />
        <Box p={2}>
          {userSection.map((section) => (
            <List
              key={section.subheader}
              subheader={
                <ListSubheader disableGutters disableSticky>
                  {section.subheader}
                </ListSubheader>
              }
            >
              {renderNavItems({
                items: section.items,
                pathname: location.pathname,
              })}
              {/* <Divider className={classes.dividerColor} /> */}
            </List>
          ))}
        </Box>
      </PerfectScrollbar>
    </Box>
  );

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </Fragment>
  );
};

NavBar.propTypes = {

  image: PropTypes.string,
};

export default NavBar;
