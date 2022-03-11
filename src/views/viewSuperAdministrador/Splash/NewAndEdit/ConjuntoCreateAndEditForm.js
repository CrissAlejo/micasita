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
  Typography,
  List,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import renderTextField from "../../../../components/FormElements/InputText";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import bytesToSize from "../../../../utils/bytesToSize";
import PerfectScrollbar from "react-perfect-scrollbar";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import useStyles from "./useStyles";
//firebase
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const ConjuntoCreateAndEditForm = (props) => {
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
        enqueueSnackbar("Splash creado con éxito", {
          variant: "success",
        });
        props.send();
      }
    });
  };

  const subirFoto = (values) => {
    if (files.length > 0) {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef
        .child("splash/" + values.Detalle)
        .put(files[0]);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          var progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          throw error;
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            values.Imagen = url;
            newData(values);

          });
        }
      );
      try {
      } catch (error) {
        setloading(false);
      }
    } else {
      setloading(false);
      enqueueSnackbar("Debes seleccionar una imagen ", {
        variant: "error",
      });
    }
  };
  return (
    <Formik
      initialValues={{
        Detalle: "",
      }}
      validationSchema={Yup.object().shape({
        Detalle: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
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
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardHeader title="Detalle" />
                    <Divider />
                    <CardContent>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Detalle && errors.Detalle)}
                          helperText={touched.Detalle && errors.Detalle}
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
                    <CardHeader title="Imagen" />
                    <Divider />

                    <CardContent>
                      <div
                        className={clsx(classes.root, props.className)}
                        {...props.rest}
                      >
                        <div
                          className={clsx({
                            [classes.dropZone]: true,
                            [classes.dragActive]: isDragActive,
                          })}
                          {...getRootProps()}
                        >
                          <input {...getInputProps()} />
                          <div>
                            <img
                              alt="Imagen"
                              className={classes.image}
                              src={[
                                props.data
                                  ? props.data?.data().Imagen
                                  : "/assets/img/1.png",
                              ]}
                            />
                          </div>
                          <div>
                            <Typography gutterBottom variant="h3">
                              Selecciona imagen
                            </Typography>
                            <Box mt={2}>
                              <Typography color="textPrimary" variant="body1">
                                Suelta los archivos aquí o haz clic en{" "}
                                <Link underline="always">aqui</Link> para
                                acceder en tu máquina
                              </Typography>
                            </Box>
                          </div>
                        </div>
                        {files.length > 0 && (
                          <>
                            <PerfectScrollbar
                              options={{ suppressScrollX: true }}
                            >
                              <List className={classes.list}>
                                {files.map((file, i) => (
                                  <ListItem
                                    divider={i < files.length - 1}
                                    key={i}
                                  >
                                    <ListItemIcon>
                                      <FileCopyIcon />
                                    </ListItemIcon>

                                    <ListItemText
                                      primary={file.name}
                                      primaryTypographyProps={{ variant: "h5" }}
                                      secondary={bytesToSize(file.size)}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </PerfectScrollbar>
                            <div className={classes.actions}>
                              <Button onClick={handleRemoveAll} size="small">
                                Eliminar
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
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

ConjuntoCreateAndEditForm.propTypes = {
  className: PropTypes.string,
};

export default ConjuntoCreateAndEditForm;
