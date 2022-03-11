import React, { useState } from "react";
import {
  Button,
  TextField,
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
import useSettings from "../../../../../contextapi/hooks/useSettings";



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1,0,0,0),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '25ch',
  },
}));


function NewTransferencia(props) {
  const [open, setOpen] = useState(false);
  const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [cuentas, setCuentas] = React.useState([]);
  const [cajas, setCajas] = React.useState([]);
  const classes = useStyles();
  const {settings} = useSettings();

  function handleClose() {
    setOpen(false);
  }

  function handleClickOpen() {
    setSubmitionCompleted(false);
    setOpen(true);
  }

  React.useEffect(() => {
    try {
      FirestoreService.getCuentabyConjunto(
         {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setCuentas(Items);
          },
         },
        settings.idConjunto
      );
      FirestoreService.getCajasbyConjunto(
        {
         next: (querySnapshot) => {
           const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
           setCajas(Items);
         },
        },
       settings.idConjunto
     );
    } catch (e) {}
  }, [settings.idConjunto]);

  return (
    <React.Fragment>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Transferencia de fondos
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {!isSubmitionCompleted && (
          <React.Fragment>
            <DialogTitle id="form-dialog-title">Transferencia</DialogTitle>
            <DialogContent>
              <DialogContentText>Registra un cambio de fondos</DialogContentText>
              <Formik
                initialValues={{Valor:"", Descripcion:"", CuentaOrigen: "", CuentaDestino: "", Comprobante: ''}}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  values.Valor = Number(values.Valor);
                  values.Usuario = null;
                  values.Proveedor = null;
                  values.Rubro = "Transferencia entre cuentas";
                  values.CuentaUid = values.CuentaOrigen;
                  try {    
                    FirestoreService.newEgreso(settings.idConjunto,values).then(() => {
                        values.CuentaUid = values.CuentaDestino;
                        FirestoreService.newIngreso(settings.idConjunto,values).then(()=>{
                            setSubmitting(false);
                            handleClose();
                            enqueueSnackbar("Pago añadido correctamente", {
                            variant: "success",
                            });
                        });                       
                    });         
                    } catch (err) {
                    setSubmitting(false);
                    }  
                }}
                validationSchema={Yup.object().shape({
                  Valor: Yup.string()
                  .required("¡Se requiere rellenar este campo!")
                  .matches(/^(?!0\.00)[1-9]\d{0,9}(\.\d{1,2})?$/gm, "¡Solo se admiten números Ej: (99999999,99)!"),
                CuentaOrigen: Yup.string()
                  .required("¡Se requiere rellenar este campo!"),
                CuentaDestino: Yup.string()
                  .required("¡Se requiere rellenar este campo!"),                 
                Descripcion: Yup.string().required("¡Se requiere rellenar este campo!")
                .test('','Campo Nombre se encuentra vacio',
        function vespacio (espacio)
        { if (typeof espacio === 'undefined' ){return false;}else{espacio = espacio.trim();if(espacio == ''){return false;}else{return true;}}}),
      
                Comprobante: Yup.string().required("¡Se requiere rellenar este campo!")
                .test('','Campo Nombre se encuentra vacio',
        function vespacio (espacio)
        { if (typeof espacio === 'undefined' ){return false;}else{espacio = espacio.trim();if(espacio == ''){return false;}else{return true;}}}),
      
                

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
                                error={errors.CuentaOrigen && touched.CuentaOrigen}
                                label="Cuenta Origen"
                                name="CuentaOrigen"
                                placeholder = "Selecciona la cuenta de Origen"
                                variant="outlined"
                                fullWidth = "true"
                                select
                                SelectProps={{ native: true }}
                                value={values.CuentaOrigen}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.CuentaOrigen && touched.CuentaOrigen && errors.CuentaOrigen}     
                            >
                              <option key={null} value={""}>
                                
                                </option>
                                {cuentas.map((Cuenta) => (
                                  <option key={Cuenta.id} value={Cuenta.id}>
                                    {Cuenta.data().Banco}-{Cuenta.data().NombreCuenta}
                                  </option>
                                ))}
                            </TextField>
                            </Grid>
                            <Grid item xs={12} lg={12}>
                            <TextField
                                error={errors.CuentaDestino && touched.CuentaDestino}
                                label="Cuenta o Caja Destino"
                                name="CuentaDestino"
                                placeholder = "Selecciona la cuenta de Destino"
                                variant="outlined"
                                fullWidth = "true"
                                select
                                SelectProps={{ native: true }}
                                value={values.CuentaDestino}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.CuentaDestino && touched.CuentaDestino && errors.CuentaDestino}     
                            >
                              <option key={null} value={""}>
                                
                              </option>
                              <optgroup label="Cuentas Bancarias">
                                {cuentas.map((Cuenta) => (
                                    <option key={Cuenta.id} value={Cuenta.id}>
                                     {Cuenta.data().Banco}-{Cuenta.data().NombreCuenta}
                                    </option>
                                ))}
                                </optgroup>
                                <optgroup label="Cajas">
                                {cajas.map((caja) => (
                                    <option key={caja.id} value={caja.id}>
                                        {caja.data().NombreCaja}
                                    </option>
                                ))}
                                </optgroup>
                            </TextField>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                            <TextField
                                error={errors.Valor && touched.Valor}
                                label="Valor"
                                name="Valor"
                                variant="outlined"
                                fullWidth ={true}
                                className={classes.margin}
                                value={values.Valor}
                                type="number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.Valor && touched.Valor && errors.Valor}    
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                  }} 
                            />
                            </Grid>
                            <Grid item xs={12} lg={6}>
                            <TextField
                                error={errors.Comprobante && touched.Comprobante}
                                label="# de Comprobante del pago"
                                name="Comprobante"
                                variant="outlined"
                                fullWidth ={true}
                                className={classes.margin}
                                value={values.Comprobante}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.Comprobante && touched.Comprobante && errors.Comprobante}     
                            />
                            </Grid>
                            <Grid item xs={12} lg={12}>
                            <TextField
                                error={errors.Descripcion && touched.Descripcion}
                                label="Descripción del pago"
                                name="Descripcion"
                                variant="outlined"
                                fullWidth = "true"
                                className={classes.margin}
                                value={values.Descripcion}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.Descripcion && touched.Descripcion && errors.Descripcion}     
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

export default NewTransferencia;