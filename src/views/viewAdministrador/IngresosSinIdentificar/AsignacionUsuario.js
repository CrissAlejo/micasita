import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton
} from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import * as FirestoreService from "./services/firestore";
import { useSnackbar } from "notistack";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import useSettings from "../../../contextapi/hooks/useSettings";



function AsignacionUsuario(props) {
  const { ingresoId } = props;

  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [usuarios, setUsuarios] =  useState([]);

  function handleClose() {
    setOpen(false);
  }

  function handleClickOpen() {
    setSubmitionCompleted(false);
    setOpen(true);
  }

  React.useEffect(() => {
    try {
      FirestoreService.getUsuariosByConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setUsuarios(Items);
          },
        },
        settings.idConjunto
      );
    } catch (e) { }
  },[settings.idConjunto]);

  return (
    <React.Fragment>
        <IconButton
            aria-label="asignar"
            onClick={() => {handleClickOpen()}}
        >
        <AssignmentIndIcon />
        </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {!isSubmitionCompleted && (
          <React.Fragment>
            <DialogTitle id="form-dialog-title">Asignación de residentes</DialogTitle>
            <DialogContent>
              <DialogContentText>Asignar ingreso a un residente</DialogContentText>
              <Formik
                initialValues={{ Usuario: ""}}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);       
                  try {    
                    FirestoreService.updateIngreso(settings.idConjunto,ingresoId,values).then(() => {
                        setSubmitting(false);
                            handleClose();
                            enqueueSnackbar("Residente asignado correctamente", {
                            variant: "success",
                            });
                    });         
                    } catch (err) {
                      handleClose();
                      enqueueSnackbar("Error al asignar el valor a un residente", {
                      variant: "error",
                      });
                    setSubmitting(false);
                    }  
                }}
                validationSchema={Yup.object().shape({
                  Usuario: Yup.string().required("¡Se requiere rellenar este campo!"),
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
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} lg={12}>
                            <TextField
                                error={errors.Usuario && touched.Usuario}
                                label="Usuario"
                                name="Usuario"
                                placeholder="Selecciona el Usuario"
                                variant="outlined"
                                fullWidth={true}
                                select
                                SelectProps={{ native: true }}
                                value={values.Usuario}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.Usuario && touched.Usuario && errors.Usuario}
                            >
                                <option key ={null} value= {""}>
                                </option> 
                                {usuarios.map((Usuario) => (
                                <option key={Usuario.id} value={Usuario.id}>
                                    UH-{Usuario.data().Casa} - {Usuario.data().Nombre}/{Usuario.data().Apellido}
                                </option>   
                                ))}
                            </TextField>
                            </Grid>
                        </Grid>
                      <DialogActions>
                        <Button
                          type="button"
                          className="outline"
                          onClick={handleReset}
                          disabled={!dirty || isSubmitting}
                        >
                          Limpiar
                        </Button>
                        <Button type="submit" color ="primary" disabled={isSubmitting}>
                          Asignar usuario
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

export default AsignacionUsuario;