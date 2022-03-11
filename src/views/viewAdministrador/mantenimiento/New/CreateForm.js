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
import UpdateOutlined from "@material-ui/icons/UpdateOutlined";
import { useSnackbar } from "notistack";
import useAuth from "../../../../contextapi/hooks/useAuth";
import { useDropzone } from "react-dropzone";
import useStyles from "./useStyles";
//firebase
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";
import "moment/locale/es";
import useSettings from "../../../../contextapi/hooks/useSettings";
import axios from "axios";
const CreateForm = (props) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [loading, setloading] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [formulario] = React.useState(props.data);
  const [formularios, setFormularios] = React.useState({});
  const { settings } = useSettings();
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
    FirestoreService.newConjunto(settings.idConjunto,values).then((docRef) => {
      if (docRef) {
        setloading(false);
        enqueueSnackbar("Mantenimiento creado con éxito", {
          variant: "success",
        });
        props.send();
      }
    });
  };
  const UpdateData = (values) => {
    
      FirestoreService.updateMantenimiento(settings.idConjunto,values,formulario.id).then((doc) => {
        console.log(doc);
        setloading(false);
        enqueueSnackbar("Mantenimiento Actualizado correctamente", {
          variant: "success",
        });
        props.send();

      });
  
  };

  

  const subirMantenimiento = (values, tipo) => {
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
          if(tipo == 0)
          {
        newData(values);
      }else{UpdateData(values);}


      try {
      } catch (error) {
        setloading(false);
      }  
  };

  return (
    <Formik
      initialValues={{
        Fechaini: props.data?.data().Fechainicio || "",
        Responsable: props.data?.data().Responsable || "",
        Descripcion: props.data?.data().Mantenimiento || "",
        Fechafut: props.data?.data().ManFuturo || "",
        Observacion: props.data?.data().Observaciones || "",
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
       // subirMantenimiento(values);
        try {
          if (!props.data?.data()) {
            subirMantenimiento(values, 0);
          } else {
            if (files.length > 0) {
              newData(values, 1);
            } else {
              
              UpdateData(values);
            }
          }
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
                      <h6>Selecione la fecha de de ingreso</h6>
                      <Field
                          error={Boolean(touched.Fechaini && errors.Fechaini)}
                          helperText={touched.Fechaini && errors.Fechaini}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Fechaini}
                         // label="Fecha de Registro"
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
                          label="Responsable del Mantenimiento"
                          placeholder="Nombre del Responsabla"
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
                          placeholder="Descripción"
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
                          placeholder="Observaciones"
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
                {props?.data ? (
                  <Button
                    color="primary"
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
                    color="primary"
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

CreateForm.propTypes = {
  className: PropTypes.string,
};
export default CreateForm;