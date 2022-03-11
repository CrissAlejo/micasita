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
  TextField,
  makeStyles,
} from "@material-ui/core";
import renderTextField from "../../../../../components/FormElements/InputText";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    "& .ql-editor": {
      height: 235,
    },
  },
}));

const EditForm = ({ formularios, send }) => {
  const classes = useStyles();
  const [idconjunto] = React.useState("EaANNkFf8WuYQbqGWpkM");
  const [loading, setLoading] = React.useState(false);
  const [formulario] = React.useState(formularios);
  const { enqueueSnackbar } = useSnackbar();
  const [bancos, setBancos] = React.useState([]);
  const TipoCuenta = [
    { id: 0, Nombre: 'Ahorros' },
    { id: 1, Nombre: 'Corriente' },
  ];
  const TipoIdentificacion =[
    { id: 0, Nombre: 'Ruc' },
    { id: 1, Nombre: 'Cédula' },
    { id: 2, Nombre: 'Pasaporte' },
  ];

  React.useEffect(() => {
    FirestoreService.getAllBanks({
      next: (querySnapshot) => {
        const items = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        );
        setBancos(items);
        setLoading(false);
      },
    });
  }, []);

  return (
    <Formik
      initialValues={{
        Banco: formulario.data().Banco,
        TipoCuenta: formulario.data().TipoCuenta,
        NombreCuenta: formulario.data().NombreCuenta,
        NumeroCuenta: formulario.data().NumeroCuenta,
        TipoIdentificacion: formulario.data().TipoIdentificacion,
        Identificacion: formulario.data().Identificacion,
        Correo: formulario.data().Correo,
      }}
      validationSchema={Yup.object().shape({
        Banco: Yup.string().ensure()
        .required("¡Se requiere rellenar este campo!"),
        TipoCuenta: Yup.string().ensure()
        .required("¡Se requiere rellenar este campo!"),
        TipoIdentificacion: Yup.string().ensure()
        .required("¡Se requiere rellenar este campo!"),
        NombreCuenta: Yup.string().ensure()
          .max(255)
          .required("¡Se requiere rellenar este campo!")
          .nullable(),
        NumeroCuenta: Yup.string()
          .max(20)
          .required("¡Se requiere rellenar este campo!")
          .matches(/^[0-9]+$/gm, "¡Solo se admiten números!")
          .nullable(),
        Correo: Yup.string()
          .email("Ingrese un correo Valido!")
          .required("¡Se requiere rellenar este campo!")
          .nullable(),
        Identificacion: Yup.string()
        .required("¡Se requiere rellenar este campo!")
        .nullable(),       
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setLoading(true);
        try {
          FirestoreService.getImagen(formulario.data().Banco).get().then((doc) => {
            if (doc.exists) {  
              FirestoreService.updateCuenta(idconjunto,values, formulario.id, doc.data().Imagen).then(() =>{
                setStatus({ success: true });
                setSubmitting(false);
                setLoading(false);

                enqueueSnackbar("Cuenta actualizada correctamente", {
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
            className={clsx(classes.root)}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} lg={12}>
                <Card>
                  <CardHeader title="Datos bancarios" />
                  <Divider />
                  <CardContent>
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Banco"
                        name="Banco"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.Banco}
                        variant="outlined"
                      >
                        {bancos.map((banco) => (
                          <option key={banco.Nombre} value={banco.Nombre} defaultValue ="">
                            {banco.Nombre}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <br/>
                    <br/>
                    <Grid item md={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Tipo de cuenta"
                        name="TipoCuenta"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.TipoCuenta}
                        variant="outlined"
                      >
                        {TipoCuenta.map((tipoCuenta) => (
                          <option key={tipoCuenta.Nombre} value={tipoCuenta.Nombre} defaultValue ="">
                            {tipoCuenta.Nombre}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Field
                        error={Boolean(touched.NumeroCuenta && touched.NombreCuenta)}
                        helperText={touched.NumeroCuenta && errors.NumeroCuenta}
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
                        error={Boolean(touched.Correo && touched.NombreCuenta)}
                        helperText={touched.NombreCuenta && errors.NombreCuenta}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.Saldo}
                        label="Nombre del titular"
                        placeholder="Nombre del titular de la cuenta"
                        name="NombreCuenta"
                        id="NombreCuenta"
                        component={renderTextField}
                      />
                    </Grid>
                    <Grid item md={12} xs={6}>
                      <TextField
                        fullWidth
                        label="Tipo de identificación"
                        name="TipoIdentificacion"
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.TipoIdentificacion}
                        variant="outlined"
                      >
                        {TipoIdentificacion.map((tipoIdeniIficacion) => (
                          <option key={tipoIdeniIficacion.Nombre} value={tipoIdeniIficacion.Nombre} defaultValue ="">
                            {tipoIdeniIficacion.Nombre}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item md={12} xs={6}>
                      <Field
                        error={Boolean(touched.Identificacion && errors.Identificacion)}
                        helperText={touched.Identificacion && errors.Identificacion}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.Saldo}
                        label="Identificación"
                        placeholder="Identificación"
                        name="Identificacion"
                        id="Identificacion"
                        component={renderTextField}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Field
                        error={Boolean(touched.Correo && errors.Correo)}
                        helperText={touched.Correo && errors.Correo}
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

export default EditForm;
