import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import useStyles from "./useStyles";
import { Typography, Box } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { ListItemText } from "@material-ui/core";
import DateRange from "@material-ui/icons/DateRange";
import ViewAgenda from "@material-ui/icons/ViewAgenda";
import AccessTime from "@material-ui/icons/AccessTime";
import Person from "@material-ui/icons/Person";
import AttachMoney from "@material-ui/icons/AttachMoney";
import AccessibilityNewRounded from "@material-ui/icons/AccessibilityNewRounded";
import MultilineChart from "@material-ui/icons/MultilineChart";
import Receipt from "@material-ui/icons/Receipt";
import Dashboard from "@material-ui/icons/Dashboard";
import moment from 'moment';
import 'moment/locale/es';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faGavel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";


function DetalleAreaComunal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [areas] = React.useState(props.info);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const ordenardias = (dias) => {
    function s(a, b) {
      return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
    }
    var inputArray = dias;
    var daysOfWeek = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ]; 
    var ordendia = inputArray.sort(s);

    return ordendia;
  };
  function rango(periodos) {
    if (periodos == 7) {
      return <view>Semanal</view>;
    } else if (periodos == 30) {
      return <view>Mensual</view>;
    } else if (periodos == 365) {
      return <view>Anual</view>;
    }
  }

  return (
    <div>
      <Button color="primary" onClick={handleOpen}>
        <Tooltip title="Ver Detalles">
          <IconButton aria-label="ver">
           <VisibilityIcon />
           </IconButton>
        </Tooltip>
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
              Detalle de las Areas Comunales{" "}
            </Typography>
            <button
              onClick={handleClose}
              aria-label="Close"
              class={classes.close}
              type="button"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <Divider light />
            <center>
              <Box display="flex" width="100%">
                <Box display="flex" flexDirection="column" width="50%">
                  <Box p={2} m={2} display="flex">
                    <DateRange fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      Días Hábiles: 
                      {ordenardias(areas.data().DiasHabiles).map(
                        (item, index) => {
                          return <div>{item}</div>;
                        }
                      )}
                    </Typography>
                  </Box>

                  <Box p={2} m={2} display="flex">
                    <AccessTime fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      Horas de Uso:{"  "}
                      {areas.data().HorasUso}
                    </Typography>
                  </Box>

                  <Box p={2} m={2} display="flex">
                    <AccessibilityNewRounded fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      Aforo:{"  "}
                      {areas.data().Aforo>1?(areas.data().Aforo +" personas"):(areas.data().Aforo + " persona")}
                    </Typography>
                  </Box>

                  <Box p={2} m={2} display="flex">
                    <AttachMoney fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      Garantía: ${"  "}
                      {areas.data().Garantia}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column" width="50%">
                  <Box p={2} m={2} display="flex">
                    <Receipt fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      Días Anticipación:{"  "}
                      {areas.data().DiasAnticipacion}
                    </Typography>
                  </Box>

                  <Box p={2} m={2} display="flex">
                    <Person fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      Reserva por Usuario:{"  "}
                      {areas.data().ReservaxUsuario}
                    </Typography>
                  </Box>

                  <Box p={2} m={2} display="flex">
                    <DateRange   fontSize="large" />
                    <Typography className={classes.pageNameDetalle}>
                      Periodo:{"  "}
                      {rango(areas.data().Periodo)}
                    </Typography>
                  </Box>
                  <Box p={2} m={2} display="flex">
                    <FontAwesomeIcon icon={faGavel} style={ {width:"32", height:"32"}}/>
                    <Typography className={classes.pageNameDetalle}>
                      Términos y condiciones:{"  "}
                      {areas.data().TerminosCond}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Grid container spacing={1}>
                <Grid item xs={12} lg={6}></Grid>
                <Grid item xs={12} lg={6}></Grid>
              </Grid>
            </center>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default DetalleAreaComunal;
