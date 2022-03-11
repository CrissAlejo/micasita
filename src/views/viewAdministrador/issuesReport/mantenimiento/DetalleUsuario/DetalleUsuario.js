import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import useStyles from "./useStyles";
import { Typography, Box } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Email from "@material-ui/icons/Email";
import AccountBox from "@material-ui/icons/AccountBox";
import SettingsCell from "@material-ui/icons/SettingsCell";
import RecentActors from "@material-ui/icons/RecentActors";
import AttachMoney from "@material-ui/icons/AttachMoney";
import HomeWork from "@material-ui/icons/HomeWork";
import Grid from "@material-ui/core/Grid";
import GenerarPago from "./GenerarPago.js";
import DetailsIcon from '@material-ui/icons/Details';
import Edit from "../Edit/Edit";
import * as FirestoreService from "../services/firestore";
import useSettings from "../../../../contextapi/hooks/useSettings";
import ListaPagos from './listaPagos';
import { setDate } from "date-fns";


function DetalleUsuario(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [usuario] = React.useState(props.info);
  const { settings } = useSettings();
  const [pagosPendientes, setPagosPendientes] = React.useState([]);
  const [fechaCorte] = React.useState(setDate(new Date(), 30));

  React.useEffect(() => {
    try {
      FirestoreService.getUsuariosMorosos(settings.idConjunto, usuario.id).then(
        (querySnapshot) => {
          const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
          setPagosPendientes(Items);
        }
        );
    } catch (e) {}
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Button color="primary" variant ="outlined" size="small" onClick={handleOpen}>
       <DetailsIcon/> Detalle
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Typography className={classes.pageName}>
              {" "}
              Detalle de Usuario{" "}
            </Typography>
            <button
              onClick={handleClose}
              aria-label="Close"
              className={classes.close}
              type="button"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <Divider light />
            <center>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Box className={classes.boxItem} display="flex">
                    <AccountCircle fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      {usuario.data().Nombre}
                    </Typography>
                  </Box>
                  <Box className={classes.boxItem} display="flex">
                    <AccountBox fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      {usuario.data().Apellido}
                    </Typography>
                  </Box>

                  <Box className={classes.boxItem} display="flex">
                    <Email fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      {usuario.data().Correo}
                    </Typography>
                  </Box>
                  <Box className={classes.boxItem} display="flex">
                    <SettingsCell fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      {usuario.data().Telefono}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box className={classes.boxItem} display="flex" >
                    <RecentActors fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      {usuario.data().Cedula}
                    </Typography>
                  </Box>
                  <Box className={classes.boxItem} display="flex" >
                    <AttachMoney fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      {usuario.data().Alicuota}
                    </Typography>
                  </Box>
                  <Box className={classes.boxItem} display="flex">
                    <HomeWork fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      {usuario.data().Casa}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} sm={6}>
                  <GenerarPago usuario = {usuario}/>
                </Grid>
                <Grid item xs={12} sm={6}>          
                  <Edit usuario = {usuario.data()}/>
                </Grid>
              </Grid>
            </center>
            <ListaPagos title={"Pagos Pendientes"} pagosPendientes={pagosPendientes.filter(a => a.data().FechaLimite<=fechaCorte).sort((a,b)=>a.data().FechaLimite-b.data().FechaLimite)}/>
            <ListaPagos title={"Pagos Futuros"} pagosPendientes={pagosPendientes.filter(a => a.data().FechaLimite>fechaCorte).sort((a,b)=>a.data().FechaLimite-b.data().FechaLimite)}/>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default DetalleUsuario;
