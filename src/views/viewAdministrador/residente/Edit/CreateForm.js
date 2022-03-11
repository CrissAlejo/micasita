import React, { Fragment } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import * as Yup from "yup";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  makeStyles,
  InputAdornment
} from "@material-ui/core";
import * as FirestoreService from "../services/firestore";
import EditIcon from '@material-ui/icons/Edit';
import useSettings from "../../../../contextapi/hooks/useSettings";

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    "& .ql-editor": {
      height: 160,
    },
  },
}));



const CreateForm = ({ className, send, usuario,...rest }) => {
  const classes = useStyles();
  const { settings } = useSettings();
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={{
        Nombre: usuario?.Nombre || "",
        Apellido: usuario?.Apellido || "",
        Cedula: usuario?.Cedula || "",
        Telefono: usuario?.Telefono || "",
        Alicuota: usuario?.Alicuota || "",
        Casa: usuario?.Casa || "",
      }}
      validationSchema={Yup.object().shape({
        Nombre: Yup.string()
          .required("¡Se requiere rellenar este campo!")
          .test('','Campo Nombre se encuentra vacio',
        function vnombre (nombre)
        { if (typeof nombre === 'undefined' ){return false;}else{nombre = nombre.trim();if(nombre == ''){return false;}else{return true;}}}),
        
        Apellido: Yup.string()
          .required("¡Se requiere rellenar este campo!")
          .test('','Campo Nombre se encuentra vacio',
        function vnombre (nombre)
        { if (typeof nombre === 'undefined' ){return false;}else{nombre = nombre.trim();if(nombre == ''){return false;}else{return true;}}}),
        
        Cedula: Yup.string()
          .required("¡Se requiere rellenar este campo!")
          .matches(/^\d*\.?\d*$/gm, "¡Solo se admiten números!"),
        Telefono: Yup.string()
          .required("¡Se requiere rellenar este campo!")
          .matches(/^\d*\.?\d*$/gm, "¡Solo se admiten números!"),
        Alicuota: Yup.string()
          .required("¡Se requiere rellenar este campo!")
          .matches(/^\d*\.?\d*$/gm, "¡Solo se admiten números!"),
        Casa: Yup.string()
          .required("¡Se requiere rellenar este campo!"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setLoading(true);
        try {
          values.Correo = usuario.Correo;
          values.ConjuntoUidResidencia = settings.idConjunto;
          FirestoreService.updateUser(values).then(() => {
            setSubmitting(false);
            setStatus({ success: true });
            setLoading(false);

            enqueueSnackbar("Usuario editado correctamente", {
              variant: "success",
            });
            send();
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
                  <TextField
                    error={errors.Nombre && touched.Nombre}
                    helperText={errors.Banco && touched.Nombre && errors.Nombre}
                    label="Nombre"
                    name="Nombre"
                    placeholder="Nombre del residente"
                    variant="outlined"
                    fullWidth="true"
                    value={values.Nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    error={errors.Apellido && touched.Apellido}
                    helperText={errors.Apellido && touched.Apellido && errors.Apellido}
                    label="Apellido"
                    name="Apellido"
                    defaultValue = {usuario.Apellido}
                    placeholder="Apellido del residente"
                    variant="outlined"
                    fullWidth="true"
                    value={values.Apellido}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={errors.Cedula && touched.Cedula}
                    label="Número de Cédula"
                    name="Cedula"
                    placeholder="Número de cédula del residente"
                    variant="outlined"
                    fullWidth="true"
                    value={values.Cedula}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.Cedula && touched.Cedula && errors.Cedula}
                  />        
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={errors.Telefono && touched.Telefono}
                    label="Número de Teléfono"
                    name="Telefono"
                    placeholder="Número de Teléfono del residente"
                    variant="outlined"
                    fullWidth="true"
                    value={values.Telefono}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.Telefono && touched.Telefono && errors.Telefono}
                  />        
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    error={errors.Casa && touched.Casa}
                    label="Número de casa"
                    name="Casa"
                    placeholder="Número de casa del residente"
                    variant="outlined"
                    fullWidth="true"
                    value={values.Casa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.Casa && touched.Casa && errors.Casa}
                  />        
                </Grid>
                <Grid item xs={6} lg={6}>
                  <TextField
                    error={errors.Alicuota && touched.Alicuota}
                    label="Alícuota"
                    name="Alicuota"
                    variant="outlined"
                    placeholder="Valor de alícuota del residente"
                    className={classes.margin}
                    value={values.Alicuota}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.Alicuota && touched.Alicuota && errors.Alicuota}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
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
                  <EditIcon /> Editar Residente
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
