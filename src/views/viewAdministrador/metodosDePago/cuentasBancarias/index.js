import React from "react";
import useStyles from "./useStyles";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import { Tooltip, IconButton } from "@material-ui/core";
import * as FirestoreService from "./services/firestore";
import New from "./New/New";
import Edit from "./Edit/Edit";
import Button from "../../../../components/CustomButtons/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CircularProgress, Box, CardHeader, Grid, Typography, Card, CardContent, CardActions } from "@material-ui/core";
import useSettings from "../../../../contextapi/hooks/useSettings";
import NewTransferencia from "./NewTransferencia/NewTransferencia";
import DetallesPagosEnCuenta from "./DetallesPagosEnCuenta";


const MetodoPago = () => {
  const classes = useStyles();
  const [cuentas, setCuentas] = React.useState([]);
  const { settings } = useSettings();
  const [open, setOpen] = React.useState(false);
  const [elm, setElm] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    try {
      FirestoreService.getCuentabyConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setCuentas(Items);
            setLoading(false);
          },
        },
        settings.idConjunto
      );
    } catch (e) { }
  }, [settings.idConjunto]);


  const handleClose = () => {
    setOpen(false);
  };


  const confir = () => {
    setOpen(false);
    setLoading(true);

    if (elm) {
      FirestoreService.deleteCuentabyID(settings.idConjunto, elm).then(() => {
        setLoading(false);
      }
      );
    }
  };

  function deleteCuenta(event) {
    setOpen(true);
    setElm(event);
  }

  return (
    <Paper className={classes.root}>
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
            ¿Estás seguro que quieres eliminar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="danger">
            Cancelar
          </Button>
          <Button onClick={confir} color="warning">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <CardHeader title="Cuentas Bancarias" />
      <New />
      <NewTransferencia />
      {!loading ? (
        <Grid container spacing={3}>
          {
            cuentas.map((cuenta, index) => {
              return (
                <Grid item xs={12} sm={4}>
                  <Card className={classes.root} variant="inline" key={index}>
                    <CardContent>
                      <center>
                        <img
                          src={cuenta.data().Logo}
                          alt="logo"
                          width="250"
                          height="80"
                        />
                      </center>
                      <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Banco: {cuenta.data().Banco}
                        <br />
                        Cuenta: {cuenta.data().TipoCuenta}
                        <br />
                      </Typography>
                      <br />
                      <Typography className={classes.title} color="textSecondary" >
                        Nombre de la cuenta
                      </Typography>
                      <Typography variant="body2" component="p">
                        {cuenta.data().NombreCuenta} <br />
                      </Typography>
                      <br />
                      <Typography className={classes.title} color="textSecondary" >
                        Número de la cuenta
                      </Typography>
                      <Typography variant="body2" component="p">
                        {cuenta.data().NumeroCuenta}
                      </Typography>
                      <br />
                      <Typography className={classes.title} color="textSecondary" >
                        Correo electrónico
                      </Typography>
                      <Typography variant="body2" component="p">
                        {cuenta.data().Correo}<br />
                      </Typography>
                      <br />
                      <Typography className={classes.title} color="textSecondary" >
                        {cuenta.data().TipoIdentificacion}
                      </Typography>
                      <Typography variant="body2" component="p">
                        {cuenta.data().Identificacion}
                      </Typography>
                    </CardContent>
                    <CardActions>

                      <Grid
                        container
                        spacing={0}
                        alignItems="center"
                        justify="center"
                      >
                        <Grid item xs={4} lg={3}>
                          
                          <Tooltip title="Eliminar">
                            <IconButton
                              aria-label="eliminar"
                              onClick={() => deleteCuenta(cuenta.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={4} lg={3}>
                          <Tooltip title="Editar">
                            <Edit data={cuenta} />
                          </Tooltip>
                        </Grid>
                        <Grid item xs={4} lg={3}>
                          <Tooltip title="Ver Pagos">
                            <DetallesPagosEnCuenta cuentaId={cuenta.id} />
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </CardActions>
                  </Card>
                </Grid>
              )
            }
            )
          }
        </Grid>
      ) : (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};
export default MetodoPago;
