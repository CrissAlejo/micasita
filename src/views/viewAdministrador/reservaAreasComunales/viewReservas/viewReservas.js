import React, {Fragment, useState, useEffect} from 'react'
import { useParams } from "react-router-dom";
import { Scheduler } from "@aldabil/react-scheduler";
import { es } from "date-fns/locale";
import useSettings from "../../../../contextapi/hooks/useSettings";
import LoadingData from "../../../../components/Common/LoadingData";
import NoInfo from "../../../../components/Common/NoInfo";
import useStyles from '../useStyle';
import * as FirestoreService from '../services/firestore'
import { addHours } from 'date-fns';
import {Card, CardContent, CardActions, Typography, Paper } from '@material-ui/core'
import getDay from 'date-fns/getDay';
import {Button} from '@material-ui/core';
var ServidorFCM = require('node-gcm');
const ViewReservas = () => {
    const { threadKey } = useParams();
    const { settings } = useSettings();
    const classes = useStyles();
    const [area, setArea] = useState({});
    const [reservas, setReservas] = useState([]);
    const [usu, setUsu] = useState([]);
    const [usuariosC, setUsuariosC] = useState([]);
    const [loading, setLoading] = useState(false);
    const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    function rechazar(usuarioID,reservaID){
        console.log(reservaID);
        var token = usuarioID.split(',');
        console.log(token);  
         var sender = new ServidorFCM.Sender ('AAAAQSgq8kc:APA91bHQmE-lNIrpVPsKXddyaxl4TVnNg-G0zlR8mAB9eKMqpdUZYE7Mi043WJWEXEU_DIydiFgy6jv0VqnmZlJZ8WBBhFKL_2NbYKlQ9QtSuJ4W6QtOMNEBix4SENU-rw6xTMx2VOKC');
         var message = new ServidorFCM.Message({
             notification: {
                 title: "Reserva de áreas comunales",
                 body: "Su reserva ha sido rechazada comuníquese con el administrador"
             },
             data: {
                 your_custom_data_key: 'your_custom_data_value'
             }
         });
         sender.send(message, {registrationTokens: token}, function(err, response)
         {
             if (err) console.error(err);
             else console.log(response);
         });
    }

function aprobar(usuarioID){
   var token = usuarioID.split(',');
   console.log(token);  
    var sender = new ServidorFCM.Sender ('AAAAQSgq8kc:APA91bHQmE-lNIrpVPsKXddyaxl4TVnNg-G0zlR8mAB9eKMqpdUZYE7Mi043WJWEXEU_DIydiFgy6jv0VqnmZlJZ8WBBhFKL_2NbYKlQ9QtSuJ4W6QtOMNEBix4SENU-rw6xTMx2VOKC');
    var message = new ServidorFCM.Message({
        notification: {
            title: "Reserva de áreas comunales",
            body: "Su reserva ha sido aprobada exitosamente!"
        },
        data: {
            your_custom_data_key: 'your_custom_data_value'
        }
    });
    sender.send(message, {registrationTokens: token}, function(err, response)
    {
        if (err) console.error(err);
        else console.log(response);
    });


    }
    useEffect(() => {
        try {
            FirestoreService.getAreaById(settings.idConjunto, threadKey, {
            next: (querySnapshot) => {
                setArea(querySnapshot.data());
            }
            })
            FirestoreService.getUserByConjunto(settings.idConjunto, {
                next: (querySnapshot) => {
                  const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
                  setUsuariosC(Items);
                },
            });
            FirestoreService.getHoras(settings.idConjunto, threadKey, {
                next: (querySnapshot) => {
                    const Items = querySnapshot.docs.map(
                        (docSnapshot) => docSnapshot.data()
                    );
                    setReservas(Items);
                    setLoading(true);
                },
            })
        } catch (e) { }
    }, [settings.idConjunto]);
    useEffect(() => {
        userList(reservas)
    }, [reservas,settings.idConjunto])
    function userList(reservas){
        if(reservas.length>0){
            let usu= [];
            
            reservas.sort((a,b)=> new Date(a.time) - new Date(b.time)).forEach(r => {
                let p= 0;
                let id = '';
                let user ='';
                let token = '';
                let date = new Date(r.time);
                JSON.parse(r.usuario).forEach(u=> {
                    if(user===u.usuario){
                        p += u.personas 
                    } else {
                        user= u.usuario
                        p = u.personas    
                    }
                })
                user = usuariosC.filter(usr => usr.data().Correo === user)
                token = usuariosC.filter(usr => usr.data().Correo === user)
                token = user.length>0?`${user[0].data().tokens}`:"Error"
                id = usuariosC.filter(usr => usr.data().Correo === user)
                id = id.length>0?`${id[0].id}`:"Error"
                user = user.length>0?`${user[0].data().Nombre} ${user[0].data().Apellido} - ${user[0].data().Casa}`:"Administración"
                usu.push({'token': token, 'id': id, 'usuario': user,'personas': p, 'fecha':addHours(date, 5).toLocaleString("en-CA")});
            })
            setUsu(usu)
            return;
        }
        setUsu(false)
    }
    function dayLbl(date) {
        let d = new Date(date.substr(0,20))
        d = getDay(d);
        return weekDays[d];
    }

    return (
        <Fragment>
        {!loading ? (
          <LoadingData/>
        ):(
          <Paper className={classes.root}>
          {usu ? usu.map((u, i) => (
            <Card key={i} className={classes.container}>
              {/* <CardActionArea> */}
                <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {u.usuario}
                </Typography>
                <Typography variant="body2" component="p">
                    Áforo: {u.personas}
                </Typography>
                <Typography variant="body2" component="p">
                    Fecha: {dayLbl(u.fecha)}, {u.fecha}
                </Typography>

                <Typography>
                <Button onClick={()=>aprobar(u.token)} color="primary">
                    Aprobar
                </Button>
                <Button onClick={()=>rechazar(u.token, u.id)} color="primary">
                    Rechazar
                </Button>
                </Typography>

                </CardContent>
              {/* </CardActionArea> */}
              <CardActions>
              </CardActions>
            </Card>
          )) : (
            <NoInfo/>
          )}
        </Paper>
        )}
        </Fragment>
    )
}

export default ViewReservas

{/* <Scheduler
    style={{backgroundColor:'#0000ff00',zIndex:2}} <--->para el div superior
        view="week"
        locale={es}
        events={EVENTS}
        selectedDate={new Date()}
        editable='false'
        week={{
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 1,
            startHour: area.HoraInicio.split(':')[0]*1,
            endHour: area.HoraFin.split(':')[0]*1,
            step: 60
        }}
    /> */}
