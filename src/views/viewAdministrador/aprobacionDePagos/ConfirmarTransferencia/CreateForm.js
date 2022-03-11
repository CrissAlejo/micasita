import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
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
  InputAdornment
} from "@material-ui/core";
import renderTextField from "../../../../components/FormElements/InputText";
import * as FirestoreService from "../Services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import useSettings from "../../../../contextapi/hooks/useSettings";

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
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [cuentas, setCuentas] = React.useState([]);
  const [rubros, setRubros] = React.useState([]);
  const [usuarios, setUsuarios] = React.useState([]);



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
    } catch (e) { }
  },[settings.idConjunto]);

  React.useEffect(() => {
    try {
      FirestoreService.getRubros(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setRubros(Items);
          },
        },
        settings.idConjunto
      );
    } catch (e) { }
  },[settings.idConjunto]);

  React.useEffect(() => {
    try {
      FirestoreService.getUsuariosByConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setUsuarios(Items);
          },
        },
        settings.idConjunto
      );
    } catch (e) { }
  },[settings.idConjunto]);

  return (
    <Formik
      initialValues={{
        CuentaUid: "",
        Descripcion: "",
        Usuario: "",
        Rubro: "",
        Valor: "",
      }}
      validationSchema={Yup.object().shape({
        CuentaUid: Yup.string()
          .required("¡Se requiere rellenar este campo!"),
        Descripcion: Yup.string()
          .required("¡Se requiere rellenar este campo!"),
        Usuario: Yup.string()
          .required("¡Se requiere rellenar este campo!"),
        Rubro: Yup.string()
          .required("¡Se requiere rellenar este campo!"),
        Valor: Yup.string()
          .required("¡Se requiere rellenar este campo!")
          .matches(/^\d*\.?\d*$/gm, "¡Solo se admiten números!"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setLoading(true);
        try {
          FirestoreService.newIngreso(settings.idConjunto, values).then(() => {
            setSubmitting(false);
            enqueueSnackbar("Pago añadido correctamente", {
              variant: "success",
            });
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
                  <TextField
                    error={errors.CuentaUid && touched.CuentaUid}
                    label="Cuenta"
                    name="CuentaUid"
                    placeholder="Selecciona la cuenta"
                    variant="outlined"
                    fullWidth="true"
                    select
                    SelectProps={{ native: true }}
                    value={values.CuentaOrigen}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.CuentaUid && touched.CuentaUid && errors.CuentaUid}
                  >
                    {cuentas.map((Cuenta) => (
                      <option key={Cuenta.id} value={Cuenta.id}>
                        {Cuenta.data().Nombre}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={errors.Rubro && touched.Rubro}
                    label="Rubro"
                    name="Rubro"
                    placeholder="Selecciona el Rubro del ingreso"
                    variant="outlined"
                    fullWidth="true"
                    select
                    SelectProps={{ native: true }}
                    value={values.Rubro}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.CuentaDestino && touched.CuentaDestino && errors.CuentaDestino}
                  >
                    {rubros.map((Rubro) => (
                      <option key={Rubro.id} value={Rubro.id}>
                        {Rubro.data().Nombre}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={errors.Usuario && touched.Usuario}
                    label="Usuario"
                    name="Usuario"
                    placeholder="Selecciona el Usuario"
                    variant="outlined"
                    fullWidth="true"
                    select
                    SelectProps={{ native: true }}
                    value={values.Usuario}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.Usuario && touched.Usuario && errors.Usuario}
                  >
                    <option key ={0} value= {null}>
                       Usuario no identificado 
                    </option>
                    {usuarios.map((Usuario) => (
                      <option key={Usuario.id} value={Usuario.id}>
                        {Usuario.data().Nombre}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6} lg={6}>
                  <TextField
                    error={errors.Valor && touched.Valor}
                    label="Valor"
                    name="Valor"
                    variant="outlined"
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
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={errors.Descripcion && touched.Descripcion}
                    label="Descripción del pago"
                    name="Descripcion"
                    placeholder="Agrega una descripción para la transacción"
                    variant="outlined"
                    fullWidth="true"
                    className={classes.margin}
                    value={values.Descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.Descripcion && touched.Descripcion && errors.Descripcion}
                  />
                </Grid>
              </Grid>
              <Box mt={2}>
                <Button
                  color="primary"
                  disabled={loading}
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
