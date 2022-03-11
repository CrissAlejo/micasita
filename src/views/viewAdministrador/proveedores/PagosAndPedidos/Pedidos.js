import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
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
  FormHelperText,
  Grid,
  TextField,
  makeStyles,
  Typography,
} from "@material-ui/core";
import * as FirestoreService from "../services/firestore";
import useSettings from "../../../../contextapi/hooks/useSettings";
import renderTextField from "../../../../components/FormElements/InputText";
import moment from "moment";

const useStyles = makeStyles(() => ({
  root: {},
}));

const Pedidos = (prop) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { settings } = useSettings();
  const [categories, setCategories] = React.useState([]);
  const [usuario, setUsuarios] = React.useState([]);
  const [rubros, setRubros] = React.useState([]);
  const [subRubros, setSubRubros] = React.useState([]);


  const getSubRubros = (Rubro) => {
    if (Rubro !== "") {
      FirestoreService.getSubRubross(settings.idConjunto, Rubro).then((doc) => {
        if (doc) {
          setSubRubros(doc.data().SubRubros);
        }
      });
    }
  };

  const getCategoriaById = React.useCallback(() => {
    try {
      FirestoreService.getCuentasById(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);

            setCategories(Items);
          },
        },
        settings.idConjunto
      );
      FirestoreService.getProveedoresByConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setUsuarios(Items);
          },
        },
        settings.idConjunto
      );
    } catch (e) {}
  }, [settings.idConjunto]);

  React.useEffect(() => {
    FirestoreService.getRubros(
      {
        next: (querySnapshot) => {
          const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
          setRubros(Items);
          if (prop.data?.data().Rubro) {
            getSubRubros(prop.data?.data().Rubro);
          }
          getCategoriaById();
        },
      },
      settings.idConjunto,
      "Egreso"
    );
  }, [getCategoriaById]);
  return (
    <Formik
      enableReinitialize
      initialValues={{
        Cuenta:
          JSON.stringify({
            id: prop.data?.data().CuentaUid,
            nombre: prop.data?.data().CuentaNombre,
            Banco: prop.data?.data().CuentaBanco,
          }) || "",
        Nombre: prop.data?.data().Nombre || "",
        Detalle: prop.data?.data().Detalle || "",
        Cantidad: prop.data?.data().Cantidad || "",
        Costo: prop.data?.data().Costo || "",
        NumeroFactura: prop.data?.data().NumeroFactura || "",
        FechaFactura: prop.data?.data().FechaFactura || "",
        Rubro: prop.data?.data().Rubro || "",
        SubRubro: prop.data?.data().SubRubro || "",
        Plazo: prop.data?.data().Plazo ? moment(prop.data?.data().Plazo.seconds* 1000).format('YYYY-MM-DD') : "",
        Proveedor: prop.data?.data().Proveedor || "",
      }}
      validationSchema={Yup.object().shape({
        Cuenta: Yup.string().required("La Cuenta es requerida"),
        Nombre: Yup.string().required("El Nombre es requerido"),
        Detalle: Yup.string().required("El Detalle es requerido"),
        Cantidad: Yup.number().required("La Cantidad es requerida"),
        Costo: Yup.string().required("El Costo es requerido"),
        Plazo: Yup.string().required("El Plazo es requerido"),
        NumeroFactura: Yup.string().required("La factura es requerido"),
        FechaFactura: Yup.string().required("La fecha  es requerido"),
        Rubro: Yup.string().required("¡Se requiere rellenar este campo!"),
        SubRubro: Yup.string().required("¡Se requiere rellenar este campo!"),
        Proveedor: Yup.string(),
      })}
      onSubmit={async (
        values,
        { resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          if (!prop.New) {
            let updateData = prop.data.data();
            if(prop.data?.data().ProveedorNombre == 'noproveedor'){
              if(!values.Proveedor){
                enqueueSnackbar("¡Se requiere actualizar el proveedor!", {
                  variant: "error",
                });
                return;
              }
              updateData = JSON.parse(values.Proveedor)
            }
            FirestoreService.updatePedido(
              settings.idConjunto,
              prop.data.id,
              values,
              updateData
            ).then(() => {
              setStatus({ success: true });
              setSubmitting(false);
              resetForm();
              prop.send();
              enqueueSnackbar("Pedido actualizado correctamente", {
                variant: "success",
              });
            });
          } else {
            let rs = prop.data.data();
            rs.id = prop.data.id;
            FirestoreService.newPedido(settings.idConjunto, rs, values).then(
              () => {
                setStatus({ success: true });
                setSubmitting(false);
                resetForm();
                prop.send();
                enqueueSnackbar("Pedido creado correctamente", {
                  variant: "success",
                });
              }
            );
          }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader title="Detalle del pedido" />
            <Divider />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.Nombre && errors.Nombre)}
                    fullWidth
                    helperText={touched.Nombre && errors.Nombre}
                    label="Nombre"
                    name="Nombre"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Nombre}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.Detalle && errors.Detalle)}
                    fullWidth
                    helperText={touched.Detalle && errors.Detalle}
                    label="Detalle"
                    name="Detalle"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.Detalle}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.Cantidad && errors.Cantidad)}
                    fullWidth
                    helperText={touched.Cantidad && errors.Cantidad}
                    label="Cantidad"
                    name="Cantidad"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Cantidad}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(
                      touched.NumeroFactura && errors.NumeroFactura
                    )}
                    fullWidth
                    helperText={touched.NumeroFactura && errors.NumeroFactura}
                    label="NumeroFactura"
                    name="NumeroFactura"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.NumeroFactura}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.Costo && errors.Costo)}
                    fullWidth
                    helperText={touched.Costo && errors.Costo}
                    label="Costo Total"
                    name="Costo"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Costo}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={errors.Cuenta && touched.Cuenta}
                    label="Cuenta Origen"
                    name="Cuenta"
                    placeholder="Selecciona la cuenta de Origen"
                    variant="outlined"
                    fullWidth="true"
                    select
                    SelectProps={{ native: true }}
                    value={values.Cuenta}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      errors.Cuenta && touched.Cuenta && errors.Cuenta
                    }
                  >
                    <option key={null} value={""}></option>
                    <optgroup label="Cuentas Bancarias">
                    {categories.filter(cuenta => cuenta.data().TipoMetodo == 'Cuenta Bancaria').map((Cuenta) => (
                      <option
                        key={Cuenta.id}
                        value={JSON.stringify({
                          id: Cuenta.id,
                          nombre: Cuenta.data().NombreCuenta,
                          Banco: Cuenta.data().Banco,
                        })}
                      >
                        {Cuenta.data().Banco}-{Cuenta.data().NombreCuenta}
                      </option>
                    ))}
                    </optgroup>
                    <optgroup label="Cuentas Bancarias">
                    {categories.filter(cuenta => cuenta.data().TipoMetodo == 'Caja').map((caja) => (
                      <option
                        key={caja.id}
                        value={JSON.stringify({
                          id: caja.id,
                          nombre: caja.data().NombreCaja,
                          Banco: null,
                        })}
                      >
                        {caja.data().NombreCaja}
                      </option>
                    ))}
                    </optgroup>
                  </TextField>
                </Grid>
                {prop.data.data().ProveedorNombre === "noproveedor" ? (
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={touched.Proveedor && errors.Proveedor}
                      fullWidth
                      helperText={errors.Proveedor && touched.Proveedor && errors.Proveedor}
                      label="Proveedor"
                      name="Proveedor"
                      onChange={handleChange}
                      select
                      SelectProps={{ native: true }}
                      value={values.Proveedor}
                      variant="outlined"
                    >
                      <option value={''}></option>
                      {usuario.map((Proveedor) => (
                        <option
                          key={Proveedor.id}
                          value={JSON.stringify({
                            ProveedorId: Proveedor.id,
                            ProveedorRuc: Proveedor.data().Ruc,
                            ProveedorNombre: Proveedor.data().NombreRepresentante+' '+Proveedor.data().ApellidoRepresentante,
                            ProveedorCelular: Proveedor.data().TelefonoRepresentante,
                          })}
                        >
                          {Proveedor.data().NombreRepresentante} {Proveedor.data().ApellidoRepresentante}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                ) : null}

                <Grid item md={6} xs={12}>
                  <Typography variant="h6" color="textPrimary">
                    Fecha de la factura
                  </Typography>
                  <Field
                    error={Boolean(touched.FechaFactura && errors.FechaFactura)}
                    helperText={touched.FechaFactura && errors.FechaFactura}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.FechaFactura}
                    label="Fecha Factura"
                    type="date"
                    placeholder="Fecha Plazo"
                    name="FechaFactura"
                    id="FechaFactura"
                    component={renderTextField}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography variant="h6" color="textPrimary">
                    Límite de pago
                  </Typography>
                  <Field
                    error={Boolean(touched.Plazo && errors.Plazo)}
                    helperText={touched.Plazo && errors.Plazo}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Plazo}
                    type="date"
                    label="Plazo"
                    placeholder="Plazo"
                    name="Plazo"
                    id="Plazo"
                    component={renderTextField}
                  />
                </Grid>
                <Grid item md={6} xs={6}>
                  <TextField
                    error={errors.Rubro && touched.Rubro}
                    label="Rubro"
                    name="Rubro"
                    placeholder="Selecciona el Rubro del Egreso"
                    variant="outlined"
                    fullWidth="true"
                    select
                    SelectProps={{ native: true }}
                    value={values.Rubro}
                    onChange={handleChange}
                    onBlur={() => {
                      getSubRubros(values.Rubro);
                    }}
                    helperText={
                      errors.Rubro &&
                      touched.Rubro &&
                      errors.Rubro
                    }
                  >
                    <option key={null} value={""}></option>
                    {rubros.map((Rubro) => (
                      <option key={Rubro.id} value={Rubro.id}>
                        {Rubro.data().Nombre}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={6}>
                  <TextField
                    error={errors.SubRubro && touched.SubRubro}
                    label="SubRubro"
                    name="SubRubro"
                    placeholder="Selecciona el SubRubro del ingreso"
                    variant="outlined"
                    fullWidth="true"
                    select
                    SelectProps={{ native: true }}
                    value={values.SubRubro}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      errors.SubRubro && touched.SubRubro && errors.SubRubro
                    }
                  >
                    <option key={null} value={""}></option>
                    {subRubros.map((subRubro) => (
                      <option key={subRubro} value={subRubro}>
                        {subRubro}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
          </Card>
          <Box p={2}>
            <Button
              color="primary"
              fullWidth
              disabled={isSubmitting}
              type="submit"
              variant="contained"
            >
              Guardar
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

Pedidos.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired,
};

export default Pedidos;
