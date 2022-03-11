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
} from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import * as FirestoreService from "./services/firestore";
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from "notistack";
import AddIcon from "@material-ui/icons/Add";
import useSettings from "../../../contextapi/hooks/useSettings";




const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));


function NuevoSubRubro(props) {
  const { rubro } = props;
  const {settings} = useSettings();
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [isSubmitionCompleted, setSubmitionCompleted] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  function handleClose() {
    setOpen(false);
  }

  function handleClickOpen() {
    setSubmitionCompleted(false);
    setOpen(true);
  }

  return (
    <React.Fragment>
      <Button variant="contained" size="small" onClick={handleClickOpen}>
        <AddIcon/>SubRubro
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {!isSubmitionCompleted && (
          <React.Fragment>
            <DialogTitle id="form-dialog-title">Registro de SubRubro</DialogTitle>
            <DialogContent>
              <DialogContentText>Registrar un nuevo SubRubro</DialogContentText>
              <Formik
                initialValues={{Nombre: ""}}
                onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  try { 
                    values = rubro.data().SubRubros.concat(values.Nombre);
                    FirestoreService.updateRubro(settings.idConjunto,rubro.id,values).then(()=>{
                      setSubmitting(false);
                            handleClose();
                            enqueueSnackbar("SubRubro añadido correctamente", {
                            variant: "success",
                            });
                    })

                    } catch (err) {
                    setSubmitting(false);
                    }  
                }}
                validationSchema={Yup.object().shape({
                  Nombre: Yup.string().required("¡Se requiere rellenar este campo!"),
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
                                error={errors.Nombre && touched.Nombre}
                                label="Nombre del SubRubro"
                                name="Nombre"
                                variant="outlined"
                                fullWidth = "true"
                                className={classes.margin}
                                value={values.Nombre}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={errors.Nombre && touched.Nombre && errors.Nombre}     
                            />
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
                        <Button type="submit" disabled={isSubmitting}>
                          Nuevo SubRubro
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

export default NuevoSubRubro;