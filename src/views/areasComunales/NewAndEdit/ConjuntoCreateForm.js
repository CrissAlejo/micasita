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
  FormHelperText,
  Grid,
  Paper,
  TextField,
  makeStyles,
} from "@material-ui/core";
import QuillEditor from "../../../components/QuillEditor";
import renderTextField from "../../../components/FormElements/InputText";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import UpdateOutlined from "@material-ui/icons/UpdateOutlined";

import useSettings from "../../../contextapi/hooks/useSettings";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    "& .ql-editor": {
      height: 160,
    },
  },
}));

const ConjuntoCreateForm = (prop) => {
  const classes = useStyles();
  const { settings } = useSettings();
  const [loading, setloading] = React.useState(false);
  const [categories] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [formulario] = React.useState(prop.data);
  const getConjuntoById = React.useCallback(() => {
    try {
 
    } catch (e) {}
  }, [settings.idConjunto]);
  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);




  const updateConciliacion = (valoringreso, valoregreso, values) => {
    let idCt = JSON.parse(values.Categoria).id;
    let namCt = JSON.parse(values.Categoria).nombre;
    const fr = values;
    fr.Ingreso = valoringreso;
    fr.Egreso = valoregreso;
    fr.Categoria = namCt;
    fr.IdCategoria = idCt;
    fr.FechaDesde = prop.data.data().FechaDesde;

    FirestoreService.updateArea(
      settings.idConjunto,
      formulario.id,
      fr
    ).then(() => {
      setloading(false);
      enqueueSnackbar("Conciliaccion exitosa", {
        variant: "success",
      });
      prop.send();
    });
  };
  const saveConciliacion = (valoringreso, valoregreso, values) => {
    let idCt = JSON.parse(values.Categoria).id;
    let namCt = JSON.parse(values.Categoria).nombre;
    const fr = values;
    fr.Ingreso = valoringreso;
    fr.Egreso = valoregreso;
    fr.Categoria = namCt;
    fr.IdCategoria = idCt;
    fr.FechaDesde = prop.fechavalidate;

    FirestoreService.newArea(settings.idConjunto, fr).then(() => {
      setloading(false);
      enqueueSnackbar("Conciliaccion exitosa", {
        variant: "success",
      });
    });
  };
  return (
    <Formik
      initialValues={{
        Categoria:
          JSON.stringify({
            id: prop.data?.data().IdCategoria,
            nombre: prop.data?.data().Categoria,
          }) || "",
        Detalle: prop.data?.data().Detalle || "",
        FechaCorte: prop.data?.data().FechaCorte || new Date(),
        Saldo: prop.data?.data().Saldo || "",
      }}
      validationSchema={Yup.object().shape({
        FechaCorte: Yup.date()
          .test(
            "DOB",
            "La fecha debe ser mayor a la ultima conciliación",
            (value) => {
              return (
                moment(value).format("YYYY-MM-DD") >
                moment(
                  prop?.data ? prop.data.data().FechaDesde : prop.fechavalidate
                ).format("YYYY-MM-DD")
              );
            }
          )
          .required("La fecha es requerida"),
        Categoria: Yup.string().required("La Categoria es requerida"),
        Saldo: Yup.number().min(0).required("El Saldo es requerida"),
        Detalle: Yup.string().required("El Detalle es requerida"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setloading(true);
        try {
      // getIngresos(values);
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
          setloading(false);
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
        setFieldTouched,
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
              className={clsx(classes.root, prop.className)}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                  <Card>
                    <CardHeader title="Seleccione la Caja o Banco y la Fecha de corte para el filtro de las transacciones realizadas. La fecha de corte debe ser mayor a la ultima conciliacion." />
                    <Divider />
                  </Card>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardHeader title="Datos para conciliar" />
                    <Divider />
                    <CardContent>
                      <Grid item md={12} xs={12}>
                        <TextField
                          fullWidth
                          label="Cuentas"
                          name="Categoria"
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={values.Categoria}
                          variant="outlined"
                          disabled={prop?.data}
                        >
                          {categories.map((Categoria) => (
                            <option
                              key={Categoria.id}
                              value={JSON.stringify({
                                id: Categoria.id,
                                nombre: Categoria.data().Nombre,
                              })}
                            >
                              {Categoria.data().Nombre}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Saldo && errors.Saldo)}
                          helperText={touched.Saldo && errors.Saldo}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Saldo}
                          label="Saldo"
                          placeholder="Saldo Real de la Cuenta"
                          name="Saldo"
                          id="Saldo"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.FechaCorte && errors.FechaCorte
                          )}
                          helperText={touched.FechaCorte && errors.FechaCorte}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.FechaCorte}
                          label="Fecha de corte"
                          type="date"
                          placeholder="mm/dd/yyyy"
                          name="FechaCorte"
                          id="FechaCorte"
                          component={renderTextField}
                          disabled={prop?.data}
                        />
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardHeader title="Detalle" />
                    <Divider />
                    <CardContent>
                      <Paper variant="outlined">
                        <QuillEditor
                          className={classes.editor}
                          value={values.Detalle}
                          onChange={(value) => setFieldValue("Detalle", value)}
                        />
                      </Paper>
                      {touched.Detalle && errors.Detalle && (
                        <Box mt={2}>
                          <FormHelperText error>
                            {errors.Detalle}
                          </FormHelperText>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box mt={2}>
                {prop?.data ? (
                  <Button
                    color="success"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    <UpdateOutlined /> Actualizar
                  </Button>
                ) : (
                  <Button
                    color="success"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    <AddShoppingCartIcon /> Crear
                  </Button>
                )}
              </Box>
            </form>
          )}
        </Fragment>
      )}
    </Formik>
  );
};

ConjuntoCreateForm.propTypes = {
  className: PropTypes.string,
  fechavalidate: PropTypes.string,
};

export default ConjuntoCreateForm;
