import React, { Fragment } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import * as Yup from "yup";
import { Formik } from "formik";
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
import * as FirestoreService from "../services/firestore";
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
  const {settings} = useSettings();
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const tipoRubro = [
    { id: 0, Nombre: 'Ingreso' },
    { id: 1, Nombre: 'Egreso' },
  ];

  return (
    <Formik
      initialValues={{
        Nombre: "",
        Tipo: "",
      }}
      validationSchema={Yup.object().shape({
        Nombre: Yup.string()
        .required("¡Se requiere rellenar este campo!"),
        Tipo: Yup.string()
        .required("¡Se requiere rellenar este campo!")    
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setLoading(true);
        try {    

          values.SubRubros = [];
          FirestoreService.createRubros(settings.idConjunto,values).then(()=>{
            setStatus({ success: true });
            setSubmitting(false);
            setLoading(false);

            enqueueSnackbar("Pago añadido correctamente", {
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
                    <CardHeader title="Nuevo Rubro" />
                    <Divider />
                    <CardContent>
                          <Grid item xs={12} lg={12}>
                            <TextField
                                error={errors.Tipo && touched.Tipo}
                                label="Tipo del rubro"
                                name="Tipo"
                                variant="outlined"
                                fullWidth = "true"
                                select
                                SelectProps={{ native: true }}
                                value={values.Tipo}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.Tipo && touched.Tipo && errors.Tipo}     
                            >
                                <option key={null} value={""}>
                                    
                                </option>
                                {tipoRubro.map((tipo) => (
                                    <option key={tipo.id} value={tipo.Nombre}>
                                     {tipo.Nombre}
                                    </option>
                                ))}
                            </TextField>
                          </Grid>
                          <br/>
                          <br/>
                          <Grid item xs={12} lg={12}>
                            <TextField
                                error={errors.Nombre && touched.Valor}
                                label="Nombre del rubro"
                                name="Nombre"
                                variant="outlined"
                                className={classes.margin}
                                value={values.Nombre}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.Nombre && touched.Nombre && errors.Nombre}     
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

CreateForm.propTypes = {
  className: PropTypes.string,
};

export default CreateForm;
