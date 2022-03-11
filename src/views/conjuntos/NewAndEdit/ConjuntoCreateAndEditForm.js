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
  TextField,
  Grid,
  Typography,
  List,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import renderTextField from "../../../components/FormElements/InputText";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import bytesToSize from "../../../../src/utils/bytesToSize";
import PerfectScrollbar from "react-perfect-scrollbar";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import useStyles from "./useStyles";
//firebase
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../Firebase";

const ConjuntoCreateAndEditForm = (props) => {
  const classes = useStyles();
  const [loading, setloading] = React.useState(false);
  const [Provincias, setProvicnias] = React.useState([]);
  const [Ciudades, setCiudades] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [formulario] = React.useState(props.data);

  const handleDrop = React.useCallback((acceptedFiles) => {
    setFiles([]);
    setFiles((prevFiles) => [...prevFiles].concat(acceptedFiles));
  }, []);

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleCreate = (conjunto) => {
    const rubrosI = [
      { Tipo: "Ingreso", Nombre: "Ingresos ordinarios", SubRubros: ["Alícuota mensual", "Cuota por seguro", "Consumo de agua", "Consumo de gas", "Consumo de energia"] },
      { Tipo: "Ingreso", Nombre: "Saldos iniciales", SubRubros: ["Saldo Inicial"] },
      { Tipo: "Ingreso", Nombre: "Ingresos extraordinarios", SubRubros: ["Reserva áreas comunales", "Multas", "Cuota extraordinaria", "Intereses", "Notas de crédito bancarias"] },
      { Tipo: "Egreso", Nombre: "Servicios básicos", SubRubros: ["Agua potable", "Energía eléctrica", "Consumo teléfono", "Servicio de internet", "Consumo de gas", "Aseguradora"] },
      { Tipo: "Egreso", Nombre: "Salarios y beneficios de ley", SubRubros: ["Sueldos personal", "Décimo tercer sueldo", "Décimo cuarto sueldo", "Aporte IESS", "Fondos de reserva", "Indemnización", "Horas extras"] },
      {
        Tipo: "Egreso", Nombre: "Mantenimientos y reparaciones", SubRubros: ["Mantenimiento de bombas y equipo hidroneumático", "Mantenimiento e instalaciones eléctricas", "Mantenimeinto extintores", "Mantenimiento de caldero", "Mantenimineto equipos de agua caliente",
          "Mantenimiento e instalaciones de Gas", "Mantenimiento de equipos de computo", "Mantenimiento de ascensor", "Mantenimiento de generador", "Mantenimiento y construccion de jardines", "Mantenimiento de cámaras de seguridad",
          "Mantenimiento de puertas de acceso vehícular", "Mantenimiento puerta principal", "Mantenimiento cisternas"]
      },
      { Tipo: "Egreso", Nombre: "Gastos administrativos", SubRubros: ["Sistema de administración", "Movilización varias gestiones", "Administración", "Gastos varios"] },
      { Tipo: "Egreso", Nombre: "Seguridad", SubRubros: ["Servicios de guardianía"] },
      { Tipo: "Egreso", Nombre: "Prestacion de servicios", SubRubros: ["Servicios contables", "Servicios legales", "Servicios de limpieza", "Póliza contra incendios"] },
      { Tipo: "Egreso", Nombre: "Servicios bancarios", SubRubros: ["Comisiones bancarias", "Débito cheques devueldos"] },
      { Tipo: "Egreso", Nombre: "Caja chica", SubRubros: ["Cafetería", "Suministros de caja oficina", "Suministros de limpieza", "Devolución garantía salón comunal"] },
    ];

    rubrosI.map((rubro) => {
      FirestoreService.createRubros(conjunto, rubro);
    });
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  React.useEffect(() => {
    FirestoreService.getAllProvincias({
      next: (querySnapshot) => {
        const updatedGroceryItems = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        );
        setProvicnias(updatedGroceryItems);
        if (props.data) {
          getCity(props.data?.data().Provincia);
        }
      },
    });
  }, []);

  const getCity = (Ciudad) => {
    let namecitys = "";
    if (props.data) {
      namecitys = Ciudad;
    } else {
      namecitys = Ciudad.target.value;
    }
    FirestoreService.getCiudadesByProvincias(namecitys, {
      next: (querySnapshot) => {
        const updatedGroceryItems = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot.data()
        );
        setCiudades(updatedGroceryItems);
      },
    });
  };
  const newData = (values) => {
    FirestoreService.newConjunto(values).then((docRef) => {
      if (docRef) {
        setloading(false);
        handleCreate(docRef.id);
        enqueueSnackbar("Conjunto creado con éxito", {
          variant: "success",
        });
        props.send();
      }
    });
  };
  const update = (values) => {
    FirestoreService.updateConjunto(values, formulario.id).then((docRef) => {
      if (docRef) {
        setloading(false);
        enqueueSnackbar("Conjunto actualizado con éxito", {
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
        .child("fotoconjuntos/" + values.Ruc)
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
            if (formulario) {
              update(values);
            } else {
              newData(values);
            }
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
        Nombre: props.data?.data().Nombre || "",
        Ruc: props.data?.data().Ruc || "",
        NumComprobante: props.data?.data().NumeroComprobante || "",
        NumResidentes: props.data?.data().NumResidentes || "",
        NumParqueaderos: props.data?.data().NumParqueaderos || "",
        Direccion: props.data?.data().Direccion || "",

        NombreContacto: props.data?.data().NombreContacto || "",
        TelefonoContacto: props.data?.data().TelefonoContacto || "",
        CorreoContacto: props.data?.data().CorreoContacto || "",

        Ciudad: props.data?.data().Ciudad || "",
        Provincia: props.data?.data().Provincia || "",
      }}
      validationSchema={Yup.object().shape({
        Nombre: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),

        NombreContacto: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
        TelefonoContacto: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
        CorreoContacto: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),

        Ruc: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
        NumComprobante: Yup.number().nullable(),
        NumResidentes: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
        NumParqueaderos: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
        Direccion: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
        Ciudad: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
        Provincia: Yup.string()
          .required("Se requiere rellenar este campo!")
          .nullable(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setloading(true);
        if (files.length > 0) {
          subirFoto(values);
        }
        if (files.length == 0 && props.data) {
          values.Imagen = props.data?.data().Imagen;
          update(values);
        }
        if (files.length == 0 && !props.data) {
          setloading(false);
          enqueueSnackbar("LLena todos los campos", {
            variant: "error",
          });
        }

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
                    <CardHeader title="Datos del conjunto" />
                    <Divider />
                    <CardContent>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Nombre && errors.Nombre)}
                          helperText={touched.Nombre && errors.Nombre}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Nombre}
                          label="Nombre"
                          placeholder="Nombre"
                          name="Nombre"
                          id="Nombre"
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
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.NumComprobante && errors.NumComprobante
                          )}
                          helperText={
                            touched.NumComprobante && errors.NumComprobante
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.NumComprobante}
                          label="Número de Comprobante"
                          placeholder="0"
                          name="NumComprobante"
                          id="NumComprobante"
                          type='number'
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.NumResidentes && errors.NumResidentes
                          )}
                          helperText={
                            touched.NumResidentes && errors.NumResidentes
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.NumResidentes}
                          label="Número de Residentes"
                          type='number'
                          name="NumResidentes"
                          id="NumResidentes"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.NumParqueaderos && errors.NumParqueaderos
                          )}
                          helperText={
                            touched.NumParqueaderos && errors.NumParqueaderos
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.NumParqueaderos}
                          label="Número de Parqueaderos"
                          placeholder="0"
                          name="NumParqueaderos"
                          id="NumParqueaderos"
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
                          name="Direccion"
                          id="Direccion"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <TextField
                          fullWidth
                          error={Boolean(touched.Provincia && errors.Provincia)}
                          helperText={touched.Provincia && errors.Provincia}
                          label="Provincia"
                          name="Provincia"
                          onChange={handleChange}
                          select
                          onBlur={getCity}
                          SelectProps={{ native: true }}
                          value={values.Provincia}
                          variant="outlined"
                        >
                          <option></option>
                          {Provincias.map((Categoria) => (
                            <option
                              key={Categoria.nombre}
                              value={Categoria.nombre}
                            >
                              {Categoria.nombre}
                            </option>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item md={12} xs={12} style={{ marginTop: 10 }}>
                        <TextField
                          fullWidth
                          error={Boolean(touched.Ciudad && errors.Ciudad)}
                          helperText={touched.Ciudad && errors.Ciudad}
                          label="Ciudad"
                          name="Ciudad"
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={values.Ciudad}
                          variant="outlined"
                        >
                          <option></option>
                          {Ciudades.map((Categoria) => (
                            <option
                              key={Categoria.nombre}
                              value={Categoria.nombre}
                            >
                              {Categoria.nombre}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardHeader title="Datos de contacto" />
                    <Divider />
                    <CardContent>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.NombreContacto && errors.NombreContacto
                          )}
                          helperText={
                            touched.NombreContacto && errors.NombreContacto
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.NombreContacto}
                          label="Nombre de Contacto"
                          name="NombreContacto"
                          id="NombreContacto"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.TelefonoContacto && errors.TelefonoContacto
                          )}
                          helperText={
                            touched.TelefonoContacto && errors.TelefonoContacto
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.TelefonoContacto}
                          label="Teléfono Contácto"
                          placeholder="0900000000"
                          name="TelefonoContacto"
                          id="TelefonoContacto"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.CorreoContacto && errors.CorreoContacto
                          )}
                          helperText={
                            touched.CorreoContacto && errors.CorreoContacto
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.CorreoContacto}
                          label="Correo Contacto"
                          placeholder="example@example.com"
                          name="CorreoContacto"
                          id="CorreoContacto"
                          component={renderTextField}
                        />
                      </Grid>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader title="Imagen para el conjunto" />
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
