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

const ProveedorCreateForm = ({ className, send, ...rest }) => {
  const classes = useStyles();
  const { settings } = useSettings();
  const [loading, setloading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={{
        RazonSocial: "",
        Correo: "",
        TelefonoOficina: "",
        NombreRepresentante: "",
        ApellidoRepresentante: "",
        CorreoRepresentante: "",
        TelefonoRepresentante: "",
        Direccion: "",
        Ruc: "",
        Detalle: ""
      }}
      validationSchema={Yup.object().shape({
        RazonSocial: Yup.string().required("Se requiere rellenar este campo!"),
        Detalle: Yup.string().required("Se requiere rellenar este campo!")
        .test('','Campo Detalle se encuentra vacio',function vdetalle (detalle){if (typeof detalle === 'undefined' ){return false;}else{detalle = detalle.trim();if(detalle == ''){return false;}else{return true;}}}),
        Correo: Yup.string()
          .email("Ingrese un correo Valido!")
          .required("Se requiere rellenar este campo!")
          .nullable(),
        TelefonoOficina: Yup.string()
          .required("Se requiere rellenar este campo!")
          .matches(/^[0-9]+$/gm, "Solo se admiten numeros!")
          .nullable()
          .max(20,'¡Maximo de 20 caracteres!'),
        Ruc: Yup.string()
          .required("Se requiere rellenar este campo!")
          .matches(/^[0-9]+$/gm, "Solo se admiten numeros!")
          .nullable()
          .max(13,'¡Maximo de 13 caracteres!'),
        NombreRepresentante: Yup.string()
          .required("Se requiere rellenar este campo!")
          .test('','Campo Nombre se encuentra vacio',function vnombre (nombre){if (typeof nombre === 'undefined' ){return false;}else{nombre = nombre.trim();if(nombre == ''){return false;}else{return true;}}}),
        ApellidoRepresentante: Yup.string()
          .required("Se requiere rellenar este campo!")
          .test('','Campo Apellido se encuentra vacio',function vapellido (apellido){if (typeof apellido === 'undefined' ){return false;}else{apellido = apellido.trim();if(apellido == ''){return false;}else{return true;}}}),
        CorreoRepresentante: Yup.string()
          .email("Ingrese un correo Valido!")
          .required("Se requiere rellenar este campo!")
          .nullable(),
        TelefonoRepresentante: Yup.string()
          .required("Se requiere rellenar este campo!")
          .matches(/^[0-9]+$/gm, "Solo se admiten numeros!")
          .max(20,'¡Maximo de 20 caracteres!'),

        Direccion: Yup.string()
          .required("Se requiere rellenar este campo!")
          .test('','Campo Dirección se encuentra vacio',function vdirecion (direcion){if (typeof direcion === 'undefined' ){return false;}else{direcion = direcion.trim();if(direcion == ''){return false;}else{return true;}}}),
       
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setloading(true);
        try {
          FirestoreService.newProveedor(settings.idConjunto, values).then(
            () => {
              setStatus({ success: true });
              setSubmitting(false);
              setloading(false);

              enqueueSnackbar("Proveedor creado correctamente", {
                variant: "success",
              });
              send();
            }
          );
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
            <form
              onSubmit={handleSubmit}
              className={clsx(classes.root, className)}
              {...rest}
            >
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
                          placeholder="Nombre"
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
                          placeholder="Apellido"
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
                          placeholder="teléfono"
                          name="TelefonoRepresentante"
                          id="TelefonoRepresentante"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.Detalle &&
                            errors.Detalle
                          )}
                          helperText={
                            touched.Detalle &&
                            errors.Detalle
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Detalle}
                          label="Detalle"
                          placeholder="Detalle"
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
                    <CardHeader title="Empresa" />
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
                          placeholder="Correo empresa"
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

ProveedorCreateForm.propTypes = {
  className: PropTypes.string,
};

export default ProveedorCreateForm;
