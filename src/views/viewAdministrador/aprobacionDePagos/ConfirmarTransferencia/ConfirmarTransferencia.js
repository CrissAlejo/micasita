import React, { useState, useEffect} from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import useStyles from "./useStyles";
import { Container, TextField, List, ListItem, Divider } from "@material-ui/core";
import Page from "../../../../components/Page";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import useSettings from "../../../../contextapi/hooks/useSettings";
import CambiarCantidad from "./CambiarCantidad";
import Header from "./Header";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as FirestoreService from "../Services/firestore";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";

function New(props) {
  const classes = useStyles();
  const { data, cuentaId } = props;
  const deudas = data.data().Deuda.sort((a,b) => a.Valor - b.Valor);
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleConfirm = (newValues) => {
    setLoading(true);
    const values = {};
    if (newValues.valor !== undefined) {
      values.Valor = (data.data().Valor*1) - newValues.valor;
    } else {
      values.Valor = (data.data().Valor * 1);
    }
    let pago = values.Valor;
    values.Usuario = data.data().Usuario;
    values.Comprobante = newValues.Comprobante;
    values.CuentaUid = cuentaId;
    Promise.all(
      data.data().Deuda.sort((a,b) => a.Valor - b.Valor).map(deuda => {
        values.Descripcion = deuda.Nombre;
        values.Rubro = deuda.Rubro;
        values.SubRubro = deuda.SubRubro;
        values.FechaLimite = deuda.FechaLimite;
        if((pago - deuda.Valor) >= 0){
          values.Valor = deuda.Valor;
          pago -= deuda.Valor;
        } else {
          values.Valor = pago;
        }
        FirestoreService.newIngreso(settings.idConjunto, values);
        return true;
      })
    ).then(()=>{
      data.data().Deuda.map((pago) => {
        FirestoreService.deletePagoPendiente(settings.idConjunto, pago.id);
        return true;
      })
    })
    FirestoreService.updateTranferencia(settings.idConjunto, values.CuentaUid, data.id).then(() => {
      setOpen(false);
      setLoading(false);
      enqueueSnackbar("Transferencia aprobada correctamente", {
        variant: "success",
      });
    });
  };

  return (
    <div>
      <Button
        aria-label="Confirmar transacción"
        onClick={handleOpen}
        startIcon={<CheckCircleOutlineIcon />}
        variant="outlined"
      >
        Aprobar
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
              <Page className={classes.root} title="CrearCuenta">
                <Container maxWidth="lg">
                  <Header title='Confirmar Transferencia' onClick={() => handleClose()} />
                  {!loading ? (
                    <center>
                    <Box mt={2} mb={2}>
                        <h5>Ingrese el número de comprobante</h5>
                      </Box>
                      <Box mt={2}>
                        <img
                          src={data.data().Imagen}
                          alt="logo"
                          width="400"
                          height="400"
                        />
                      </Box>
                      <Box mt={2}>
                        <h4>¿Recibiste: ${data.data().Valor}?</h4>
                      </Box>
                      <Box mt={2} mb={2}>
                        <p style={{marginBottom: 0}}><b>Deudas pagadas:</b></p>
                        <List>
                          {deudas.map((as) => (
                              <ListItem key={as.id}>
                                {as.Nombre} - ${parseFloat(as.Valor).toFixed(2)}
                              </ListItem>
                            ))}
                        </List>
                      </Box>
                      <Formik
                        initialValues={{ Comprobante: '' }}
                        validationSchema={Yup.object().shape({
                          Comprobante: Yup.string().required("¡Se requiere rellenar este campo!"),
                        })}
                        onSubmit={(values) => {
                          handleConfirm(values)
                        }}
                      >
                        {props => {
                          const {
                            values,
                            touched,
                            errors,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                          } = props;
  
                          return (
                            <form onSubmit={handleSubmit}>
                              <Grid item xs={12} lg={12}>
                                <TextField
                                  error={errors.Comprobante && touched.Comprobante}
                                  label="# de Comprobante"
                                  name="Comprobante"
                                  variant="outlined"
                                  fullWidth
                                  className={classes.margin}
                                  value={values.Comprobante}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  helperText={errors.Comprobante && touched.Comprobante && errors.Comprobante}
                                />
                              </Grid>
                              <Box mt={2}>
                                <Grid
                                  container
                                  spacing={2}
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Grid item xs={6} lg={3}>
                                    <Button disabled={loading} variant="contained" color="primary" fullWidth={true} type="submit">
                                      SI
                                    </Button>
                                  </Grid>
                                  <Grid item xs={6} lg={3}>
                                    <CambiarCantidad
                                      data={data}
                                      deuda={data.data().Deuda.sort((a,b) => a.Valor - b.Valor).pop()}
                                      error={values.Comprobante == ''}
                                      send={(valor) => handleConfirm({valor,...values})}
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            </form>
                          )
                        }}
                      </Formik>
                    </center>
                  ):(
                    <Box display = "flex" justifyContent = "center" my = { 5 }>
                      <CircularProgress />
                    </Box>
                  )}
                </Container>
              </Page>
            </div>
          </Fade>
        </Modal>
    </div>
  );
}

export default New;
