import React, { Fragment, useState } from "react";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { useSnackbar } from "notistack";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    TextField,
} from "@material-ui/core";
import useSettings from "../../../../../contextapi/hooks/useSettings";
import * as FirestoreService from "../services/firebase";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import "moment/locale/es";
import {
    DatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

const FormCaja = ({ formulario, send }) => {
    const { settings } = useSettings();
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Formik
            initialValues={{
                NombreCaja: formulario?.data().NombreCaja || '',
                SaldoInicial: formulario?.data().SaldoInicial || '',
                FechaCorte: formulario ? new Date(formulario.data().FechaCorte.seconds * 1000) : null,
            }}
            validationSchema={Yup.object().shape({
                NombreCaja: Yup.string()
                .required("¡Se requiere rellenar este campo!")
                .test('','Campo Nombre se encuentra vacio',
      function vespacio (espacio)
      { if (typeof espacio === 'undefined' ){return false;}else{espacio = espacio.trim();if(espacio == ''){return false;}else{return true;}}}),
    
                
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
                    if (formulario) {
                        FirestoreService.updateCaja(settings.idConjunto, formulario.id, values).then(() => {
                            setStatus({ success: true });
                            setSubmitting(false);
                            setLoading(false);

                            enqueueSnackbar("Caja actualizada correctamente", {
                                variant: "success",
                            });
                            send();
                        });
                    } else {
                        FirestoreService.newCaja(settings.idConjunto, values).then((caja) => {
                            if(values.SaldoInicial>0){
                                FirestoreService.newSaldo(settings.idConjunto, {
                                    Valor: values.SaldoInicial,
                                    Descripcion: 'Saldo inicial de Caja',
                                    Fecha: new Date(),
                                    CuentaUid: caja.id,
                                    Rubro: 'Saldos iniciales',
                                    SubRubro: 'Saldo Inicial',
                                    Usuario: null,
                                    Comprobante: "saldo inicial",
                                  })
                            }
                            setStatus({ success: true });
                            setSubmitting(false);
                            setLoading(false);

                            enqueueSnackbar("Caja creada correctamente", {
                                variant: "success",
                            });
                            send();
                        })
                    }
                } catch (err) {
                    console.log(err)
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
                setFieldValue,
                isSubmitting,
                touched,
                values,
            }) => (
                <Fragment>
                    {loading ? (
                        <Box display="flex" justifyContent="center" my={5}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Card>
                                <br />
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={12}>
                                            <TextField
                                                fullWidth
                                                variant='outlined'
                                                error={Boolean(touched.NombreCaja && errors.NombreCaja)}
                                                helperText={touched.NombreCaja && errors.NombreCaja}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.NombreCaja}
                                                label="Nombre de la caja"
                                                name="NombreCaja"
                                                id="NombreCaja"
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <TextField
                                                fullWidth
                                                variant='outlined'
                                                disabled={formulario}
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
                                        <Grid item md={6} md={6}>
                                            <MuiPickersUtilsProvider
                                            locale="es"
                                            utils={MomentUtils}
                                            >
                                            <DatePicker
                                                error={Boolean(
                                                touched.FechaCorte && errors.FechaCorte
                                                )}
                                                helperText={touched.FechaCorte && errors.FechaCorte}
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
                                                disabled={formulario}
                                            />
                                            </MuiPickersUtilsProvider>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <Box mt={2}>
                                <Button
                                    color="primary"
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    <AddShoppingCartIcon /> {formulario ? 'Actualizar' : 'Crear'}
                                </Button>
                            </Box>
                        </form>
                    )}
                </Fragment>
            )}
        </Formik>
    );
};

export default FormCaja;