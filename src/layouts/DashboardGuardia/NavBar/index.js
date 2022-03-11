import React, { Fragment, useState } from "react";
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
  Button,
  Tooltip
} from "@material-ui/core";
import Dashboard from "@material-ui/icons/Dashboard";
import Home from "@material-ui/icons/AddAlert";
import ListAlt from '@material-ui/icons/ListAlt';
import Logo from "../../../components/Common/Logo";
import LogoDown from "../../../components/Common/LogoDown";
import NavItem from "./NavItem";
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import MenuIcon from '@material-ui/icons/Menu';
const sectionsAdmin = [
  {
    items: [
      {
        title: "Dasboard",
        icon: Dashboard,
        href: "/guardia/dashboard",
      },
      {
        title: "Alerta",
        icon: Home,
        href: "/guardia/alerta",
      },
      {
        title: "Bitácora Digital",
        icon: ListAlt,
        href: "/guardia/bitacoraDigital",
      },
      {
        title: "Visitas anticipadas",
        icon: EmojiPeopleIcon,
        href: "/guardia/visitasAnticipadas",
      },
      {
        title: "Historial",
        icon: LibraryBooksIcon,
        items: [
          {
            title: "Ingresos",
            href: "/guardia/ingresos",
          },
          {
            title: "Eventos",
            href: "/guardia/eventos",
          },
          {
            title: "Rondas",
            href: "/guardia/rondas",
          },
        ],
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
    height: '100%'
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

const NavBar = ({ image }) => {
  const classes = useStyles();
  const location = useLocation();
  const [open, setOpen] = useState(false);
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
      <Hidden only={"lg"}>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          variant="temporary"
          open={open}
          onClose={()=>setOpen(false)}
        >
          {content}
        </Drawer>
        <Tooltip title='Abrir menú lateral'>
          <Button
            style={{position: 'absolute', left: 10, top: 10, zIndex:1100, backgroundColor: '#051e34', color: '#fff'}}
            onClick={()=>setOpen(true)}
            variant="contained"
          >
              <MenuIcon/>
          </Button>
        </Tooltip>
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
