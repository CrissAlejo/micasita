import React, { Fragment } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import renderTextField from "../../../../components/FormElements/InputText";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import useStyles from "./useStyles";
//firebase
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";
import "moment/locale/es";
const CreateForm = (props) => {
  const classes = useStyles();
  const [loading, setloading] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleDrop = React.useCallback((acceptedFiles) => {
    setFiles([]);
    setFiles((prevFiles) => [...prevFiles].concat(acceptedFiles));
  }, []);

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  const newData = (values) => {
    FirestoreService.newConjunto(values).then((docRef) => {
      if (docRef) {
        setloading(false);
        enqueueSnackbar("Mantenimiento creado con éxito", {
          variant: "success",
        });
        props.send();
      }
    });
  };

  const subirFoto = (values) => {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef
        .child(
          values.Fechaini,
          values.Responsable,
          values.Descripcion,
          values.Fechafut,
          values.Observacion
          );
        newData(values);
      try {
      } catch (error) {
        setloading(false);
      }
    
  };
  return (
    <Formik
      initialValues={{
        Fechaini: "",
        Responsable: "",
        Descripcion: "",
        Fechafut: "",
        Observacion: "",
      }}
      validationSchema={Yup.object().shape({
        Fechaini: Yup.string()
          .required("Se requiere rellenar este campo!"),
          Responsable: Yup.string()
          .required("Se requiere rellenar este campo!"),
          Descripcion: Yup.string()
          .required("Se requiere rellenar este campo!"),
          Fechafut: Yup.string()
          .required("Se requiere rellenar este campo!"),
          Observacion: Yup.string()
          .required("Se requiere rellenar este campo!"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setloading(true);
        subirFoto(values);
        try {
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
        setFieldValue,
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
              className={clsx(classes.root, props.className)}
              {...props.rest}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                  <Card>
                    <Divider />
                    <CardContent>
                      <Grid item md={12} lg={12}>
                      <h6>Selecione la fecha del mantenimiento</h6>
                      <Field
                          error={Boolean(touched.Fechaini && errors.Fechaini)}
                          helperText={touched.Fechaini && errors.Fechaini}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Fechaini}
                          name="Fechaini"
                          id="Fechaini"
                          type="Date"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Responsable && errors.Responsable)}
                          helperText={touched.Responsable && errors.Responsable}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Responsable}
                          label="Responsable"
                          name="Responsable"
                          id="Responsable"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Descripcion && errors.Descripcion)}
                          helperText={touched.Descripcion && errors.Descripcion}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Descripcion}
                          label="Descripción del Mantenimiento"
                          name="Descripcion"
                          id="Descripcion"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                      <h6>Selecione la fecha del proximo mantenimiento</h6>
                        <Field
                          error={Boolean(touched.Fechafut && errors.Fechafut)}
                          helperText={touched.Fechafut && errors.Fechafut}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Fechafut}
                          name="Fechafut"
                          id="Fechafut"
                          type="Date"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        
                        <Field
                          error={Boolean(touched.Observacion && errors.Observacion)}
                          helperText={touched.Observacion && errors.Observacion}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Observacion}
                          label="Observaciones o detalles"
                          name="Observacion"
                          id="Observacion"
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

CreateForm.propTypes = {
  className: PropTypes.string,
};
export default CreateForm;