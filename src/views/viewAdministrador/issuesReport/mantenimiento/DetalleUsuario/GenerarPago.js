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
import * as FirestoreService from "../services/firestore";
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from "notistack";
import { classes } from "istanbul-lib-coverage";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import useSettings from "../../../../contextapi/hooks/useSettings";
import { addDays } from "date-fns";




const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '25ch',
  },
}));


function GenerarPago(props) {
  const { usuario } = props;
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [rubros, setRubros] = React.useState([]);
  const [subRubros, setSubRubros] = React.useState([]);

  const getSubRubros = (Rubro) => {
    if(Rubro!==""){
      FirestoreService.getSubRubros(settings.idConjunto,Rubro).then((doc)=>{
        if(doc){
            setSubRubros(doc.data().SubRubros);
        }
      }); 
    }         
  }
  React.useEffect(() => {
    try {
      FirestoreService.getRubros(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setRubros(Items);
          },
        },
        settings.idConjunto, "Ingreso"
      );
    } catch (e) {}
  }, [settings.idConjunto]);

  function handleClose() {
    setOpen(false);
  }

  function handleClickOpen() {
    setSubmitionCompleted(false);
    setOpen(true);
  }

  return (
    <React.Fragment>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <AttachMoneyIcon/>Generar Pago
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {!isSubmitionCompleted && (
          <React.Fragment>
            <DialogTitle id="form-dialog-title">Registro de pago pendiente</DialogTitle>
            <DialogContent>
              <DialogContentText>Registrar un pago pendiente</DialogContentText>
              <Formik
                initialValues={{ Valor: "", Nombre: "", Descripcion: "",FechaLimite: "",Rubro: "", SubRubro: "", }}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  const dia = values.FechaLimite
                  try {    
                    values.NombreUsuario = usuario.data().Nombre +" "+ usuario.data().Apellido;
                    values.CasaUsuario = usuario.data().Casa.toString();
                    values.UsuarioId = usuario.id;
                    values.FechaLimite = addDays(new Date, dia);
                    FirestoreService.newPagoPendiente(settings.idConjunto,values).then(() => {
                        setSubmitting(false);
                            handleClose();
                            enqueueSnackbar("Pago añadido correctamente", {
                            variant: "success",
                            });
                    });         
                    } catch (err) {
                    setSubmitting(false);
                    }  
                }}
                validationSchema={Yup.object().shape({
                  Valor: Yup.string()
                    .required("¡Se requiere rellenar este campo!")
                    .matches(/^(?!0\.00)[1-9]\d{0,2}(,\d{3})*(\.\d\d)?$/gm, "¡Solo se admiten números Ej: (100,522.00)!"),
                  Nombre: Yup.string().required("¡Se requiere rellenar este campo!"),
                  Descripcion: Yup.string().required("¡Se requiere rellenar este campo!"),
                  FechaLimite: Yup.string().required("¡Se requiere rellenar este campo!")
                  .matches(/^[+-]?\d*\.?\d*$/gm, "¡Solo se admiten números!"),
                  Rubro: Yup.string().required("¡Se requiere rellenar este campo!"),
                  SubRubro: Yup.string().required("¡Se requiere rellenar este campo!"),
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
                                error={errors.Nombre && touched.Nombre}
                                label="Concepto de pago"
                                name="Nombre"
                                placeholder = "Ingresa un concepto al pago"
                                variant="outlined"
                                fullWidth = {true}
                                className={useStyles.margin}
                                value={values.Nombre}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.Nombre && touched.Nombre && errors.Nombre}     
                            />
                            </Grid>

                            <Grid item xs={6} lg={12}>
                            <TextField
                                error={errors.Valor && touched.Valor}
                                label="Valor"
                                name="Valor"
                                variant="outlined"
                                type = "number"
                                className={classes.margin}
                                value={values.Valor}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.Valor && touched.Valor && errors.Valor}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                  }} 
                            />
                            </Grid>
                            <Grid item xs={6} lg={6}>
                            <TextField
                                error={errors.FechaLimite && touched.FechaLimite}
                                label="Días de espera"
                                name="FechaLimite"
                                variant="outlined"
                                type = "number"
                                fullWidth = {true}
                                className={classes.margin}
                                value={values.FechaLimite}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.FechaLimite? "Se requiere rellenar este campo":"Ingrese un número negativo en caso de un pago vencido"}     
                            />
                            </Grid>
                            <Grid item xs={12} lg={12}>
                            <TextField
                                error={errors.Descripcion && touched.Descripcion}
                                label="Descripción del pago"
                                name="Descripcion"
                                variant="outlined"
                                fullWidth = {true}
                                className={classes.margin}
                                value={values.Descripcion}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.Descripcion && touched.Descripcion && errors.Descripcion}     
                            />
                            </Grid>
                            <Grid item xs={12} lg={12}>
                          <TextField
                            error={errors.Rubro && touched.Rubro}
                            label="Rubro"
                            name="Rubro"
                            placeholder="Selecciona el Rubro"
                            variant="outlined"
                            fullWidth={true}
                            select
                            SelectProps={{ native: true }}
                            value={values.Rubro}
                            onChange={(e) => { handleChange(e); if (subRubros.length === 0) setSubRubros([""]) }}
                            onBlur={() => { getSubRubros(values.Rubro) }}
                            helperText={errors.Rubro && touched.Rubro && errors.Rubro}
                          >
                            <option key={null} value={""}>
                            </option>
                            {rubros.map((Rubro) => (
                              <option key={Rubro.id} value={Rubro.id}>
                                {Rubro.data().Nombre}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                          {subRubros.length > 0 ? (
                            <TextField
                              error={errors.SubRubro && touched.SubRubro}
                              label="SubRubro"
                              name="SubRubro"
                              placeholder="Selecciona el SubRubro"
                              variant="outlined"
                              fullWidth={true}
                              select
                              SelectProps={{ native: true }}
                              value={values.SubRubro}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={errors.SubRubro && touched.SubRubro && errors.SubRubro}
                            >
                              <option key={null} value={""}>
                              </option>
                              {subRubros.map((subRubro) => (
                                <option key={subRubro} value={subRubro}>
                                  {subRubro}
                                </option>
                              ))}
                            </TextField>
                          ) : null}
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
                        <Button type="submit" color ="primary" disabled={isSubmitting}>
                          Crear Pago
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

export default GenerarPago;