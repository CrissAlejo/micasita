import React from 'react';
import { Fragment, useState, useEffect } from "react";
import { Grid, Button, Typography } from '@material-ui/core';
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { ListaAforo } from './ListaAforo';


const AforoStep = (props) => {
    const { next, back, values } = props;
    const afrXHoras = values.AfrXHora;
    const hrsResv = values.HorasResv;
    const [aforo, setAforo] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [personas, setPersonas] = useState(values.Personas || []);

    useEffect(() => {
        getAforo();
        mapValues();
        return ()=> {
            setAforo([])
        }
    }, [])
    const mapValues = () => {
        values.Personas = values.Personas ? values.Personas : [];
    };
    function getAforo() {
        let horasDisp=[];
        hrsResv.forEach(hora => {
            horasDisp.push(...afrXHoras.filter(afr => afr.id === hora));
        });
        setAforo(horasDisp);
    }
    function handlePersonas(value, id) {
        if(personas[id]){
            let p = [...personas]
            p[id]= value
            setPersonas(p)
        } else {
            setPersonas([...personas, value])
        }
    }
    return (
        <Formik
        initialValues={{
            Personas: values.Personas ? values.Personas : [],
          }}
          validationSchema={Yup.object().shape({
            Personas: Yup.array().required("¡Se requiere rellenar este campo!"),
          })}
          onSubmit={(values, {setSubmitting}) => {
            if(personas.length === hrsResv.length){
                values.Personas= personas
            next({
              Personas: values.Personas,
            });
            } else {
                setSubmitting(false);
                enqueueSnackbar("¡Debe seleccionar la cantidad de personas para cada hora!", {
                    variant: "error",
                });
            }
          }}
        >
            {props => {
                const {
                    values,
                    touched,
                    errors,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                } = props
                return (
                    <form onSubmit={handleSubmit} style={{padding: "20px"}}>
                        <Grid container spacing={0} direction="row" justifyContent="center">
                            <Grid item xs={12} lg={2}>
                            <Typography>
                                <b>Número de personas por Hora:</b>
                            </Typography>
                            </Grid>

                            <Grid item xs={12} lg={6}>
                                { aforo.length> 0 && hrsResv.map( (hora, index) => (
                                    <ListaAforo hora={hora} index={index} values={personas} aforo={aforo[index]} errors={errors} touched={touched} handlePersonas={handlePersonas}/>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid container spacing={0} direction="row" justifyContent="space-between">
                            <Grid item>
                                <Button disabled={isSubmitting} onClick={e => back(e, values)}>
                                    Atrás
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    disabled={isSubmitting || Object.entries(errors).length > 0}
                                    type="submit"
                                >
                                    Siguiente
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )
            }}   
        </Formik>
    )
}

export default AforoStep
