import React, { Fragment, useState, useEffect } from "react";
import * as FirestoreService from '../../services/firestore';
import useSettings from "../../../../../contextapi/hooks/useSettings";
import LoadingData from "../../../../../components/Common/LoadingData";
import { useParams } from "react-router-dom";
import { Formik } from "formik";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, Grid, Box, Typography, TextField, Chip, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import FormHelperText from '@material-ui/core/FormHelperText';
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, getYear, getMonth, getDay, addHours, getHours, getDate } from 'date-fns'
import es from 'date-fns/locale/es';
registerLocale('es', es); setDefaultLocale('es');

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
  }));

const ITEM_HEIGHT = 50;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const FechaStep = props => {
    const { enqueueSnackbar } = useSnackbar();
    const [area, setArea] = useState({});
    const [startDate, setStartDate] = useState(props.values.FechaResv || null);
    const { settings } = useSettings();
    const { threadKey } = useParams();
    const [loading, setLoading] = useState(false);
    const [reservas, setReservas] = useState([]);
    const { next, back, values} = props;
    let ydays = [];
    const weekDays = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];
    const classes = useStyles();
    const [horasResv, setHorasResv] = React.useState(props.values.HorasResv || []);
    const [horasDisp, setHorasDisp] = useState(values.horasDisp||[]);
    const [afrXHoras, setAfrXHoras] = useState(props.values.AfrXHora || []);

    const handleChangeH = (event) => {
        if(area.HorasUso >= event.target.value.length) {
            setHorasResv(event.target.value);
        } else {
            console.log(horasResv, event.target.value)
            enqueueSnackbar("¡No puede reservar más horas!", {
                variant: "error",
            });
        }
    };
    
    const getAreaById = React.useCallback(() => {
        try {
            FirestoreService.getAreaById(settings.idConjunto, threadKey, {
                next: (querySnapshot) => {
                    setArea(querySnapshot.data());
                    setLoading(true);
                  },
                },
            );
            FirestoreService.getHoras(settings.idConjunto, threadKey, {
                next: (querySnapshot) => {
                    const updatedGroceryItems = querySnapshot.docs.map(
                        (docSnapshot) => docSnapshot
                    );
                    setReservas(updatedGroceryItems);
                },
            })
        } catch (e) { }
    }, [settings.idConjunto]);

    useEffect(() => {
        getAreaById();
    }, [getAreaById]);
    useEffect(() => {
        if(area.HoraInicio && startDate!==null){
            llenarHoras();
        }
    }, [startDate])

    if(area.DiasHabiles){
        weekDays.forEach((d, i) => {
            if (area.DiasHabiles.indexOf(d) === -1) ydays.push(i)
        });
    }
    const isWeekday = (date) => {
        const day = getDay(date);
        return day !== ydays[0] && day !== ydays[1] && day !== ydays[2] && day !== ydays[3] && day !== ydays[4] && day !== ydays[5] && day !== ydays[6]
    };
    function llenarHoras() {
        const hrsDisp= [];
        let afrXHora = [];
        const desde = area.HoraInicio.substr(0, 2)*1;
        const hasta = area.HoraFin.substr(0, 2)*1;
        if(reservas.length>0){
            //filtrando las reservas que existan en la fecha seleccionada
            const fechaSelec = new Date(getYear(startDate),getMonth(startDate),getDate(startDate)).toLocaleDateString();
            let filterDate = reservas.filter(resv => {
                let fecha = new Date(resv.data().time).toLocaleDateString();
                return fechaSelec === fecha
            })
            //obteniendo las horas de las reservas
            const hrsR= filterDate.map(resv => {
                return getHours(addHours(new Date(resv.data().time), 5))//añado 5 hrs a la fecha q viene de la BD
            })
            for (let i = desde; i < hasta; i++){
                if(hrsR.indexOf(i)===-1){
                    hrsDisp.push(i);
                    afrXHora.push({id:i,afrDisp: area.Aforo});
                } else {
                    if(area.MultiReserva){
                        let afrP = 0
                        let usures = filterDate.find(resv => getHours(addHours(new Date(resv.data().time), 5)) === i)
                        JSON.parse(usures.data().usuario).forEach(u => {
                            afrP += u.personas
                        });
                        afrXHora.push({id: i, afrDisp: area.Aforo-afrP})
                        if(afrP<area.Aforo) hrsDisp.push(i);
                    }
                }
            }
            setHorasDisp(hrsDisp);
        } else {
            for (let i = desde; i < hasta; i++){
                hrsDisp.push(i);
                afrXHora.push({id:i,afrDisp: area.Aforo});
            }
            setHorasDisp(hrsDisp);
        }
        setAfrXHoras(afrXHora);
    }

    return (
        <Fragment>
            {loading===false ? (
                <LoadingData />
            ) : (
                <Formik
                    initialValues={{
                        FechaResv: props.values.FechaResv = props.values.FechaResv ? props.values.FechaResv : "",
                        HorasResv: props.values.HorasResv = props.values.HorasResv ? props.values.HorasResv : [],
                    }}
                    validationSchema={
                        Yup.object().shape({
                            FechaResv: Yup.string()
                                .required("Seleccione una fecha para la reserva"),
                        })
                    }
                    onSubmit={(values) => {
                        values.HorasResv= horasResv
                        values.AfrXHora= afrXHoras
                        values.horasDisp= horasDisp
                        next(values);
                      }}
                >
                    {({
                        isSubmitting,
                        values,
                        touched,
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        errors,
                    })=>(
                        <form onSubmit={handleSubmit} style={{padding: "20px"}}>
                        <Grid container direction="row" justifyContent="center">
                            <Grid item xs={12} md={6}>
                                <Grid item xs={12} md={12}>
                                    <Typography><b>Fecha de Reserva:</b></Typography>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <DatePicker
                                        id="FechaResv"
                                        name="FechaResv"
                                        selected={startDate}
                                        onChange={(e) => { values.FechaResv = e; setStartDate(e);}}
                                        onBlur={handleBlur}
                                        error={errors.FechaResv && touched.FechaResv}
                                        isClearable
                                        autoComplete='off'
                                        filterDate={isWeekday}
                                        minDate={addDays(new Date(), area.DiasAnticipacion)}
                                        timeIntervals={60}
                                        dateFormat="MMMM d, yyyy"
                                        name="FechaResv"
                                        locale="es"
                                        placeholderText="seleccionar fecha de la reserva"
                                    />
                                </Grid>
                                {errors.FechaResv && touched.FechaResv && errors.FechaResv &&(
                                    <Grid item xs={12} md={12}>
                                        <Box mt={2} display="flex">
                                            <FormHelperText error>
                                                {errors.FechaResv}
                                            </FormHelperText>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid >
                            
                            <Grid item xs={12} md={6}>
                                <Grid item xs={12} md={12}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-mutiple-chip-label">Horas a Reservar</InputLabel>
                                        <Select
                                        id="demo-mutiple-chip"
                                        name="HorasResv"
                                        multiple
                                        value={horasResv}
                                        onChange={handleChangeH}
                                        onBlur={handleBlur}
                                        renderValue={(selected) => (
                                            <div className={classes.chips}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={`${value}:00 - ${value+1}:00`} className={classes.chip} />
                                            ))}
                                            </div>
                                        )}
                                        MenuProps={MenuProps}
                                        >
                                        {startDate===null ? (
                                            <MenuItem>Seleccione una fecha</MenuItem>
                                        ):(
                                            horasDisp.map((hora) => (
                                                <MenuItem key={hora} value={hora}>
                                                {`${hora}:00 - ${hora+1}:00`}
                                                </MenuItem>
                                            ))
                                        )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid >
                        <Grid container spacing={0} direction="row" justifyContent="flex-end">
                            <Grid item>
                                <Button
                                    disabled={isSubmitting || Object.entries(errors).length > 0}
                                    type="submit"
                                >
                                    Siguiente
                                </Button>
                            </Grid>
                        </Grid>
                    </form >
                    )}
                </Formik>
            )}
        </Fragment>
    )
}

export default FechaStep
