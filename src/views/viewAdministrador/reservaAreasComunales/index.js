import React, { useState, useEffect } from 'react';
import * as FirestoreService from "./services/firestore";
import { useParams } from "react-router-dom";
import useSettings from "../../../contextapi/hooks/useSettings";
import Paper from "@material-ui/core/Paper";
import OffIcon from '@material-ui/icons/HighlightOff';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import useStyles from './useStyle';
import { Link } from "react-router-dom";
import LoadingData from "../../../components/Common/LoadingData";
import NoInfo from "../../../components/Common/NoInfo";
import { Fragment } from 'react';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import { Tooltip, IconButton } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DetalleAreaComunal from "../areasComunales/DetalleAreaComunales/DetalleAreaComunal";
import NewAndEdit from "../areasComunales/NewAndEdit/NewAndEdit";
import { Grid } from "@material-ui/core";
const Reservas = (props) => {
  const { settings } = useSettings();
  const { threadKey } = useParams();
  const [areas, setAreas] = useState([]);
  const classes = useStyles();
  const [openHab, setOpenHab] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [habi, setHabilt] = React.useState(null);
  const [area, setarea] = useState([]);
  const [estado, setestado] = useState([]);
  const [elm, setElm] = React.useState(null);
  function updateHabilitado(event, area, estado) {
    setOpenHab(true);
    setHabilt(event);
    setarea(area)
    setestado(estado)
  }
  const handleClose = () => {
    setOpen(false);
  };
  const confirHabilt = () => {
    if (habi) {

      if (estado === false) {
        var estado1 = true
        FirestoreService.updateHabilitado(settings.idConjunto, area, estado1);
      } else {
        var estado1 = false
        FirestoreService.updateHabilitado(settings.idConjunto, area, estado1);

      }
      setOpenHab(false);
    }
  };
  const handleCloseHabilit = () => {
    setOpenHab(false);
  };
  function deleteAreaById(event) {
    setOpen(true);
    setElm(event);
  }
  const confir = () => {
    if (elm) {
      
      FirestoreService.deleteAreaById(settings.idConjunto, elm).then((docRef) => {
        setOpen(false);
      });
    }
  };
  const getConjuntoById = React.useCallback(() => {
    try {
      FirestoreService.getAreasByConjunto(settings.idConjunto, {
        next: (querySnapshot) => {
          const updatedGroceryItems = querySnapshot.docs.map(
            (docSnapshot) => docSnapshot
          );
          setAreas(updatedGroceryItems);
          setLoading(true);
        },
      });
    } catch (e) { }
  }, [settings.idConjunto]);

  useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);


  return (
    <Fragment>
      {!loading ? (
        <LoadingData />
      ) : (
        <Paper className={classes.root}>
          <NewAndEdit info={threadKey} data={null} />
          <Dialog
            open={openHab}
            onClose={handleClose}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              Área comunal
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Está seguro que desea cambiar el estado del Área?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" autoFocus onClick={handleCloseHabilit} color="primary">
                {" "}
                Cancelar
              </Button>
              <Button variant="outlined" onClick={confirHabilt} color="primary">
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              Eliminar
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estas seguro que deseas eliminar?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose} color="primary">
                {" "}
                Cancelar
              </Button>
              <Button onClick={confir} color="primary">
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
          {areas.length > 0 ? areas.map((row, i) => (
            <Card key={i} className={classes.container}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt="img_Area"
                  height="140"
                  image={row.data().Imagen}
                  title="Imagen del Área"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {row.data().Nombre}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Hora apertura: <b>{row.data().HoraInicio}</b> <br></br>Hora cierre: <b>{row.data().HoraFin} </b>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Garantía:  <b>{row.data().Garantia} $</b>
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  onClick={() => updateHabilitado(row, row.id, row.data().Habilitado)}
                >
                  <Chip
                    label={row.data().Habilitado ? "Habilitado" : "Deshabilitado"}
                    variant="outlined" color={row.data().Habilitado ? "primary" : "secondary"}
                    icon={row.data().Habilitado ? <CheckIcon /> : <OffIcon />}
                  />
                </Button>
                <Tooltip title="Eliminar">
                  <IconButton
                    aria-label="eliminar"
                    onClick={() => deleteAreaById(row.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Grid >
                  {" "}
                  <DetalleAreaComunal info={row} />
                </Grid>
                <Grid >
                  <NewAndEdit
                    info={threadKey}
                    aria-label="editar"
                    data={row} />

                </Grid>
              </CardActions>
            </Card>
          )) : (
            <NoInfo />
          )}
        </Paper>
      )}
    </Fragment>
  );
}
export default Reservas;