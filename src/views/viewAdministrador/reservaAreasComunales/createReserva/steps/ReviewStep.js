import React, { useState, useEffect } from "react";
import * as FirestoreService from '../../services/firestore';
import {
  Grid,
  Button,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from "@material-ui/core";
import { getYear, getMonth, getDate, getHours, addHours } from 'date-fns'
import { Fragment } from "react";

function horasLbl(hora){
    let date = new Date(0)
    let seconds = hora * 3600
    date.setSeconds(seconds)
    date= getHours(addHours(date, 5))
    return `${date}:00 - ${date+1}:00`
}

const Review = props => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { FechaResv, HorasResv, Personas, usuario } = props.values
  let fecha = new Date(getYear(FechaResv),getMonth(FechaResv),getDate(FechaResv));
  fecha = fecha.toLocaleDateString('en-CA')
  const [usu, setUsu] = useState([]);
  const admin = usuario.split(':')[1];
  props.values.Admin = admin? true : false;

  useEffect(() => {
    if(admin===undefined){
        try {
            FirestoreService.getUserByMail(usuario, {
              next: (querySnapshot) => {
                const Items = querySnapshot.docs[0].data()
                setUsu(Items)
              },
            });
        } catch (e) { }
    }
}, [usuario]);

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    props.handleSubmit();
    setSubmitting(false);
  };
  
  return (
    <React.Fragment>
        <Card>
            <CardHeader title="Detalles de la Reserva" />
            <Divider />
            <CardContent>
                <Grid container>
                    <Grid item xs={12} md={4}>
                        <Typography><b>Reserva para:</b><br />{admin? 'Administración': `${usu.Nombre} ${usu.Apellido} / UH-${usu.Casa}`}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography><b>Fecha de la Reserva:</b><br />{fecha}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        {HorasResv.map((hora, index) => {
                            return (
                                <Fragment key={index}>
                                    <Typography><b>Hora de la Reserva:</b><br />{horasLbl(hora)}</Typography>
                                    <Typography><b>Aforo:</b><br />{Personas[index]}</Typography>
                                </Fragment>
                            )
                        })}
                    </Grid>
                </Grid>
            </CardContent>
            <Grid container direction="row" justifyContent="space-between" style={{padding: '20px'}}>
                <Grid item>
                    <Button
                        disabled={isSubmitting}
                        onClick={e => props.back(e, props.values)}
                    >
                        Atrás
                    </Button>
                </Grid>
                <Grid item>
                    <Button disabled={isSubmitting} onClick={e => handleSubmit(e)}>
                        Reservar
                    </Button>
                </Grid>
            </Grid>
        </Card>
    </React.Fragment>
  );
};

export default Review;
