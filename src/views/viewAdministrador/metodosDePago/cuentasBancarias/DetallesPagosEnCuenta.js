import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import * as FirestoreService from "./services/firestore";
import useSettings from "../../../../contextapi/hooks/useSettings";
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import CallMadeIcon from '@material-ui/icons/CallMade';
import VisibilityIcon from '@material-ui/icons/Visibility';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import numeral from "numeral";

export default function DetallesPagosEnCuenta(props) {
  const { cuentaId } = props;
  const { settings } = useSettings();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [ingresos, setIngresos] = React.useState([]);
  const [egresos, setEgresos] = React.useState([]);
  const [totalIngresos, setTotalIngresos] = React.useState(0);
  const [totalEgresos, setTotalEgresos] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    try {
      FirestoreService.getIngresos(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            let sumaIngresos = 0;
            Items.forEach((item) => {
              sumaIngresos = sumaIngresos + item.data().Valor;
            });
            setTotalIngresos(sumaIngresos);
            setIngresos(Items);
          },
        },
        settings.idConjunto, cuentaId
      );
    } catch (e) {}
  }, [settings.idConjunto]);

  React.useEffect(() => {
    try {
      FirestoreService.getEgresos(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            let sumaEgresos = 0;
            Items.forEach((item) => {
              sumaEgresos = sumaEgresos + item.data().Valor;
            });
            setTotalEgresos(sumaEgresos);
            setEgresos(Items);
          },
        },
        settings.idConjunto ,cuentaId
      );
    } catch (e) {}
  }, [settings.idConjunto]);


  return (
    <div>
      <IconButton
          aria-label="detalles"
          onClick={() => handleClickOpen()}
          >
          <VisibilityIcon />
      </IconButton>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">{"Detalles del saldo en la cuenta"}</DialogTitle>
        <DialogContent>
          <List component="nav" aria-label="main mailbox folders">
            <ListItem>
              <ListItemIcon>
                <CallReceivedIcon />
              </ListItemIcon>
              <ListItemText primary="ingresos:" />
              <ListItemText primary={(numeral(totalIngresos).format(`${"USD"}0,0.00`))} />
            </ListItem>
            <ListItem >
              <ListItemIcon>
                <CallMadeIcon />
              </ListItemIcon>
              <ListItemText primary="Egresos:" />
              <ListItemText primary={(numeral(totalEgresos).format(`${"USD"}0,0.00`))} />
            </ListItem>
          </List>
          <Divider />
          <List component="nav" aria-label="secondary mailbox folders">
            <ListItem>
              <ListItemText primary="Saldo a la fecha:" />
              <ListItemText primary={(numeral(totalIngresos - totalEgresos).format(`${"USD"}0,0.00`))} />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
