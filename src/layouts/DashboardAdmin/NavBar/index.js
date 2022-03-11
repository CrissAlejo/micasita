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
import Residente from "@material-ui/icons/People";
import Areascomunales from "@material-ui/icons/AccountBalance";
import AreaManager from '@material-ui/icons/HomeWork';
import AreaRes from '@material-ui/icons/EventNote';
//import NotificationsActive from '@material-ui/icons/NotificationsActive';
import Contacts from "@material-ui/icons/Contacts";
import CheckBox from "@material-ui/icons/CheckBox";
import TrendingUp from "@material-ui/icons/TrendingUp";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import CallMadeIcon from "@material-ui/icons/CallMade";
import CallReceivedIcon from "@material-ui/icons/CallReceived";
import ClassIcon from "@material-ui/icons/Class";
import PaymentIcon from "@material-ui/icons/Payment";
import TransformIcon from '@material-ui/icons/Transform';
import BallotIcon from '@material-ui/icons/BallotOutlined';
import BuildIcon from '@material-ui/icons/Build';
import VoteIcon from '@material-ui/icons/HowToVote';
import Mail from '@material-ui/icons/Mail';
import Logo from "../../../components/Common/Logo";
import LogoDown from "../../../components/Common/LogoDown";
import NavItem from "./NavItem";
import MenuIcon from '@material-ui/icons/Menu';
const sectionsAdmin = [
  {
    items: [
      {
        title: "Dashboard",
        icon: Dashboard,
        href: "/administrador/dashboard",
      },
      {
        title: "Áreas comunales",
        icon: Areascomunales,
        items: [
          {
            title: "Administrar Áreas",
            icon: AreaManager,
            href: "/administrador/conjuntos",
          },
          {
            title: "Administrar Reservas",
            icon: AreaRes,
            href: "/administrador/reservasxaprobar",
          },
        ],
      },
      {
        title: "Residentes",
        icon: Residente,
        href: "/administrador/residente",
      },
      {
        title: "Proveedores",
        icon: Contacts,
        href: "/administrador/proveedores",
        items: [
          {
            title: "Proveedores",
            href: "/administrador/proveedores",
          },
          {
            title: "Cuentas por pagar",
            href: "/administrador/proveedores/cuentasporpagar",
          },
        ],
      },
      {
        title: "Conciliaciones",
        icon: CheckBox,
        href: "/administrador/conciliaciones",
      },
      {
        title: "Presupuestar",
        icon: TrendingUp,
        href: "/administrador/presupuestar",
      },
      {
        title: "Notificaciones",
       icon: Mail,
        href: "/administrador/notificaciones",
      },

      {
        title: "Cajas o Bancos",
        icon: AccountBalanceWalletIcon,
        items: [
          {
            title: "Cuentas Bancarias",
            href: "/administrador/cuentasBancarias",
          },
          {
            title: "Cajas",
            href: "/administrador/cajas",
          },
        ],
      },
      {
        title: "Transacciones",
        icon: TransformIcon,
        items: [
          
          {
            title: "Ingresos",
            icon: CallReceivedIcon,
            href: "/administrador/ingresos",
          },
          {
            title: "Egresos",
            icon: CallMadeIcon,
            href: "/administrador/egresos",
          },
          {
            title: "Ingresos no identificados",
            icon: CallReceivedIcon,
            href: "/administrador/ingresosNoIdentificados",
          }
        ],
      },
      {
        title: "Rubros",
        icon: ClassIcon,
        items: [
          {
            title: "Rubros Ingresos",
            href: "/administrador/rubros/rubrosingresos",
          },
          {
            title: "Rubros Egresos",
            href: "/administrador/rubros/rubrosegresos",
          },
        ],
      },
      {
        title: "Transferencias pendientes",
        icon: PaymentIcon,
        href: "/administrador/transferenciasporaprobar",
      },
      {
        title: "Votación",
        icon: VoteIcon,
        href: "/administrador/votacion",
      },
      {
        title: "Reportes de Daños",
        icon: BuildIcon,
        items: [
          {
            title: "Reportes de Daños",
            href: "/administrador/informeProblemas",
          },
          {
            title: "Reportes de Mantenimientos",
            href: "/administrador/mantenimiento",
          },
        ],  
      },
      {
        title: "Reportes",
        icon: BallotIcon,
        items: [
          {
            title: "Ingresos y Egresos",
            href: "/administrador/reportes/ingvsegr",
          },
          {
            title: "Cartera",
            href: "/administrador/reportes/cartera",
          },
          {
            title: "Cartera Mensualizada",
            href: "/administrador/reportes/carteraUsuario",
          },
          {
            title: "Consolidado",
            href: "/administrador/reportes/consolidado",
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
