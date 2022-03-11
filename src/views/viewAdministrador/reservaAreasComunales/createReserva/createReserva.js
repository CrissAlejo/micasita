import React, { Fragment, useState, useEffect } from 'react';
import * as FirestoreService from '../services/firestore';
import useSettings from "../../../../contextapi/hooks/useSettings";
import { useParams, useHistory } from "react-router-dom";
import { useSnackbar } from 'notistack';
import useStyles from './useStyles';
import Header from "./Header";
import FechaStep from "./steps/FechaStep";
import UsuarioStep from './steps/UsuarioStep';
import AforoStep from './steps/AforoStep';
import Review from './steps/ReviewStep';
import {subHours, setHours} from 'date-fns';
import { Stepper, Step, StepLabel, Typography, Grid, } from '@material-ui/core';
import moment from 'moment'

const steps = ['Fecha', 'Usuario', 'Aforo', 'Detalle'];

function _renderStepContent(step, formState, next, back, handleSubmit) {
  switch (step) {
    case 0:
      return <FechaStep values={formState} next={next}/>;
    case 1:
      return <UsuarioStep values={formState} next={next} back={back}/>;
    case 2:
      return <AforoStep values={formState} next={next} back={back}/>;
    case 3:
      return <Review values={formState} back={back} handleSubmit={handleSubmit}/>;
    default:
      return <div>Not Found</div>;
  }
}

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

function formatDate({FechaResv, HorasResv}) {
  const fechas = HorasResv.map(hora => {
    let date = setHours(FechaResv, hora)
    return date
  })
  return fechas
}
function formatUser({usuario, Personas, area}) {
  let arr = [];
  Personas.forEach(p => {
    let data = {'usuario': usuario, 'personas': p*1, status: 0}
    if(!area.RequiereAprobacion) data.status = 1
    arr.push(data)
  })
  return arr;
}
function doSubmit(values, reservas, idConj, idArea, area){
  const FechaResv = formatDate(values)
  const UserResv = formatUser({...values, area})
  FechaResv.forEach((date, index) => {
    const prevRes = reservas.find(resv => {const t= new Date(resv.data().time).toString(); return t === date.toString()})
    console.log(prevRes?.data(),date.toString())
    if(prevRes){
      let usr = JSON.parse(prevRes.data().usuario)
      let usrInd = usr.findIndex(curUsr => curUsr.usuario == UserResv[index].usuario)
      if(usrInd != -1){
        usr[usrInd].personas += UserResv[index].personas
        usr[usrInd].status = UserResv[index].status
      }else{
        usr.push(UserResv[index])
      }
      let afr = prevRes.data().aforo + UserResv[index].personas
      let reserva = {
        'time': moment(date).format('YYYY-MM-DD HH:mm'),
        'aforo': afr,
        'usuario': JSON.stringify(usr),
      }
      FirestoreService.updateresv(idConj,idArea,prevRes.id, reserva)
    } else {
      let usr = [UserResv[index]];
      let reserva = {
        'time': moment(date).format('YYYY-MM-DD HH:mm'),
        'aforo': usr[0].personas,
        'usuario': JSON.stringify(usr)
      }
      FirestoreService.newresv(idConj,idArea,reserva)
    }
  })
}

const CrearReserva = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { threadKey } = useParams();
  const { settings } = useSettings();
  const classes = useStyles();
  const history = useHistory();
  const [formState, setFormState] = useState({});
  const [area, setArea] = useState({});
  const [reservas, setReservas] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    FirestoreService.getAreaById(settings.idConjunto, threadKey, {
      next: (querySnapshot) => {
        setArea(querySnapshot.data());
      }
    })
    FirestoreService.getHoras(settings.idConjunto, threadKey, {
      next: (querySnapshot) => {
          const updatedGroceryItems = querySnapshot.docs.map(
              (docSnapshot) => docSnapshot
          );
          setReservas(updatedGroceryItems);
      },
  })
  }, [settings.idConjunto]);

  const next = (values) => {
    setFormState(function (prevState) {
      return _extends({}, prevState, values);
    });

    setActiveStep(activeStep + 1);
  };

  const back = (e, values) => {
    e.preventDefault();
    setFormState(function (prevState) {
      return _extends({}, prevState, values);
    });
    return setActiveStep(activeStep - 1);
  };
  const handleSubmit = () => {
      //Guardar en la BD
      doSubmit(formState, reservas, settings.idConjunto, threadKey, area);
      enqueueSnackbar("Reserva registrada", {
        variant: "success",
      });
      let path = "/administrador/reservasxaprobar";
      history.push(path);
  };
  
  return (
    <Fragment>
      <Header area={area.Nombre}/>
      <Typography component="h1" variant="h4" align="center">
        Área: {area.Nombre}
      </Typography>
      <Stepper activeStep={activeStep} className={classes.stepper}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Grid container direction='column'>
        {_renderStepContent(activeStep, formState, next, back, handleSubmit)}
      </Grid>
    </Fragment>
  );
}

export default CrearReserva;
