import React from "react";
//import "./NewAdmin.css"
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import * as FirestoreService from "../services/firestore";
import firebase from '../../../Firebase';
import CustomInput from "../../../components/CustomInput/CustomInput.js";
import Button from "../../../components/CustomButtons/Button";
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
    overflowY: 'scroll',
    padding: theme.spacing(2, 4, 3),
  },
}));

function AddUser(props) {

  const classes = useStyles();
  const {info, nameConjunto} = props
  const [open, setOpen] = React.useState(false);
  const [formulario, setFormulario] = React.useState({});
  const [roles, setRoles] = React.useState({
    administrador: false,
    residente: false,
    supervisor: false,
    guardia: false
  });
  const {administrador, residente, supervisor, guardia} = roles;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleChange(e) {
    const { name, value } = e.currentTarget;
    let userdata = formulario;
    userdata[name] = value;
    setFormulario(userdata);
  }

  const handleChangeRol = (event) => {
    setRoles({...roles, [event.target.name]: event.target.checked});
  };

  function randomPassword() {
    let chars = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnPpQqReSsTtUuVvWwXxYyZz';
    let password = '';
    for (let i = 0; i < 18; i++) {
      password += chars[Math.floor((Math.random() * chars.length))];
    }
    return password;
  };

  const createUser = () => {
    //let email = e.Correo;
    let password = randomPassword();
    let conjuntoId = info;
    let conjuntoNombre = nameConjunto;
    formulario.Rol = JSON.stringify(roles);
    formulario.ConjuntoUidResidencia = conjuntoId;
    formulario.Comprobantes = Array(12).fill({Year: '', NumeroComprobante: 0});
    
    //['{"uid":'+'"'+conjuntoId+'"'+',"nombre":'+'"'+conjuntoNombre+'"'+',"residente":true}'];
    
    FirestoreService.getUser(formulario.Correo).then((doc) => {
      if (!doc.exists) {
        FirestoreService.newUser(formulario).then(() =>{
            firebase.auth().createUserWithEmailAndPassword(formulario.Correo, password).then((doc) =>{
              firebase.auth().sendPasswordResetEmail(formulario.Correo).then(function () {
                  handleClose();
                })
                .catch(function (error) {
                });
            })
        })
        .catch((error) => {
        });
      } else {
      }
    }).catch((error) => {
    });       
  }

  return (
    <>
      <Button color="danger" onClick={handleOpen}>
        Nuevo Usuario
      </Button>

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
            <h3>Nuevo Usuario</h3>
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
                    }}
                  />
                </Grid>
                {residente ? <><Grid item xs={12} sm={6}>
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

                    }}
                    underline={{
                      underline: true
                    }}
                  />
                </Grid></>: null}
              </Grid>
            </form>
            <Button color="primary" onClick={createUser}>
              Crear Usuario
            </Button>
          </div>
        </Fade>
      </Modal>
    </>
  );
}


export default AddUser;
