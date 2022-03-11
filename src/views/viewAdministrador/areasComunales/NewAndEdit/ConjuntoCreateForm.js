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
  List,
  Link,
  Grid,
  Typography,
  FormControlLabel,
  makeStyles,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Input,
  Select,
  MenuItem,
  Chip,
  TextField,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import renderTextField from "../../../../components/FormElements/InputText";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import UpdateOutlined from "@material-ui/icons/UpdateOutlined";
import PerfectScrollbar from "react-perfect-scrollbar";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { useDropzone } from "react-dropzone";
import bytesToSize from "../../../../../src/utils/bytesToSize";
import { useSnackbar } from "notistack";
import Autocomplete from "@material-ui/lab/Autocomplete";
import useSettings from "../../../../contextapi/hooks/useSettings";
//firebase
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const useStyles = makeStyles((theme) => ({
  root: {},
  image: {
    width: 130,
  },
  editor: {
    "& .ql-editor": {
      height: 160,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ConjuntoCreateForm = (prop) => {
  const theme = useTheme();

  const classes = useStyles();
  const { settings } = useSettings();
  const [loading, setloading] = React.useState(false);
  const [formulario] = React.useState(prop.data);
  const [formularios, setFormularios] = React.useState({});
  const [checked, setChecked] = React.useState(true);

const handleChange = (event) => {
     setChecked(event.target.checked);
     
  };

  const { enqueueSnackbar } = useSnackbar();
  const [personName, setPersonName] = React.useState(
    formulario?.data()?.DiasHabiles || []
  );

  const names = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const [files, setFiles] = React.useState([]);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
   

  
  const handleDrop = React.useCallback((acceptedFiles) => {
    setFiles([]);
    setFiles((prevFiles) => [...prevFiles].concat(acceptedFiles));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });
  const getConjuntoById = React.useCallback(() => {
    try {
    } catch (e) {}
  }, [settings.idConjunto]);
  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);
  const handleRemoveAll = () => {
    setFiles([]);
  };

 
  const categories = [
    { id: "Lunes", label: "Lunes" },
    { id: "Martes", label: "Martes" },
    { id: "Miércoles", label: "Miércoles" },
    { id: "Jueves", label: "Jueves" },
    { id: "Viernes", label: "Viernes" },
    { id: "Sábado", label: "Sábado" },
    { id: "Domingo", label: "Domingo" },
  ];
  const periodo = [
    { id: "", label: "-- Seleccione un Período --" },
    { id: 7, label: "Semanal" },
    { id: 30, label: "Mensual" },
    { id: 365, label: "Anual" },
  ];
  function handleChangeSelectM(event) {
    let userdata = formularios;
    userdata.DiasHabiles = event.target.value;
    setFormularios(userdata);
    setPersonName(event.target.value);
  }

  const newAreaComunal = (values) => {
    values.DiasHabiles = personName;
    FirestoreService.newArea(settings.idConjunto, values).then((docRef) => {
      setloading(false);
      enqueueSnackbar("Área creada con éxito", {
        variant: "success",
      });
      prop.send();
    });
  };

  const UpdateAreaComunal = (values) => {
    try {
      FirestoreService.updateArea(
        settings.idConjunto,
        values,
        formulario.id
      ).then((doc) => {
        console.log(doc);
        setloading(false);
        enqueueSnackbar("Área Actualizada correctamente", {
          variant: "success",
        });
        prop.send();

      });
    } catch (e) {
      console.log(e);

    }
  };
  

  const subirFoto = (values, tipo) => {
    if (files.length > 0) {
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var uploadTask = storageRef
        .child("areascomunales/" + values.Nombre)
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

            if (tipo == 0) {
              newAreaComunal(values);
            } else {
              
              values.DiasHabiles = personName;
              UpdateAreaComunal(values);

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

  
  //console.log("Datos", prop.data?.data(tartget.value).Nombre);
  return (
    
    <Formik
      initialValues={{
        Nombre: prop.data?.data().Nombre || "",
        HorasUso: prop.data?.data().HorasUso || "",
        HoraInicio: prop.data?.data().HoraInicio || "",
        HoraFin: prop.data?.data().HoraFin || "",
        Garantia: prop.data?.data().Garantia || "",
        Aforo: prop.data?.data().Aforo || "",
        ReservaxUsuario: prop.data?.data().ReservaxUsuario || "",
        DiasAnticipacion: prop.data?.data().DiasAnticipacion || "",
        Periodo: prop.data?.data().Periodo || "",
        TerminosCond: prop.data?.data().TerminosCond || "",
        Habilitado: prop.data?.data().Habilitado || true,
        MultiReserva: prop.data?.data().MultiReserva || false,
        ConvenioPago: prop.data?.data().ConvenioPago || false,
      }}
      validationSchema={Yup.object().shape({
        Nombre: Yup.string().required("Se requiere un nombre")
        .test('','Campo Nombre se encuentra vacio',
        function vnombre (nombre)
        { if (typeof nombre === 'undefined' ){return false;}else{nombre = nombre.trim();if(nombre == ''){return false;}else{return true;}}}),
        HorasUso: Yup.string().required("Se requiere las horas de Uso").matches(/^(?!0\.00)[1-9]\d{0,2}?$/gm, "¡Solo se admiten un número máximo de Horas por usuario de 999!"),
        HoraInicio: Yup.string().required("Se requiere la hora de Apertura"),
        HoraFin: Yup.string().required("Se requiere la hora de Cierre"),
        Garantia: Yup.string().required("¡Se requiere rellenar este campo!").matches(/^(?!0\.00)[1-9]\d{0,3}(\.\d{1,2})?$/gm, "¡Solo se admiten números Ej: (9999,99)!"),
        Aforo: Yup.string().required("Se requiere la cantidad de Áforo").matches(/^(?!0\.00)[1-9]\d{0,2}?$/gm, "¡Solo se admiten un número máximo de Áforo de 999!"),
        ReservaxUsuario: Yup.string().max(20)
        .required("Reserva máxima de un usuario por período")
        .matches(/^(?!0\.00)[1-9]\d{0,1}?$/gm, "¡Solo se admiten una reserva maxima de 20 Dias!")
        ,

        DiasAnticipacion: Yup.string().max(365).required("Se requiere días de anticipación").matches(/^(?!0\.00)[1-9]\d{0,2}?$/gm, "¡Solo se admiten 365 como número máximo de Dias!")
        .test('','¡Solo se admiten 365 como número máximo de Dias!',function vdias (dias){if(dias<=365){return true;}else{return false;}}),
        Periodo: Yup.string().required("Se requiere el período"),
        TerminosCond: Yup.string().required("Se requieren Términos y Condiciones")
        .test('','Campo Terminos y Condiciones se encuentra vacio',
        function vterminos (terminos)
        { if (typeof terminos === 'undefined' ){return false;}else{terminos = terminos.trim();if(terminos == ''){return false;}else{return true;}}}),
        Habilitado: Yup.bool().required(),
        MultiReserva: Yup.bool().required(),
        ConvenioPago: Yup.bool().required(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setloading(true);

        try {
          if (!prop.data?.data()) {
            subirFoto(values, 0);
          } else {
            if (files.length > 0) {
              subirFoto(values, 1);
            } else {
              values.Imagen = prop.data?.data().Imagen;
              values.DiasHabiles = personName;
              UpdateAreaComunal(values);
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
              className={clsx(classes.root, prop.className)}
              >
                
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardHeader title="Detalles" />
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
                          name="Nombre"
                          id="Nombre"
                          component={renderTextField}
                        />
                      </Grid>

                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Garantia && errors.Garantia)}
                          helperText={touched.Garantia && errors.Garantia}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Garantia}
                          label="Garantía"
                          name="Garantia"
                          id="Garantia"
                          type="number"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Aforo && errors.Aforo)}
                          helperText={touched.Aforo && errors.Aforo}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Aforo}
                          label="Áforo"
                          name="Aforo"
                          id="Aforo"
                          type="number"
                          component={renderTextField}
                        />
                        </Grid>
                        </CardContent>
                      </Card>

                    <Card style={{ marginTop: 10 }}>
                      <CardHeader title="Disponibilidad" />
                    <Divider />
                      <CardContent>
                      <Grid item md={12} xs={12} style={{ marginTop: -10 }}>
                          <InputLabel>Período</InputLabel>
                          <InputLabel>.</InputLabel>
                        <TextField
                          style={{ width: 260 }}
                          error={Boolean(touched.Periodo && errors.Periodo)}
                          fullWidth
                          helperText={touched.Periodo && errors.Periodo}
                          name="Periodo"
                          onChange={handleChange}
                          select
                          multiple
                          SelectProps={{ native: true }}
                          value={values.Periodo}
                          variant="outlined"
                        >
                          {periodo.map((Categoria) => (
                            <option key={Categoria.id} value={Categoria.id}>
                              {Categoria.label}
                            </option>
                          ))}
                        </TextField>
                        
                      </Grid >
                        <Grid item md={12} xs={12} style={{ marginTop: 15 }}>
                          <InputLabel>Reserva máxima de un usuario por período</InputLabel>
                          <Field
                            style={{ width: "270px" }}
                          error={Boolean(
                            touched.ReservaxUsuario && errors.ReservaxUsuario
                          )}
                          helperText={
                            touched.ReservaxUsuario && errors.ReservaxUsuario
                          }
                          onBlur={handleBlur}
                          
                          onChange={handleChange}
                          value={values.ReservaxUsuario}
                          label=""
                          placeholder="Reserva Máxima por Usuario"
                          name="ReservaxUsuario"
                          id="ReservaxUsuario"
                          type="number"
                          component={renderTextField}
                        />
                        </Grid>
                       

                        <Grid item md={6} xs={12} style={{ marginTop: 20 }}>
                            <InputLabel>Días Hábiles</InputLabel>

                        <Select
                          style={{ width: 260 }}
                          labelId="diasHabilesLabel"
                          id="diasHabiles"
                          multiple
                          required
                          //value={prop.data?.data().DiasHabiles || " "}
                          value={personName}
                          onChange={handleChangeSelectM}
                          input={<Input id="selectDiasHabiles" />}
                          renderValue={(selected) => (
                            <div className={classes.chips}>
                              {selected.map((value) => (
                                <Chip
                                  key={value}
                                  label={value}
                                  className={classes.chip}
                                />
                              ))}
                            </div>
                          )}
                          MenuProps={MenuProps}
                        >
                          {names.map((name) => (
                            <MenuItem
                              key={name}
                              value={name}
                              style={getStyles(name, personName, theme)}
                            >
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                        </Grid>
                      <Grid container spacing={3} style={{ marginTop: 10 }}>
                        <Grid item xs={12} md={6}>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.Habilitado}
                                  onChange={handleChange}
                                  value={values.Habilitado}
                                  name="Habilitado"
                                />
                              }
                              label="Habilitar"
                            />
                          </Box>
                        </Grid>

                        <Grid item xs={12} lg={6}>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.MultiReserva}
                                  onChange={handleChange}
                                  value={values.MultiReserva}
                                  name="MultiReserva"
                                />
                              }
                              label="Multi Reserva"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <Box mt={2}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.ConvenioPago}
                                  onChange={handleChange}
                                  value={values.ConvenioPago}
                                  name="ConvenioPago"
                                />
                              }
                              label="Reservas en Mora"
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardHeader title="Horarios" />
                    <Divider />

                    <CardContent>
                        <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.HorasUso && errors.HorasUso)}
                          helperText={touched.HorasUso && errors.HorasUso}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.HorasUso}
                          label="Máximo de horas por usuario"
                          name="HorasUso"
                          id="HorasUso"
                          type="number"
                          component={renderTextField}
                        />
                      </Grid>

                        <Grid item md={12} xs={12}>
                          <InputLabel>Hora inicio</InputLabel>
                        <Field
                          error={Boolean(
                            touched.HoraInicio && errors.HoraInicio
                          )}
                          helperText={touched.HoraInicio && errors.HoraInicio}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.HoraInicio}
                          name="HoraInicio"
                          id="HoraInicio"
                          type="time"
                          component={renderTextField}
                        />
                      </Grid>
                        <Grid item md={12} xs={12}>
                          <InputLabel>Hora fin</InputLabel>
                        <Field
                          error={Boolean(touched.HoraFin && errors.HoraFin)}
                          helperText={touched.HoraFin && errors.HoraFin}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.HoraFin}
                          name="HoraFin"
                          id="HoraFin"
                          type="time"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.DiasAnticipacion && errors.DiasAnticipacion
                          )}
                          helperText={
                            touched.DiasAnticipacion && errors.DiasAnticipacion
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.DiasAnticipacion}
                          label="Días Anticipación"
                          name="DiasAnticipacion"
                          id="DiasAnticipacion"
                          type="number"
                          component={renderTextField}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(
                            touched.TerminosCond && errors.TerminosCond
                          )}
                          helperText={
                            touched.TerminosCond && errors.TerminosCond
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.TerminosCond}
                          label="Términos y Condiciones"
                          name="TerminosCond"
                          id="TerminosCond"
                          component={renderTextField}
                        />
                        </Grid>
                      
                    </CardContent>

                    <Divider />
                    <CardHeader title="Imagen" />
                    <Divider />
                    <CardContent>
                      <div
                        className={clsx(classes.root, prop.className)}
                        {...prop.rest}
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
                                prop.data
                                  ? prop.data?.data().Imagen
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
                                Suelta los archivos aquí o haz clic {" "}
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
                {prop?.data ? (
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

ConjuntoCreateForm.propTypes = {
  className: PropTypes.string,
  fechavalidate: PropTypes.string,
};

export default ConjuntoCreateForm;
