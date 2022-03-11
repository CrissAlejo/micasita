import React from "react";
import "./EditUsuario.css"
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import * as FirestoreService from "../services/firestore";
import CustomInput from "../../../components/CustomInput/CustomInput.js";
import Button from "../../../components/CustomButtons/Button";
import Grid from '@material-ui/core/Grid';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { IconButton, Tooltip } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    height:'100%',
    width:'50%',
    right: 0,
    position: 'fixed',
    margin: 'auto',
    overflow: 'scroll',
    padding: theme.spacing(2, 4, 3),
  },
}));
function EditUsuario(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [formulario, setFormulario] = React.useState(props.info.data());
  const [roles, setRoles] = React.useState({});
  const { administrador, residente, supervisor, guardia } = roles;

  const handleOpen = () => {
    setOpen(true);
    setFormulario(props.info.data());
    const userRol = JSON.parse(formulario.Rol);
    setRoles({
      administrador: userRol.administrador,
      residente: userRol.residente,
      supervisor: userRol.supervisor,
      guardia: userRol.guardia,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeRol = (event) => {
    setRoles({ ...roles, [event.target.name]: event.target.checked });
  };

  function updateUsuarios(e) {
      formulario.Rol = JSON.stringify(roles);
      FirestoreService.updateUser(formulario, props.info.id).then(
        handleClose()
      );
  }

  function handleChange(e) {
    const { name, value } = e.currentTarget;
    let userdata = formulario;
    userdata[name] = value;
    setFormulario(userdata);
  }

  return (
    <div>
      <Tooltip title='actualizar'>
        <IconButton onClick={handleOpen}>
          <EditIcon/>
        </IconButton>
      </Tooltip>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h3>Editar Usuario</h3>
            <form name="createListForm" autoComplete="off">

            <Grid container spacing={1}>
                <Grid item xs={12}>
                  <FormGroup row>
                    <FormControlLabel
                      control={<Checkbox checked={administrador} onChange={handleChangeRol} name="administrador" />}
                      label="Administrador"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={residente} onChange={handleChangeRol} name="residente" />}
                      label="Residente"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={supervisor} onChange={handleChangeRol} name="supervisor" />}
                      label="Supervisor"
                    />
                    <FormControlLabel
                      control={<Checkbox checked={guardia} onChange={handleChangeRol} name="guardia" />}
                      label="Guardia"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Nombre"
                    id="Nombre"
                    name="Nombre"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => handleChange(event),
                      placeholder: "Nombre",
                      type: "text",
                      defaultValue: formulario.Nombre,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Apellido"
                    id="Apellido"
                    name="Apellido"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => handleChange(event),
                      placeholder: "Apellido",
                      type: "text",
                      defaultValue: formulario.Apellido,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomInput
                    labelText="Correo Electrónico"
                    id="Correo"
                    name="Correo"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => handleChange(event),
                      placeholder: "Correo Electrónico",
                      type: "email",
                      defaultValue: formulario.Correo,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomInput
                    labelText="Cédula"
                    id="Cedula"
                    name="Cedula"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => handleChange(event),
                      placeholder: "Cédula",
                      type: "number",
                      defaultValue: formulario.Cedula,
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomInput
                    labelText="Teléfono"
                    id="Telefono"
                    name="Telefono"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => handleChange(event),
                      placeholder: "Teléfono",
                      type: "number",
                      defaultValue: formulario.Telefono,
                    }}
                  />
                </Grid>
                {residente && (
                  <>
                  <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Alícuota"
                    id="Alicuota"
                    name="Alicuota"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => handleChange(event),
                      placeholder: "Alícuota",
                      type: "number",
                      defaultValue: formulario.Alicuota,

                    }}
                    underline={{
                      underline: true
                    }}

                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomInput
                    labelText="Número de Casa"
                    id="Casa"
                    name="Casa"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      onChange: (event) => handleChange(event),
                      placeholder: "Número de Casa",
                      type: "text",
                      defaultValue: formulario.Casa,

                    }}
                    underline={{
                      underline: true
                    }}
                  />
                </Grid>
                  </>
                )}
              </Grid>
            </form>
            <Button color="primary" onClick={updateUsuarios}>
              Actualizar
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default EditUsuario;
