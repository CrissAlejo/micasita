import React ,{ Fragment, useState, useEffect } from 'react';
import * as FirestoreService from '../../services/firestore';
import useSettings from "../../../../../contextapi/hooks/useSettings";
import { Grid, Button, Typography, Select, MenuItem, Box, FormHelperText } from '@material-ui/core';
import { Formik } from "formik";
import * as Yup from "yup";

const UsuarioStep = props => {
    const { next, back, values } = props;
    const [usuarios, setUsuarios] = useState([]);
    const { settings } = useSettings();

    const getUsersConjunto = React.useCallback(() => {
        try {
            FirestoreService.getUserByConjunto(settings.idConjunto, {
              next: (querySnapshot) => {
                const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
                setUsuarios(Items);
              },
            });
        } catch (e) { }
      }, [settings.idConjunto]);

    const mapValues = () => {
        values.usuario = values.usuario ? values.usuario : "";
    };
    useEffect(() => {
        getUsersConjunto();
        mapValues();
    }, [getUsersConjunto]);

    function usrLbl(name, lastname, casa){
        const detalle = `${name} ${lastname} / ${casa}`;
        return detalle
    }
    return (
            <Formik
              initialValues={{
                usuario: values.usuario ? values.usuario : "",
              }}
              validationSchema={Yup.object().shape({
                usuario: Yup.string().required("Se requiere el usuario de la Reserva"),
              })}
              onSubmit={values => {
                next({
                    usuario: values.usuario,
                });
              }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit} style={{padding: "20px"}}>
                        <Grid container spacing={0} direction="row" justifyContent="center">
                            <Grid item xs={12} lg={2}>
                            <Typography>
                                <b>Reservar para:</b>
                            </Typography>
                            </Grid>

                            <Grid item xs={12} lg={6}>
                                <Select
                                    id="usuario"
                                    name="usuario"
                                    label="Selecciona un usuario"
                                    fullWidth
                                    variant="outlined"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.usuario}
                                    error={errors.usuario && touched.usuario}
                                    MenuProps={{
                                        PaperProps: {
                                          style: {
                                            maxHeight: 50 * 4.5 + 8,
                                            width: 250,
                                          },
                                        },
                                      }}
                                >
                                    <MenuItem value={localStorage.getItem('accessToken')+':admin'}>Administración</MenuItem>
                                    {usuarios.sort((a, b) => a.data().Casa - b.data().Casa).map(user => (
                                        <MenuItem key={user.id} value={user.data().Correo}>{usrLbl(user.data().Nombre, user.data().Apellido, user.data().Casa)}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            {errors.usuario && touched.usuario && errors.usuario && (
                                <Grid item xs={12} md={12}>
                                    <Box mt={2} display="flex" justifyContent="center">
                                        <FormHelperText error>
                                            {errors.usuario}
                                        </FormHelperText>
                                    </Box>
                                </Grid>
                            )}
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
                )}
            </Formik>
    )
}

export default UsuarioStep
