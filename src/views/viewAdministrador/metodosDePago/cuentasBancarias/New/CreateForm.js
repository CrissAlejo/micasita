import React, { Fragment } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Grid,
  TextField,
  makeStyles,
} from "@material-ui/core";
import renderTextField from "../../../../../components/FormElements/InputText";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import useSettings from "../../../../../contextapi/hooks/useSettings";
import MomentUtils from "@date-io/moment";
import "moment/locale/es";
import axios from 'axios'

import {
    DatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    "& .ql-editor": {
      height: 160,
    },
  },
}));

const CreateForm = ({ className, send, ...rest }) => {
  const classes = useStyles();
  const { settings } = useSettings();
  const [bancos, setBancos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  
  const { enqueueSnackbar } = useSnackbar();
  const tipoCuenta = [
    { id: 0, Nombre: 'Ahorros' },
    { id: 1, Nombre: 'Corriente' },
  ];
  const tipoIdentificacion = [
    { id: 0, Nombre: 'Ruc' },
    { id: 1, Nombre: 'Cédula' },
    { id: 2, Nombre: 'Pasaporte' },
  ];

  React.useEffect(() => {
    try {
      FirestoreService.getAllBanks({
        next: (querySnapshot) => {
          const items = querySnapshot.docs.map((docSnapshot) =>
            docSnapshot.data()
          );
          setBancos(items);
          setLoading(false);
        },
      });

    } catch (e) { }
  }, []);


  return (
    <Formik
      initialValues={{
        Banco: "",
        TipoCuenta: "",
        NombreCuenta: "",
        NumeroCuenta: "",
        TipoIdentificacion: "",
        Identificacion: "",
        Correo: "",
        SaldoInicial: "",
        FechaCorte: null,
      }}
      validationSchema={Yup.object().shape({
        Banco: Yup.string()
        .required("¡Debe seleccionar un banco!"),
        TipoCuenta: Yup.string()
          .required("¡Seleccione el tipo de cuenta!"),
        TipoIdentificacion: Yup.string()
          .required("¡Seleccione el tipo de identificación!"),
        NombreCuenta: Yup.string()
          .max(100)
          .required("¡Se requiere rellenar este campo!")
          .test('','Campo Nombre se encuentra vacio',
          function vespacio (espacio)
          { if (typeof espacio === 'undefined' ){return false;}else{espacio = espacio.trim();if(espacio == ''){return false;}else{return true;}}}),
        NumeroCuenta: Yup.string()
          .max(20)
          .required("¡Se requiere rellenar este campo!")
          .matches(/^[0-9]+$/gm, "¡Solo se admiten números!"),
        Correo: Yup.string()
          .email("Ingrese un correo Valido!")
          .required("¡Se requiere rellenar este campo!")
          .nullable(),
        Identificacion: Yup.string()
          .required("¡Se requiere rellenar este campo!")
          
          .test(
            '','¡Ingrese una cedula válida!',
            function vcedula (cedula)
           {  
            if (typeof cedula === 'undefined' )
            {return false;}else{
            var tdig = 0;
            tdig = cedula.length;
            if (tdig == 10){
            var strsuma='', dig=0, dig1=0, digito = 0, valor1=0,valor2=0,valor3=0,valor4=0,valor5=0,valor6=0,valor7=0,valor8=0,valor9=0,valor10=0,simpar=0,suma =0,spar=0;
            valor1=cedula.substr(0,1);
					  valor2=cedula.substr(1,1);
            valor3=cedula.substr(2,1);
            valor4=cedula.substr(3,1);
            valor5=cedula.substr(4,1);
            valor6=cedula.substr(5,1);
            valor7=cedula.substr(6,1);
            valor8=cedula.substr(7,1);
            valor9=cedula.substr(8,1);
            valor10=cedula.substr(9,1);
            valor1 = parseInt(valor1);
            valor2 = parseInt(valor2);
            valor3 = parseInt(valor3);
            valor4 = parseInt(valor4);
            valor5 = parseInt(valor5);
            valor6 = parseInt(valor6);
            valor7 = parseInt(valor7);
            valor8 = parseInt(valor8);
            valor9 = parseInt(valor9);
            valor10 = parseInt(valor10);
            spar = valor2 + valor4 +valor6 +valor8;
            valor1 =  valor1 * 2;
            if(valor1>9){ valor1=(valor1 - 9);}
            valor3 =  valor3 * 2;
            if(valor3>9){ valor3=(valor3 - 9);}
            valor5 =  valor5 * 2;
            if(valor5>9){ valor5=(valor5 - 9);}
            valor7 =  valor7 * 2;
            if(valor7>9){ valor7=(valor7 - 9);}
            valor9 =  valor9 * 2;
            if(valor9>9){ valor9=(valor9 - 9);}
            simpar = valor1 + valor3 + valor5 + valor7 + valor9;
            suma = spar + simpar;
            strsuma = String(suma);
            dig = strsuma.substr(0,1);
            dig1 = parseInt(dig);
            dig1 = ((dig1+1)*10);
            digito = dig1 - suma;
            if(digito==10){ digito=0;}
					  if (digito==valor10){return true;}else{return false;}
           }{return true;}
          }
          }
          ),
        SaldoInicial: Yup.string()
          .required("¡Se requiere rellenar este campo!")
          .matches(/^(?!0\.00)[1-9]\d{0,9}(\.\d{1,2})?$/gm, "¡Solo se admiten números Ej: (99999999,99)!"),


        FechaCorte: Yup.date()
          .required("La fecha es requerida"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setLoading(true);
        try {
          values.FechaCorte = values.FechaCorte._d;
          FirestoreService.getImagen(values.Banco).get().then((doc) => {
            if (doc.exists) {
              FirestoreService.newAccountBank(settings.idConjunto, values, doc.data().Imagen).then((cuenta) => {
                if(values.SaldoInicial>0){
                  FirestoreService.newSaldo(settings.idConjunto, {
                    Valor: values.SaldoInicial,
                    Descripcion: 'Saldo inicial de Cuenta Bancaria',
                    Fecha: new Date(),
                    CuentaUid: cuenta.id,
                    Rubro: 'Saldos iniciales',
                    SubRubro: 'Saldo Inicial',
                    Usuario: null,
                    Comprobante: "saldo inicial",
                  })
                }
               var cashbookbancos = [values.TipoCuenta,values.NumeroCuenta,values.NombreCuenta,values.Banco];
                axios.post('http://localhost/cashbook-php/index.php/?values='+cashbookbancos);
                setStatus({ success: true });
                setSubmitting(false);
                setLoading(false);
                enqueueSnackbar("Cuenta añadida correctamente", {
                  variant: "success",
                });
                send();
              });
            } else {
            }
          }).catch((error) => {
          });
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
          setLoading(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values,
      }) => (
        <Fragment>
          {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : (
            <form
              onSubmit={handleSubmit}
              className={clsx(classes.root, className)}
              {...rest}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                  <Card>
                    <CardHeader title="Datos bancarios" />
                    <CardContent>
                    <Grid container spacing={1}>
                      <Grid item md={12} xs={12}>
                        <TextField
                          error={errors.Banco && touched.Banco}
                          helperText={errors.Banco && touched.Banco && errors.Banco}
                          fullWidth
                          name="Banco"
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={values.Banco}
                          variant="outlined"
                        >
                          <option key={null} value={""}>
                            Banco
                          </option>
                          {bancos.map((banco) => (
                            <option key={banco.Nombre} value={banco.Nombre}>
                              {banco.Nombre}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField
                          error={errors.TipoCuenta && touched.TipoCuenta}
                          helperText={errors.TipoCuenta && touched.TipoCuenta && errors.TipoCuenta}
                          fullWidth
                          name="TipoCuenta"
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={values.TipoCuenta}
                          variant="outlined"
                        >
                          <option key={null} value={""}>
                            Tipo de cuenta
                          </option>
                          {tipoCuenta.map((tipoCuenta) => (
                            <option key={tipoCuenta.Nombre} value={tipoCuenta.Nombre}>
                              {tipoCuenta.Nombre}
                            </option>
                          ))}
                        </TextField>

                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={errors.NumeroCuenta && touched.NombreCuenta}
                          helperText={errors.NumeroCuenta && touched.NumeroCuenta && errors.NumeroCuenta}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.NumeroCuenta}
                          label="Número de cuenta"
                          placeholder="Número de cuenta"
                          name="NumeroCuenta"
                          id="NumeroCuenta"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={errors.NombreCuenta && touched.NombreCuenta}
                          helperText={errors.NombreCuenta && touched.NombreCuenta && errors.NombreCuenta}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.NombreCuenta}
                          label="Nombre del titular"
                          placeholder="Nombre del titular de la cuenta"
                          name="NombreCuenta"
                          id="NombreCuenta"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={6}>
                        <TextField
                          error={errors.TipoIdentificacion && touched.TipoIdentificacion}
                          helperText={errors.TipoIdentificacion && touched.TipoIdentificacion && errors.TipoIdentificacion}
                          fullWidth
                          name="TipoIdentificacion"
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={values.TipoIdentificacion}
                          variant="outlined"
                        >
                          <option key={null} value={""}>
                            Tipo de indetificación
                          </option>
                          {tipoIdentificacion.map((tipoIdeniIficacion) => (
                            <option key={tipoIdeniIficacion.Nombre} value={tipoIdeniIficacion.Nombre} defaultValue="">
                              {tipoIdeniIficacion.Nombre}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item md={6} xs={6}>
                        <Field
                          error={errors.Identificacion && touched.Identificacion}
                          helperText={errors.Identificacion && touched.Identificacion && errors.Identificacion}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Identificacion}
                          label="Identificación"
                          placeholder="Identificación"
                          name="Identificacion"
                          id="Identificacion"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Field
                          error={errors.Correo && touched.Correo}
                          helperText={errors.Correo && touched.Correo && errors.Correo}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Correo}
                          label="Correo electrónico"
                          placeholder="Correo electrónico"
                          name="Correo"
                          id="Correo"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item xs={6} md={6}>
                          <TextField
                              fullWidth
                              variant='outlined'
                              error={Boolean(touched.SaldoInicial && errors.SaldoInicial)}
                              helperText={touched.SaldoInicial && errors.SaldoInicial}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.SaldoInicial}
                              label="Saldo Inicial"
                              name="SaldoInicial"
                              id="SaldoInicial"
                              type='number'
                          />
                      </Grid>
                      <Grid item md={6} >
                        <MuiPickersUtilsProvider
                          locale="es"
                          utils={MomentUtils}
                        >
                          <DatePicker
                              error={Boolean(
                              touched.FechaCorte && errors.FechaCorte
                              )}
                              helperText={touched.FechaCorte && errors.FechaCorte}
                              /* className={classes.datePicker} */
                              format="DD/MM/YYYY"
                              name="FechaCorte"
                              inputVariant="outlined"
                              variant="inline"
                              disableToolbar
                              fullWidth
                              label='Fecha de Corte'
                              autoOk
                              autoComplete='false'
                              value={values.FechaCorte}
                              onChange={(date) =>
                                  setFieldValue("FechaCorte", date)
                                }
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Box mt={2}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  <AddShoppingCartIcon /> Agregar
                </Button>
              </Box>
            </form>
          )}
        </Fragment>
      )}
    </Formik>
  );
};

CreateForm.propTypes = {
  className: PropTypes.string,
};

export default CreateForm;
