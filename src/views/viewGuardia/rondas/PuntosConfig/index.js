import React, { useEffect, useState } from 'react';
import { useSnackbar } from "notistack";
import { Formik, Form, Field ,FieldArray, ErrorMessage } from 'formik';
import * as Yup from "yup";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Modal, Backdrop, Fade, Container, Grid, Box, TextField } from '@material-ui/core';
import Button from 'src/components/CustomButtons/Button';
import Page from 'src/components/Common/Page';
import * as FirestoreService from '../service/firestore'
import useStyles from '../Styles';
import useAuth from 'src/contextapi/hooks/useAuth';

const PuntosConfig = () => {
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [puntoConfig, setPuntoConfig] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
      FirestoreService.getPuntos(user.ConjuntoUidResidencia, {
          next: query=>{
            if(query.exists){
                  const data = query.data()?.registroPuntos;
                  setPuntoConfig(data);
            }
            setLoading(false);
        }
      });
    
      return () => {
        
      };
    }, []);

    const toggleModal = () => setOpen(!open);

    function onChangePoints(e, field, values, setValues) {
        // update dynamic form
        const points = [...values.points];
        const numberOfPoints = e.target.value || 0;
        const previousNumber = parseInt(field.value || '0');
        if (previousNumber < numberOfPoints) {
            for (let i = previousNumber; i < numberOfPoints; i++) {
                if(puntoConfig[i]){
                    points.push(puntoConfig[i]);
                }else{
                    points.push({ nombre: '', lat: 0, lng: 0 });
                }
            }
        } else {
            for (let i = previousNumber; i >= numberOfPoints; i--) {
                points.splice(i, 1);
            }
        }
        setValues({ ...values, points });

        // call formik onChange method
        field.onChange(e);
    }

    const onSubmit = ()=> {};
    return <>
        <Button onClick={toggleModal} variant='outlined' color='danger'>
    	    Configurar puntos
        </Button>
        <Modal
            open={open}
            onClose={toggleModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{timeout:500}}
            className={classes.modal}
        >
            <Fade in={open}>
                <Page className={classes.paper}>
                    <Container maxWidth='lg'>
                        <h2>Configuración de Puntos</h2>
                        <br/>
                        {loading ? (
                            <Box marginY={2} justifyContent={'center'}>
                                <CircularProgress/>
                            </Box>
                        ):(
                            <Formik
                                initialValues={{
                                    numberOfPoints: puntoConfig.length,
                                    points: puntoConfig
                                }}
                                validationSchema={Yup.object().shape({
                                    numberOfPoints: Yup.number().min(1, '¡Se requiere al menos 1 punto!').required('Debe determinar el número de puntos para sus rondas'),
                                    points: Yup.array().of(
                                        Yup.object().shape({
                                            nombre: Yup.string().required('¡Se requiere este campo!'),
                                            lat: Yup.number(),
                                            lng: Yup.number(),
                                        })
                                    ),
                                })}
                                onSubmit={async (values) => {
                                    setLoading(true);
                                    try {
                                      FirestoreService.setPuntos(user.ConjuntoUidResidencia, values).then(() => {
                                        setLoading(false);
                                        toggleModal();
                                        enqueueSnackbar("Configuración de puntos guardada", {
                                          variant: "success",
                                        });
                                      });
                                    } catch (err) {
                                      setLoading(false);
                                      enqueueSnackbar("¡Hubo un error, inténtelo más tarde!", {
                                        variant: "error",
                                      });
                                    }
                                  }}
                            >
                                {({errors, values, touched, dirty, setValues, handleBlur, handleReset})=>(
                                    <Form>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Field name="numberOfPoints">
                                                {({field})=>(
                                                    <TextField
                                                        label='número de puntos'
                                                        name='numberOfPoints'
                                                        value={values.numberOfPoints}
                                                        fullWidth
                                                        variant="outlined"
                                                        onChange={e => onChangePoints(e, field, values, setValues)}
                                                        onBlur={handleBlur}
                                                        error={errors.numberOfPoints && touched.numberOfPoints}
                                                        helperText={errors.numberOfPoints && touched.numberOfPoints && errors.numberOfPoints}
                                                    />
                                                )}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={12}>
                                            <FieldArray name="points">
                                            {() => (values.points.map((punto, i) => {
                                                const pointErrors = errors.points?.length && errors.points[i] || {};
                                                const pointTouched = touched.points?.length && touched.points[i] || {};
                                                return (
                                                    <Box key={i} mt={2}>
                                                        <h5 className="card-title">Punto {i + 1}</h5>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={4}>
                                                                <label>Nombre</label>
                                                                <Field name={`points.${i}.nombre`} type="text" className={'form-control' + (pointErrors.nombre && pointTouched.nombre ? ' is-invalid' : '' )} />
                                                                <ErrorMessage name={`points.${i}.nombre`} component="div" className="invalid-feedback" />
                                                            </Grid>
                                                            <Grid item xs={12} md={4}>
                                                                <label>Latitud</label>
                                                                <Field name={`points.${i}.lat`} type="text" className={'form-control' + (pointErrors.lat && pointTouched.lat ? ' is-invalid' : '' )} />
                                                                <ErrorMessage name={`points.${i}.lat`} component="div" className="invalid-feedback" />
                                                            </Grid>
                                                            <Grid item xs={12} md={4}>
                                                                <label>Longitud</label>
                                                                <Field name={`points.${i}.lng`} type="text" className={'form-control' + (pointErrors.lng && pointTouched.lng ? ' is-invalid' : '' )} />
                                                                <ErrorMessage name={`points.${i}.lng`} component="div" className="invalid-feedback" />
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                );
                                            }))}
                                            </FieldArray>
                                            </Grid>
                                        </Grid>
                                        <Box mt={2}>
                                            <Button
                                                color="danger"
                                                disabled={loading}
                                                fullWidth
                                                size="large"
                                                type="submit"
                                                variant="contained"
                                            >
                                                Guardar
                                            </Button>
                                        </Box>
                                    </Form>
                                )}
                            </Formik>
                        )}
                    </Container>
                </Page>
            </Fade>
        </Modal>
    </>;
};

export default PuntosConfig;
