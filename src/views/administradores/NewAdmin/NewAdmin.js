import React from "react";
import "./NewAdmin.css"
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import * as FirestoreService from "../services/firestore";
import firebase from '../../../Firebase';
import CustomInput from "../../../components/CustomInput/CustomInput.js";
import Button from "../../../components/CustomButtons/Button";
import Grid from '@material-ui/core/Grid';
import { FormControl, InputLabel, Select, MenuItem, Input, Chip } from "@material-ui/core";
import { useSnackbar } from "notistack";

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
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

function NewAdmin() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [formulario, setFormulario] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [Conjunto, setConjuntos] = React.useState([]);
  const [chipData, setChipData] = React.useState([]);


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setChipData([]);
    setOpen(false);
  };

  React.useEffect(() => {
    FirestoreService.getAllConjuntos({
      next: (querySnapshot) => {
        const items = querySnapshot.docs.map((docSnapshot) =>
          ({...docSnapshot.data(), id: docSnapshot.id})
        );
        setConjuntos(items);
      },
    });
  }, []);


  function createAdmin(e) {
    if(chipData.length==0){
      enqueueSnackbar('Error en los conjuntos seleccionados', {variant:'error'});
      return;
    }
    formulario.ConjuntoUid = chipData.map(item=>(JSON.stringify({uid:item.id,nombre:item.Nombre, Imagen:item.Imagen})));
    createAuthAdmin(formulario);
    FirestoreService.NewAdmin(formulario).then((docRef) => {
        handleClose();
        enqueueSnackbar('Se ha creado un nuevo administrador', {variant:'success'});
    });       
  };

  function handleChange(e) {
    const { name, value } = e.currentTarget;
    let userdata = formulario;
    userdata[name] = value;
    setFormulario(userdata);
  }


  function randomPassword(){
    let chars = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnPpQqReSsTtUuVvWwXxYyZz';
    let password = '';
    for (let i = 0; i < 18; i++) {
      password += chars[Math.floor((Math.random() * chars.length))];
    }
    return password;    
  };


  function createAuthAdmin(e) {
    console.log(e);
      let email = e.Correo;
      let password = randomPassword();
      firebase.auth().createUserWithEmailAndPassword(email, password);
  }
  


  return (
    <div>
      <Button color="danger" onClick={handleOpen}>
        Nuevo Administrador
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
            <h2>Nuevo Administrador</h2>
            <form name="createListForm" autoComplete="off">

            <Grid container spacing={1}>
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
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="label">Conjuntos</InputLabel>
                  <Select
                    labelId="label"
                    id="demo-mutiple-chip"
                    multiple
                    value={chipData}
                    onChange={(e)=>setChipData(e.target.value)}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {selected.map((value) => (
                          <Chip key={value.Nombre} label={value.Nombre} className={classes.chip} />
                        ))}
                      </div>
                    )}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 4.5 + 8,
                          width: 250,
                        },
                      },
                    }}
                  >
                    {Conjunto.map((name) => (
                      <MenuItem key={name.id} value={name} style={{fontWeight: chipData.indexOf(name) == -1 ? 'normal':"bold"}}>
                        {name.Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> 
                          
            </Grid>   
            </form>
            <Button color="success" onClick={createAdmin}>
              Crear
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}


export default NewAdmin;
