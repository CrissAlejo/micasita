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
  ButtonGroup,
} from "@material-ui/core";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import useAuth from "../../../../contextapi/hooks/useAuth";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';


const Swal = require("sweetalert2");

const useStyles = makeStyles(() => ({
  root: {
    alignItems: "center",
    alignContent: "center",
    margin: 5,
  },
  editor: {
    "& .ql-editor": {
      height: 160,
    },
  },
  border: {
    border: "1px solid rgba(0, 1, 0, 0.2)",
  },
  estadook: {
    backgroundColor: "#95D890",
    height: "100%",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    alignSelf: "center",
  },
  estadoerror: {
    backgroundColor: "red",
    height: "100%",
    width: "100%",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    alignSelf: "center",
  },
}));

const CreateForm = ({ className, send, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [usuarios, setUsuarios] = React.useState([])
  const [cedulaCamara, setCedulaCamara] = React.useState({});
  const [visitaAnticipada, setVisitaAnticipada] = React.useState({});
  const tiposVisita = [
    { id: "visita", Nombre: "Visita" },
    { id: "empleado", Nombre: "Empleado" },
    { id: "servicioEntregas", Nombre: "Servicio de entregas" },
    { id: "servicioTaxis", Nombre: "Servicio de taxi" },
    { id: "residente", Nombre: "Residente" },
    { id: "otroTipoVisita", Nombre: "Otro" },
  ];
  const tiemposEstimadosVisita = [
    { id: "5min", Valor: 0.08, Nombre: "5 minutos" },
    { id: "15min", Valor: 0.25, Nombre: "15 minutos" },
    { id: "30min", Valor: 0.5, Nombre: "30 minutos" },
    { id: "1h", Valor: 1, Nombre: "1 hora" },
    { id: "2h", Valor: 2, Nombre: "2 horas" },
  ];
  const otros = [{ id: "Otro" }];
  const [tipoEntrada, setTipoEntrada] = React.useState(-1);
  const urlRequest = "https://micasitabackend.herokuapp.com/";
  //const urlRequest = "http://127.0.0.1:8000/";


  const getDatosCamara = () => {
    setLoading(true);
    const id_conjunto = user.ConjuntoUidResidencia;
    axios.post(urlRequest+'document_reader/',{id_conjunto,tipoEntrada}).then((res) =>{
      if (res.data.numero_cedula !== '') {
        setCedulaCamara(res.data);
        getVisitaAnticipada(res.data.numero_cedula);
        setLoading(false);
      }
      else{
        enqueueSnackbar(
            "No se reconoció ningún documento",
            {
              variant: "error",
            }
        );
        setLoading(false);
      }
    }).then(
        () =>{
          setCedulaCamara({})
          console.log(cedulaCamara)
        }
    ).catch((err) => {
      enqueueSnackbar(
          "Ocurrió un error inesperado, intentalo de nuevo más tarde",
          {
            variant: "error",
          }
      );
      setLoading(false);
    });
  }

  function registrarEntrada(params, resetForm){
    setLoading(true);
    return axios.post(urlRequest+'api/bitacora_digital/'+user.ConjuntoUidResidencia+'/',params).then((res) =>{
      if (res.status ===200){
        console.log(res.data)
        Swal.fire(
            '¡Error en el registro!',
            'No se ha registrado una última salida para este usuario',
            'error',
        )
        setLoading(false)
      }
      else if (res.status === 201){
        cleanForm()
        enqueueSnackbar(
            "Registro ingresado con éxito",
            {
              variant: "success",
            }
        );

        setLoading(false);
        resetForm();
        setTipoEntrada(-1);
      }
    }).catch((err) => {
      enqueueSnackbar(
          "Ocurrió un error inesperado, intentalo de nuevo más tarde",
          {
            variant: "error",
          }
      );
      setLoading(false);
    });
  }

  function cleanForm() {
    setVisitaAnticipada({});
    setCedulaCamara({});
  }

  function getVisitaAnticipada(Cedula) {
    if (Cedula !== "") {
      FirestoreService.getVisitaAnticipada(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setVisitaAnticipada(Items);
          },
        },
        user.ConjuntoUidResidencia,
        Cedula
      );
    }
  }

  React.useEffect(() => {
    try {
      FirestoreService.getUsuariosByConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            if (Items !== null) {
              setUsuarios(Items.concat(otros));
            }
          },
        },
        user.ConjuntoUidResidencia
      );
    } catch (e) {}
  }, [user.ConjuntoUidResidencia]);

  const getUsuario = (DestinoId) =>{
    if(DestinoId!=='Otro'){
      return FirestoreService.getUser(DestinoId)
    }else{
      return Promise.resolve()
    }
  }
  return (
    <Formik
      initialValues={{
        Nombre: "",
        Apellido: "",
        Cedula: "",
        PlacaVehiculo: "",
        ColorVehiculo: "",
        DestinoId: "",
        LugarDestinoOtro: "",
        TipoVisita: "",
        TipoVisitaOtro: "",
        TiempoEstimadoSalida: "",
        NombreDestino: "",
        ApellidoDestino: "",
        CasaDestino: "",
      }}
      validationSchema={Yup.object().shape({
        Nombre: Yup.string().required("¡Nombre es requerido!"),
        Apellido: Yup.string().required("Apellido es requerido!"),
        Cedula: Yup.string()
          .required("¡Se requiere rellenar este campo!")
          .matches(/^\d*\.?\d*$/gm, "¡Solo se admiten números!"),
        PlacaVehiculo: Yup.string(),
        ColorVehiculo: Yup.string(),
        DestinoId: Yup.string().required(
          "¡Se requiere seleccionar este campo!"
        ),
        TipoVisita: Yup.string().required(
          "¡Se requiere seleccionar este campo!"
        ),
      })}
      onSubmit={ async (
        values,
        {resetForm}
       ) => {
        console.log(values)
        getUsuario(values.DestinoId).then((doc)=>{
          const params = new URLSearchParams({
            tipo_entrada: tipoEntrada,
            nombre_persona_ingreso: values.Nombre,
            apellido_persona_ingreso: values.Apellido,
            cedula_persona_ingreso: values.Cedula,
            placa_vehiculo_ingreso: values.PlacaVehiculo,
            color_vehiculo_ingreso: values.ColorVehiculo,
            nombre_destino: values.DestinoId !== 'Otro' ? doc.data().Nombre: '',
            apellido_destino: values.DestinoId !== 'Otro' ? doc.data().Apellido: '',
            casa_destino: values.DestinoId !== 'Otro' ? doc.data().Casa: values.LugarDestinoOtro,
            id_destino: values.DestinoId !== 'Otro'? values.DestinoId: '',
            id_conjunto: user.ConjuntoUidResidencia,
            tipo_visita: values.TipoVisita !== 'Otro'? values.TipoVisita: values.TipoVisitaOtro,
            tiempo_estimado_salida: values.TiempoEstimadoSalida!=='' && values.TiempoEstimadoSalida!=='Sin Tiempo'? values.TiempoEstimadoSalida: '',
          });
          registrarEntrada(params, resetForm);
        }
        )}
      }
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        resetForm,
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
              <Grid container spacing={2}>
                <Grid container item xs={12} spacing={3}>
                  <Grid item xs={12}>
                    <center>
                      <h2>Registro de entradas</h2>
                      {tipoEntrada === -1? (<p>Selecciona el tipo de ingreso</p>):null}
                      <Grid item xs={12}>
                        <ButtonGroup
                          disableElevation
                          variant="outlined"
                          color="primary"
                        >
                          <Button
                            color={tipoEntrada === 1 ? "secondary" : "primary"}
                            variant={
                              tipoEntrada === 1 ? "contained" : "outlined"
                            }
                            onClick={() => {setTipoEntrada(1); setVisitaAnticipada({});
                              setCedulaCamara({});values.Cedula = ''; values.Apellido = ''; values.Nombre =''}}
                          >
                            <center>
                            <DirectionsWalkIcon/>
                            <br/>
                            Entrada Peatonal
                            </center>
                          </Button>
                          <Button
                            color={tipoEntrada === 2 ? "secondary" : "primary"}
                            variant={
                              tipoEntrada === 2 ? "contained" : "outlined"
                            }
                            onClick={() => {setTipoEntrada(2); setVisitaAnticipada({});
                              setCedulaCamara({});values.Cedula = ''; values.Apellido = ''; values.Nombre =''}}
                          >
                            <center>
                            <DirectionsCarIcon/>
                            <br/>
                            Entrada Vehícular
                            </center>
                          </Button>
                        </ButtonGroup>
                      </Grid>
                      <h4 className={classes.estadook}>
                        {visitaAnticipada[0] !== undefined
                          ? "Se encontró una visita anticipada para este usuario"
                          : null}
                      </h4>
                    </center>
                  </Grid>
                </Grid>
                {tipoEntrada === -1 ? null : (
                  <Fragment>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={12} lg={3}>
                        <TextField
                          error={errors.Cedula && touched.Cedula}
                          label="Número de Cédula"
                          name="Cedula"
                          variant="outlined"
                          fullWidth
                          placeholder="Número de cédula"
                          value={
                            cedulaCamara.numero_cedula !== undefined &&
                            cedulaCamara.numero_cedula !== ""
                              ? (values.Cedula) = cedulaCamara.numero_cedula
                              : values.Cedula || ""
                          }
                          onChange={handleChange}
                          onBlur={() => {
                            getVisitaAnticipada(values.Cedula.toString());
                          }}
                          helperText={
                            errors.Cedula && touched.Cedula && errors.Cedula
                          }
                        />
                      </Grid>
                      <Grid item xs={12} lg={3}>
                        <TextField
                          error={errors.Nombre && touched.Nombre}
                          label="Nombre"
                          name="Nombre"
                          placeholder="Nombre"
                          variant="outlined"
                          fullWidth={true}
                          value={
                            (visitaAnticipada[0] != undefined
                              ? (values.Nombre = visitaAnticipada[0].data().Nombre)
                              : values.Nombre) ||
                            (cedulaCamara.nombre != undefined &&
                            cedulaCamara.nombre != ""
                              ? (values.Nombre = cedulaCamara.nombre)
                              : values.Nombre)
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={
                            errors.Nombre && touched.Nombre && errors.Nombre
                          }
                        />
                      </Grid>
                      <Grid item xs={12} lg={3}>
                        <TextField
                          error={errors.Apellido && touched.Apellido}
                          label="Apellido"
                          name="Apellido"
                          placeholder="Apellido"
                          variant="outlined"
                          fullWidth={true}
                          value={
                            (visitaAnticipada[0] !== undefined
                              ? (values.Apellido = visitaAnticipada[0].data().Apellido)
                              : values.Apellido) ||
                            (cedulaCamara.apellido != undefined &&
                            cedulaCamara.apellido != ""
                              ? (values.Apellido = cedulaCamara.apellido)
                              : values.Apellido)
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={
                            errors.Apellido &&
                            touched.Apellido &&
                            errors.Apellido
                          }
                        />
                      </Grid>
                      <Grid item xs={12} lg={3}>
                        <Button
                          color="primary"
                          name = "fotos"
                          onClick={() => getDatosCamara()}
                          disabled={loading}
                          fullWidth
                          variant="contained"
                        >
                          <CameraAltIcon /> Leer datos de cámara
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={12} lg={6}>
                        <Autocomplete
                          options={usuarios}
                          name="DestinoId"
                          getOptionLabel={
                            option => option.id !== "Otro" ? option.data().Casa + " -> " + option.data().Nombre +
                               " "+option.data().Apellido : option.id
                          }
                          onChange={(event, newValue) => {
                            console.log(newValue.id)
                             values.DestinoId = newValue.id
                          }}
                          renderOption={(option) => (
                            <React.Fragment>
                              {option.id !== "Otro" ? (
                                <>
                                {option.data().Casa + " -> " + option.data().Nombre + " "+option.data().Apellido}
                                </>
                              ) : (
                                  <>
                                    Otro
                                  </>
                              )}
                            </React.Fragment>
                          )}
                          fullWidth={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              value={
                                visitaAnticipada[0] !== undefined
                                    ? (values.DestinoId = visitaAnticipada[0].data().DestinoId)
                                    : values.DestinoId
                              }
                              label="Lugar al que se dirige"
                              error={errors.DestinoId && touched.DestinoId}
                              helperText={
                                errors.DestinoId &&
                                touched.DestinoId &&
                                errors.DestinoId
                              }
                            />
                          )}
                          //onBlur={handleBlur}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        {values.DestinoId === "Otro" ? (
                          <Grid item xs={12} lg={6}>
                            <TextField
                              error={
                                errors.LugarDestinoOtro &&
                                touched.LugarDestinoOtro
                              }
                              label="Escriba el lugar al que se dirige"
                              name="LugarDestinoOtro"
                              placeholder="Agrega un lugar de destino"
                              variant="outlined"
                              fullWidth={true}
                              className={classes.margin}
                              value={values.LugarDestinoOtro}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.LugarDestinoOtro &&
                                touched.LugarDestinoOtro &&
                                errors.LugarDestinoOtro
                              }
                            />
                          </Grid>
                        ) : null}
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={12} lg={6}>
                        <TextField
                          error={errors.TipoVisita && touched.TipoVisita}
                          label="Tipo visita"
                          name="TipoVisita"
                          placeholder="Selecciona el tipo de visita"
                          variant="outlined"
                          fullWidth={true}
                          select
                          SelectProps={{ native: true }}
                          value={
                            visitaAnticipada[0] !== undefined
                              ? (values.TipoVisita = visitaAnticipada[0].data().TipoVisita)
                              : values.TipoVisita
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={
                            errors.TipoVisita &&
                            touched.TipoVisita &&
                            errors.TipoVisita
                          }
                        >
                          <option key={null} value={""}></option>
                          {tiposVisita.map((tipoVisita) => (
                            <option
                              key={tipoVisita.id}
                              value={tipoVisita.Nombre}
                            >
                              {tipoVisita.Nombre}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        {values.TipoVisita == "Otro" ? (
                          <Grid item xs={12} lg={6}>
                            <TextField
                              error={
                                errors.TipoVisitaOtro && touched.TipoVisitaOtro
                              }
                              label="Escriba el tipo de visita"
                              name="TipoVisitaOtro"
                              placeholder="Agrega una descripción para el tipo de visita"
                              variant="outlined"
                              fullWidth={true}
                              className={classes.margin}
                              value={values.TipoVisitaOtro}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              helperText={
                                errors.TipoVisitaOtro &&
                                touched.TipoVisitaOtro &&
                                errors.TipoVisitaOtro
                              }
                            />
                          </Grid>
                        ) : null}
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          error={
                            errors.TiempoEstimadoSalida &&
                            touched.TiempoEstimadoSalida
                          }
                          label="Tiempo estimado de salida"
                          name="TiempoEstimadoSalida"
                          placeholder="Selecciona el tiempo estimado de salida"
                          variant="outlined"
                          fullWidth={true}
                          select
                          SelectProps={{ native: true }}
                          value={
                            visitaAnticipada[0] !== undefined
                              ? (values.TiempoEstimadoSalida = visitaAnticipada[0].data().TiempoEstimadoSalida)
                              : values.TiempoEstimadoSalida
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          helperText={
                            errors.TiempoEstimadoSalida &&
                            touched.TiempoEstimadoSalida &&
                            errors.TiempoEstimadoSalida
                          }
                        >
                          <option value={""}>
                            {""}
                          </option>
                          {tiemposEstimadosVisita.map(
                            (tiempoEstimadoSalida) => (
                              <option
                                key={tiempoEstimadoSalida.id}
                                value={tiempoEstimadoSalida.Valor}
                              >
                                {tiempoEstimadoSalida.Nombre}
                              </option>
                            )
                          )}
                          <option key={null} value={null}>
                            {"Sin Tiempo"}
                          </option>
                        </TextField>
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={2}/>
                    {tipoEntrada === 2 ? (
                      <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12} lg={6}>
                          <TextField
                            error={
                              errors.PlacaVehiculo && touched.PlacaVehiculo
                            }
                            label="Número de Placa"
                            name="PlacaVehiculo"
                            variant="outlined"
                            placeholder="Número de placa"
                            fullWidth
                            value={
                              (visitaAnticipada[0] !== undefined
                                  ? (values.PlacaVehiculo = visitaAnticipada[0].data().PlacaVehiculo)
                                  : values.PlacaVehiculo)
                              // (visitaAnticipada[0] !== undefined
                              // ? (values.PlacaVehiculo = visitaAnticipada[0].data().PlacaVehiculo)
                              // : values.PlacaVehiculo) ||
                              // (cedulaCamara.placa != undefined &&
                              // cedulaCamara.placa != ""
                              // ? (values.PlacaVehiculo = cedulaCamara.placa)
                              // : values.PlacaVehiculo)
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <TextField
                            error={
                              errors.ColorVehiculo && touched.ColorVehiculo
                            }
                            label="Color del vehículo"
                            name="ColorVehiculo"
                            variant="outlined"
                            placeholder="Color del vehículo"
                            fullWidth
                            value={
                              visitaAnticipada[0] !== undefined
                                ? (values.ColorVehiculo = visitaAnticipada[0].data().ColorVehiculo)
                                : values.ColorVehiculo
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Grid>
                      </Grid>
                    ) : null}
                    <Grid
                      container
                      space={2}
                      item
                      xs={12}
                      className={classes.root}
                    >
                      <Grid container item xs={12} spacing={2}>
                        <Grid item xs={12}>
                          <Button
                            color="primary"
                            disabled={loading}
                            fullWidth
                            size="large"
                            variant="contained"
                            onClick={() => {resetForm();values.Cedula = ''; values.Apellido = ''; values.Nombre =''}}
                          >
                            <DeleteIcon /> Limpiar
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
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
                        </Grid>
                      </Grid>
                    </Grid>
                  </Fragment>
                )}
              </Grid>
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
