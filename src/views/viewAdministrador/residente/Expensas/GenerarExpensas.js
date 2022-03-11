import React, { Fragment, useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import * as FirestoreService from "../services/firestore";
import { useSnackbar } from "notistack";
import { classes } from "istanbul-lib-coverage";
import useSettings from "../../../../contextapi/hooks/useSettings";
import EventIcon from '@material-ui/icons/Event';
import clsStyle from '../useStyles';
import { MessageOutlined } from "@material-ui/icons";
import axios from 'axios'
function GenerarExpensas() {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([false]);
  const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const meses = [{id: 0, name:"Enero"},
                {id: 1, name:"Febrero"},
                {id: 2, name:"Marzo"},
                {id: 3, name:"Abril"},
                {id: 4, name:"Mayo"},
                {id: 5, name:"Junio"},
                {id: 6, name:"Julio"},
                {id: 7, name:"Agosto"},
                {id: 8, name:"Septiembre"},
                {id: 9, name:"Octubre"},
                {id: 10, name:"Noviembre"},
                {id: 11, name:"Diciembre"}];
  const date = new Date();
  const [mesDesde, setMesDesde] = useState("");
  const [mesHasta, setMesHasta] = useState("");
  const [nombre, setNombre] = useState("");
  const [alicuota, setAlicuota] = useState("");
  const [casa, setCasa] = useState("");
  const [fechalim, setFechalim] = useState("");
  const [conjuntosmtp, setConjuntosmtp] = useState("");
  const [correo_env, setCorreo] = useState("");
  const [verMeses, setVerMeses] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  let mesesApagar = [];
  const [mesAlicuota, setMesAlicuota] = useState(new Date(date.getFullYear(),0,1));
  let nuevo = mesAlicuota.toDateString() == new Date(date.getFullYear(),0,1).toDateString();
  function handleClose() {
    setOpen(false);
  }

  function handleClickOpen() {
    setMesDesde("");
    setMesHasta("");
    setVerMeses(false);
    setShowMsg(false)
    mesesApagar = [];
    setSubmitionCompleted(false);
    setOpen(true);
  }
  function correo(){
    const nombre_dato = nombre.split(",");
    nombre_dato.pop();
    console.log(fechalim)
    console.log(nombre_dato)
    const alicuota_dato = alicuota.split(",");
    alicuota_dato.pop();
    console.log(alicuota_dato)
    const casa_dato = casa.split(",");
    casa_dato.pop();
    console.log(casa_dato)
    const correo_dato = correo_env.split(",");
    correo_dato.pop();
    console.log(correo_dato)
    console.log(mesDesde)
    console.log(mesHasta)
console.log(conjuntosmtp.Nombre)
    const body =
    {
      "nombre": nombre_dato,
      "mesDesde": mesDesde+1,
      "mesHasta": mesHasta+1,
      "conjunto": conjuntosmtp.Nombre,
      "alicuota": alicuota_dato,
      "casa": casa_dato,
      "administrador": conjuntosmtp.NombreContacto,
      "fecha":fechalim,
      "correo": correo_dato
  }
    
    axios.post('http://127.0.0.1:8000/correo/get-correo/',body)

  

  }

  function handleMesActual() {
    setVerMeses(false);
    if (mesAlicuota.getMonth()>=date.getMonth() && mesAlicuota.getFullYear()==date.getFullYear()){
      enqueueSnackbar("Las expensas hasta " + meses[mesAlicuota.getMonth()].name + " ya han sido generadas", {
        variant: "error",
      });
    } else {
      mesesApagar = [date.getMonth()];
      setMesHasta("");
      setShowMsg(true)
    }
  }
  const handleProximos = () => {
    if(mesAlicuota.getMonth()==11 && mesAlicuota.getFullYear()==date.getFullYear()){
      enqueueSnackbar("Las expensas hasta " + meses[mesAlicuota.getMonth()].name + " ya han sido generadas", {
        variant: "error",
      });
    } else {
      setVerMeses(!verMeses)
    }
  }

  React.useEffect(() => {

    try {
      FirestoreService.getUserByConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setUsuarios(Items);
          },
        },
        settings.idConjunto
      );
      FirestoreService.getConjunto(settings.idConjunto).then((doc) => {
        var conjunto = doc.data();
        setConjuntosmtp(conjunto)
        const lastAlicuota = new Date(conjunto.UltimoMesAlicuota?.seconds*1000)
        const mes = meses.find((arg)=>arg.id===lastAlicuota.getMonth())
        if(mes){
          setMesAlicuota(lastAlicuota)
        }
      });
      return ()=>{
        setMesAlicuota(new Date(date.getFullYear(),0,1))
      }
    } catch (e) { }
  }, [settings.idConjunto, open]);

  const handleMonth = (e) => {
    const {value, name} = e.target;
    if(name==="select-desde"){
      setMesDesde(value);
      setMesHasta("");
    } else {
      setMesHasta(value);
    }
    if(value===""){
      setMesDesde("");
      setMesHasta("");
    }
  }

  function rangoPago() {
    if(mesHasta){
      let prueba = meses.slice(mesDesde,mesHasta+1).map(mes => mes.id);
      mesesApagar = prueba;
    }
  }

  return (
    <React.Fragment>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <center>
          <EventIcon />
          <br />
          Generar expensas mensuales
        </center>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {!isSubmitionCompleted && (
          <React.Fragment>
            <DialogTitle id="form-dialog-title">Registro de expensas</DialogTitle>
            <DialogContent>
              <DialogContentText>Selecciona un mes:</DialogContentText>
              <Formik
                initialValues={{ FechaLimite: "" }}
                onSubmit={(values, { setSubmitting }) => {
                  rangoPago();
                  setSubmitting(true);
                  const dia = values.FechaLimite;
                  values.Descripcion = "Generación de alícuota mensual";
                  values.Rubro = "Ingresos ordinarios";
                  values.SubRubro = "Alícuota mensual";
                 let usuario_smtp = []
                 let casa_smtp = []
                 let correo_smtp = []
                 let alicuota_smtp = []
                  try {
                    if (mesesApagar.length > 1) {
                      mesesApagar.forEach((mesId, i) => {
                        
                        values.Nombre = "Alícuota Mes de " + meses[mesId].name;
                        values.FechaLimite = new Date(date.getFullYear(), mesId, dia,13);
                        setFechalim(dia)
                            
                        Promise.all(usuarios.map((usuario, j) => {
                          values.Valor = usuario.data().Alicuota;
                          values.NombreUsuario = usuario.data().Nombre + " " + usuario.data().Apellido;
                          values.CasaUsuario = usuario.data().Casa;
                          values.UsuarioId = usuario.id;
                          usuario_smtp = [values.NombreUsuario+","+usuario_smtp]
                          casa_smtp = [values.CasaUsuario+","+casa_smtp]
                          correo_smtp = [values.UsuarioId+","+correo_smtp]
                          alicuota_smtp = [values.Valor+","+alicuota_smtp]
                          
                          FirestoreService.newPagoPendiente(settings.idConjunto, values);
                          return true;
                        })).then(() => {
                          if (mesesApagar.length - 1 === i) {
                            let UltimoMesAlicuota = new Date(date.getFullYear(), mesId, dia,13);
                            FirestoreService.updateUltimaExpensaConjunto(settings.idConjunto, UltimoMesAlicuota);
                            enqueueSnackbar("Expensas hasta el mes de " + meses[mesId].name + " han sido generadas ", {
                              variant: "success",
                            });
                            setSubmitting(false);
                            handleClose();
                            setNombre(nombre+usuario_smtp);
                            setAlicuota(alicuota+alicuota_smtp);
                            setCasa(casa+casa_smtp)
                            setCorreo(correo_env+correo_smtp)
                            
                          }
                        }
                        );
                       
                      }
                      
                      )
                    } else {
                      values.Nombre = "Alícuota Mes de " + meses[date.getMonth()].name;
                      
                      values.FechaLimite = new Date(date.getFullYear(),date.getMonth(),dia,13);
                      setFechalim(dia)
                        Promise.all(usuarios.map((usuario) => {
                          values.Valor = Number(usuario.data().Alicuota);
                          values.NombreUsuario = usuario.data().Nombre +" "+ usuario.data().Apellido;
                          values.CasaUsuario = usuario.data().Casa;
                          values.UsuarioId = usuario.id;
                          usuario_smtp = [values.NombreUsuario+","+usuario_smtp]
                          casa_smtp = [values.CasaUsuario+","+casa_smtp]
                          correo_smtp = [values.UsuarioId+","+correo_smtp]
                          alicuota_smtp = [values.Valor+","+alicuota_smtp]
                          FirestoreService.newPagoPendiente(settings.idConjunto, values);
                          return true; 
                        })).then(() => {
                          let UltimoMesAlicuota = new Date(date.getFullYear(),date.getMonth(),dia,13)
                          FirestoreService.updateUltimaExpensaConjunto(settings.idConjunto, UltimoMesAlicuota);
                          enqueueSnackbar("Expensa del mes de " + meses[date.getMonth()].name + " ha sido generada ", {
                            variant: "success",
                          });
                          setSubmitting(false);
                          handleClose();
                          setNombre(nombre+usuario_smtp);
                          setAlicuota(alicuota+alicuota_smtp);
                          setCasa(casa+casa_smtp)
                          setCorreo(correo_env+correo_smtp)
                      } 
                    );
                    }

                  } catch (err) {
                    console.log(err)
                    enqueueSnackbar("Fallo al generar expensas mensuales", {
                      variant: "error",
                    });
                    setSubmitting(false);
                    handleClose();
                  }
                }}
                validationSchema={Yup.object().shape({
                  FechaLimite: Yup.number().min(1, "el valor minimo es 1")
                  .max(31,"el valor máximo es 31")
                  .required("¡Se requiere rellenar este campo!")
                  
                })}
              >
                {props => {
                  const {
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset
                  } = props;
                  return (
                    <form onSubmit={handleSubmit} >
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={5}>
                            <Button variant="outlined" color="primary" onClick={handleMesActual}>
                              Mes Actual
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                        <Button variant="outlined" color="primary" onClick={handleProximos}>
                              Próximos Meses
                            </Button>
                        </Grid>
                          {verMeses ? (
                            <Fragment>
                            <Grid item xs={12} sm={5}>
                              <FormControl variant="outlined" style={{ width: "100%" }}>
                                <InputLabel id="filter-month-select-label">Desde</InputLabel>
                                <Select
                                  labelId="filter-month-select-label"
                                  id="filter-month-select"
                                  name="select-desde"
                                  value={mesDesde}
                                  onChange={(e) => handleMonth(e)}
                                  label="filtar"
                                >
                                  <MenuItem value={""}>seleccionar mes</MenuItem>
                                  {nuevo ? (meses.map((mes, i) => {
                                      return <MenuItem key={i} value={mes.id}>{mes.name}</MenuItem>
                                    }))
                                  : (meses.slice(mesAlicuota.getMonth()===11?0:mesAlicuota.getMonth()+1)
                                      .map((mes, i) => (
                                        <MenuItem key={i} value={mes.id}>{mes.name}</MenuItem>
                                  )))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              {mesDesde !== "" ? (
                                <FormControl variant="outlined" style={{ width: "100%" }}>
                                  <InputLabel id="filter-month-select-label">Hasta</InputLabel>
                                  <Select
                                    labelId="filter-month-select-label"
                                    id="filter-month-select"
                                    name="select-hasta"
                                    value={mesHasta}
                                    onChange={(e) => handleMonth(e)}
                                    label="filtar"
                                  >
                                    <MenuItem value={""}>seleccionar mes</MenuItem>
                                    {meses.slice(mesDesde + 1).map((mes, index) => (
                                      <MenuItem key={index} value={mes.id}>{mes.name}</MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              ) : ""}
                            </Grid>
                            </Fragment>
                          ):(showMsg ? (<DialogContentText style={{paddingLeft: '10px'}}>Se van a generar Expensas para el mes de {meses[date.getMonth()].name}</DialogContentText>):null)}
                        <Grid item xs={12} lg={12}>
                          <TextField
                            error={errors.FechaLimite && touched.FechaLimite}
                            label="Días de espera"
                            name="FechaLimite"
                            placeholder="Ingresa el número de días de espera para el pago"
                            fullWidth
                            variant="outlined"
                            type="number"
                            className={classes.margin}
                            value={values.FechaLimite}
                            onChange={(e)=>{handleChange(e)}}
                            onBlur={handleBlur}
                            helperText={errors.FechaLimite && touched.FechaLimite && errors.FechaLimite}
                          />
                        </Grid>
                      </Grid>
                      <DialogActions>
                        <Button
                          type="button"
                          color ="primary"
                          className="outline"
                          onClick={handleReset}
                         
                          disabled={!dirty || isSubmitting}
                        >
                          Limpiar
                        </Button>
                        <Button type="submit"
                         color ="primary"
                         onClick={()=>correo()}
                         disabled={isSubmitting}>
                          
                          Crear Expensas
                        </Button>
                      </DialogActions>
                    </form>
                  );
                }}
              </Formik>
            </DialogContent>
          </React.Fragment>
        )}
      </Dialog>
    </React.Fragment>
  );
}

export default GenerarExpensas;