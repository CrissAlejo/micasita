import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  InputAdornment
} from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import * as FirestoreService from "../Services/firestore";
import useSettings from "../../../../contextapi/hooks/useSettings";

function CambiarCantidad(props) {
  const { data, deuda, error } = props;
  const [open, setOpen] = useState(false);
  const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
  const { settings } = useSettings();

  function handleClose() {
    setOpen(false);
  }

  function handleClickOpen() {
    setSubmitionCompleted(false);
    setOpen(true);
  }

  return (
    <React.Fragment>
      <Button variant="contained" fullWidth color="primary" disabled={error} onClick={handleClickOpen}>
        NO
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {!isSubmitionCompleted && (
          <React.Fragment>
            <DialogTitle id="form-dialog-title">Registar cantidad de la transferencia</DialogTitle>
            <DialogContent>
              <DialogContentText>Ingresa el monto que recibiste:</DialogContentText>
              <Formik
                initialValues={{ Valor: "", Nombre: "" }}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  values.Descripcion = "Pago generado por una inconsistencia en el monto de tu última transferencia, Realizar su pago urgente";
                  values.Valor = (data.data().Valor*1) - (values.Valor*1);
                  values.Rubro = deuda.Rubro;
                  values.SubRubro = deuda.SubRubro;
                  try {
                    FirestoreService.getUsuario(data.data().Usuario).then((doc) => {
                      values.NombreUsuario = doc.data().Nombre + " " + doc.data().Apellido;
                      values.CasaUsuario = doc.data().Casa;
                      values.UsuarioId = doc.id;
                      FirestoreService.newPagoPendiente(settings.idConjunto, values).then(() => {
                        setSubmitting(false);
                        handleClose();
                        props.send(values.Valor);
                      })
                    });

                  } catch (err) {
                    setSubmitting(false);
                  }
                }}
                validationSchema={Yup.object().shape({
                  Valor: Yup.string()
                    .required("¡Se requiere rellenar este campo!")
                    .matches(/^\d*\.?\d*$/gm, "¡Solo se admiten números!"),
                  Nombre: Yup.string().required('¡Se requiere rellenar este campo!')
                })}
              >
                {props => {
                  const {
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset
                  } = props;
                  return (
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} lg={12}>
                          <TextField
                            error={errors.Valor && touched.Valor}
                            label="Valor"
                            name="Valor"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={values.Valor}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={errors.Valor && touched.Valor && errors.Valor}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} lg={12}>
                          <TextField
                            error={errors.Nombre && touched.Nombre}
                            label="Detalle"
                            name="Nombre"
                            fullWidth
                            placeholder="Ingresa un comentario adicional"
                            variant="outlined"
                            value={values.Descripcion}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            helperText={errors.Nombre && touched.Nombre && errors.Nombre}
                          />
                        </Grid>
                      </Grid>
                      <DialogActions>
                        <Button
                          type="button"
                          className="outline"
                          onClick={handleReset}
                          disabled={!dirty || isSubmitting}
                        >
                          Limpiar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          Registrar Cantidad
                        </Button>
                      </DialogActions>
                    </form>
                  );
                }}
              </Formik>
            </DialogContent>
          </React.Fragment>
        )}
      </Dialog>
    </React.Fragment>
  );
}

export default CambiarCantidad;