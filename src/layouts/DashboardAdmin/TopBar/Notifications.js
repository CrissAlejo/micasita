import React, { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, IconButton, List, ListItem, ListItemIcon,
  ListItemText, Collapse, Popover, SvgIcon, Tooltip, Typography,
  makeStyles, Icon } from "@material-ui/core";
import CreditCardIcon from '@material-ui/icons/CreditCard';
import MoneyIcon from '@material-ui/icons/MonetizationOn';
import BuildIcon from '@material-ui/icons/Build';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Badge from "@material-ui/core/Badge";
import useSettings from "../../../contextapi/hooks/useSettings";
import * as FirestoreService from "./services/firestore";
import PerfectScrollbar from "react-perfect-scrollbar";

import {
  Bell as BellIcon,

} from "react-feather";


const useStyles = makeStyles((theme) => ({
  popover: {
    width: 320,
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

const Notifications = () => {
  const classes = useStyles();
  const [notifications, setNotifications] = useState([]);
  const [transf, setTransf] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [reparaciones, setReparaciones] = useState([]);
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const { settings } = useSettings();
  const [isOpen, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getConjuntoById = React.useCallback(() => {
    try {
      FirestoreService.getUserByConjunto(
        {
          next: (querySnapshot) => {
            const Itemss = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            let notiaux = [];
            setNotifications([]);
            Itemss.forEach((element) => {
              try {
                FirestoreService.getPedidos(
                  {
                    next: (querySnapshots) => {
                      const Items = querySnapshots.docs.map(
                        (docSnapshot) => docSnapshot
                      );
                      if (Items.length > 0) {
                        Items.forEach((si) => {
                          let constante = {
                            proveedorId: element.id,
                            nombreproveedor: element.data().Nombre,
                            costo: si.data().Costo,
                          };

                          notiaux.push(constante);
                        });
                      }
                    },
                  },
                  settings.idConjunto,
                  element.id
                );
              } catch (e) { }
            });
            setNotifications(notiaux);
          },
        },
        settings.idConjunto
      );
      const pendientes = FirestoreService.getTransfPendientes(settings.idConjunto);
      setTransf(pendientes);

      const cuentasPagar = FirestoreService.getCuentasPagar(settings.idConjunto);
      setPagos(cuentasPagar);

      const reparos = FirestoreService.getReportes(settings.idConjunto);
      setReparaciones(reparos);
      if(pendientes.length==0 && cuentasPagar.length==0 && reparos.length==0) setCount('!')
    } catch (e) { }
  }, [settings.idConjunto]);

  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);

  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton ref={ref} onClick={handleOpen}>
          <Badge badgeContent={count} color="primary">
            <SvgIcon>
              <BellIcon />
            </SvgIcon>
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        classes={{ paper: classes.popover }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <Box p={2}>
          <Typography variant="h6" color="textPrimary">
            Notificaciones
          </Typography>
        </Box>
        {count === 0 ? (
          <Box p={2}>
            <Typography variant="h6" color="textPrimary">
              No tienes notificaciones
            </Typography>
          </Box>
        ) : (
          <PerfectScrollbar options={{ suppressScrollX: true }}>
            <List disablePadding style={{maxHeight: '400px', width: '100%', maxWidth: '400px'}} >
              <SectionList title='Transferencias pendientes' icon={CreditCardIcon}>
                {transf.length > 0 ? (
                  <List component="div" disablePadding>
                    {transf.map((item, ind) => {
                      return (
                        <ListItem
                          component={RouterLink}
                          divider
                          key={ind}
                          to={"/administrador/transferenciasporaprobar"}
                        >
                          <ListItemText
                            primary={`Ha recibido una transferencia con el valor de: ${item.Valor}$ cubriendo ${item.Deudas} deuda(s)`}
                            primaryTypographyProps={{
                              variant: "subtitle2",
                              color: "textPrimary",
                            }}
                            secondary={`razón de pago: ${item.Detalle}`}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                  ):(
                    <Box p={2} display="flex" justifyContent="center">
                      <Typography color="textPrimary">
                        No tienes transferencias pendientes
                      </Typography>
                    </Box>
                  )}
                  <Box display="flex" justifyContent="center">
                    <Button component={RouterLink} size="small" to="/administrador/transferenciasporaprobar">
                      ir a transferencias
                    </Button>
                  </Box>
              </SectionList>
              <SectionList title='Cuentas por Pagar' icon={MoneyIcon}>
                {pagos.length > 0 ? (
                  <List component="div" disablePadding>
                    {pagos.map((item, ind) => {
                      return (
                        <ListItem
                          component={RouterLink}
                          divider
                          key={ind}
                          to={"/administrador/proveedores/cuentasporpagar"}
                        >
                          <ListItemText
                            primary={`El plazo del pedido de ${item.Articulo} está vencido o cercano a vencerse`}
                            primaryTypographyProps={{
                              variant: "subtitle2",
                              color: "textPrimary",
                            }}
                            secondary={`Proveedor: ${item.Proveedor} - Valor: ${item.Costo}$`}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                  ):(
                    <Box p={2} display="flex" justifyContent="center">
                      <Typography color="textPrimary">
                        No tienes cuentas por pagar
                      </Typography>
                    </Box>
                  )}
                  <Box display="flex" justifyContent="center">
                    <Button component={RouterLink} size="small" to="/administrador/proveedores/cuentasporpagar">
                      ir a cuentas por pagar
                    </Button>
                  </Box>
              </SectionList>
              <SectionList title='Reportes de daños' icon={BuildIcon}>
                {reparaciones.length > 0 ? (
                  <List component="div" disablePadding>
                    {reparaciones.map((item, ind) => {
                      return (
                        <ListItem
                          component={RouterLink}
                          divider
                          key={ind}
                          to={"/administrador/informeProblemas"}
                        >
                          <ListItemText
                            primary={`${item.Usuario} ha reportado un daño`}
                            primaryTypographyProps={{
                              variant: "subtitle2",
                              color: "textPrimary",
                            }}
                            secondary={`Daño: ${item.Observaciones}`}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                  ):(
                    <Box p={2} display="flex" justifyContent="center">
                      <Typography color="textPrimary">
                        No tienes daños reportados
                      </Typography>
                    </Box>
                  )}
                  <Box display="flex" justifyContent="center">
                    <Button component={RouterLink} size="small" to="/administrador/informeProblemas">
                      ir a reportes de daños
                    </Button>
                  </Box>
              </SectionList>
            </List>
          </PerfectScrollbar>
        )}
      </Popover>
    </>
  );
};

const SectionList = ({title, icon, children}) => {
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
    <ListItem button onClick={handleClick}>
      <ListItemIcon>
        <Icon component={icon}/>  
      </ListItemIcon>
      <ListItemText primary={title} />
      {open ? <ExpandLess /> : <ExpandMore />}
    </ListItem>
    <Collapse in={open} timeout="auto" unmountOnExit>
      {children}
    </Collapse>
    </>
  )
}

export default Notifications;
