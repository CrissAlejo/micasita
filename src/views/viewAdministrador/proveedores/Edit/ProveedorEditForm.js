import React, { Fragment } from "react";
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
  makeStyles,
} from "@material-ui/core";
import renderTextField from "../../../../components/FormElements/InputText";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import useSettings from "../../../../contextapi/hooks/useSettings";

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    "& .ql-editor": {
      height: 235,
    },
  },
}));

const ProveedorEditForm = ({ formularios, send }) => {
  const classes = useStyles();
  const { settings } = useSettings();
  const [loading, setloading] = React.useState(false);
  const [formulario] = React.useState(formularios);
  const { enqueueSnackbar } = useSnackbar();
 

  return (
    <Formik
      initialValues={{
        RazonSocial: formulario.data().RazonSocial,
        Correo: formulario.data().Correo,
        TelefonoOficina: formulario.data().TelefonoOficina,
        NombreRepresentante: formulario.data().NombreRepresentante,
        ApellidoRepresentante: formulario.data().ApellidoRepresentante,
        CorreoRepresentante: formulario.data().CorreoRepresentante,
        TelefonoRepresentante: formulario.data().TelefonoRepresentante,
        Direccion: formulario.data().Direccion,
        Ruc:formulario.data().Ruc,
        Detalle: formulario.data().Detalle,
      }}
      validationSchema={Yup.object().shape({
        RazonSocial: Yup.string().required("Se requiere rellenar este campo!"),
        Correo: Yup.string()
          .email("Ingrese un correo Valido!")
          .required("Se requiere rellenar este campo!")
          .nullable(),
        TelefonoOficina: Yup.string()
          .required("Se requiere rellenar este campo!")
          .matches(/^[0-9]+$/gm, "Solo se admiten numeros!")
          .nullable(),
        NombreRepresentante: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
        ApellidoRepresentante: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
        CorreoRepresentante: Yup.string()
          .email("Ingrese un correo Valido!")
          .required("Se requiere rellenar este campo!")
          .nullable(),
        TelefonoRepresentante: Yup.string()
          .required("Se requiere rellenar este campo!")
          .matches(/^[0-9]+$/gm, "Solo se admiten numeros!")
          .nullable(),
        Direccion: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setloading(true);
        try {
          FirestoreService.updateProveedor(settings.idConjunto,formulario.id, values
          ).then(
            () => {
            setStatus({ success: true });
            setSubmitting(false);
            setloading(false);

            enqueueSnackbar("Proveedor actualizado correctamente", {
              variant: "success",
            });
            send();
          });
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
        values,
      }) => (
        <Fragment>
          {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : (
            <form onSubmit={handleSubmit} >
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardHeader title="Datos personales" />
                    <Divider />
                    <CardContent>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.NombreRepresentante &&
                              errors.NombreRepresentante
                          )}
                          helperText={
                            touched.NombreRepresentante &&
                            errors.NombreRepresentante
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.NombreRepresentante}
                          label="Nombre Representante"
                          placeholder="Edison Vicente"
                          name="NombreRepresentante"
                          id="NombreRepresentante"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.ApellidoRepresentante &&
                              errors.ApellidoRepresentante
                          )}
                          helperText={
                            touched.ApellidoRepresentante &&
                            errors.ApellidoRepresentante
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.ApellidoRepresentante}
                          label="Apellido Representante"
                          placeholder="Edison Vicente"
                          name="ApellidoRepresentante"
                          id="ApellidoRepresentante"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.CorreoRepresentante &&
                              errors.CorreoRepresentante
                          )}
                          helperText={
                            touched.CorreoRepresentante &&
                            errors.CorreoRepresentante
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.CorreoRepresentante}
                          label="Correo Representante"
                          placeholder="vice***@gmail.com"
                          name="CorreoRepresentante"
                          id="CorreoRepresentante"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.TelefonoRepresentante &&
                              errors.TelefonoRepresentante
                          )}
                          helperText={
                            touched.TelefonoRepresentante &&
                            errors.TelefonoRepresentante
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.TelefonoRepresentante}
                          label="Telefono Representante"
                          placeholder="0987932320"
                          name="TelefonoRepresentante"
                          id="TelefonoRepresentante"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Detalle && errors.Detalle)}
                          helperText={touched.Detalle && errors.Detalle}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Detalle}
                          label="Detalle"
                          placeholder="0987932320"
                          name="Detalle"
                          id="Detalle"
                          component={renderTextField}
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
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Correo && errors.Correo)}
                          helperText={touched.Correo && errors.Correo}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Correo}
                          label="Correo"
                          placeholder="Correo Vendedor"
                          name="Correo"
                          id="Correo"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.TelefonoOficina && errors.TelefonoOficina
                          )}
                          helperText={
                            touched.TelefonoOficina && errors.TelefonoOficina
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.TelefonoOficina}
                          label="Telefono Oficina"
                          placeholder="0950000000"
                          name="TelefonoOficina"
                          id="TelefonoOficina"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.RazonSocial && errors.RazonSocial
                          )}
                          helperText={touched.RazonSocial && errors.RazonSocial}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.RazonSocial}
                          label="Razón Social"
                          placeholder="Razón Social"
                          name="RazonSocial"
                          id="RazonSocial"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Direccion && errors.Direccion)}
                          helperText={touched.Direccion && errors.Direccion}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Direccion}
                          label="Direccion"
                          placeholder="Quito"
                          name="Direccion"
                          id="Direccion"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Ruc && errors.Ruc)}
                          helperText={touched.Ruc && errors.Ruc}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Ruc}
                          label="Ruc"
                          placeholder="Ruc"
                          name="Ruc"
                          id="Ruc"
                          component={renderTextField}
                        />
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Button
                  color="success"
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  <AddShoppingCartIcon /> Actualizar
                </Button>
              </Box>
            </form>
          )}
        </Fragment>
      )}
    </Formik>
  );
};

export default ProveedorEditForm;
