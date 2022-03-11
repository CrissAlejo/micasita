import React from "react";
import "./EditAdmin.css"
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import * as FirestoreService from "../services/firestore";
import CustomInput from "../../../components/CustomInput/CustomInput.js";
import Button from "../../../components/CustomButtons/Button";
import Grid from '@material-ui/core/Grid';
import { IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem, Input, Chip } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
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
    overflow: 'scroll',
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
function EditAdmin(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [formulario, setFormulario] = React.useState(props.info.data());
  const [chipData, setChipData] = React.useState([]);
  const [Conjuntos, setConjuntos] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpen = () => {
    setOpen(true);
    setFormulario(props.info.data());
    setChipData(props.info.data()?.ConjuntoUid || [])
  };

  const handleClose = () => {
    setOpen(false);
    setChipData([])
  };

  function updateAdministrador(e) {
      if(chipData.length==0){
        enqueueSnackbar('¡Error en los conjuntos seleccionados!', {variant:'error'});
        return
      }
      formulario.ConjuntoUid = chipData;
      FirestoreService.updateAdmin(formulario, props.info.id).then(()=>{
          handleClose()
          enqueueSnackbar('Administrador actualizado',{variant: 'success'});
        }
      );
  }

  function handleChange(e) {
    const { name, value } = e.currentTarget;
    let userdata = formulario;
    userdata[name] = value;
    setFormulario(userdata);
  }

  React.useEffect(() => {
    FirestoreService.getAllConjuntos({
      next: (querySnapshot) => {
        const updateAdmins = querySnapshot.docs.map((docSnapshot) =>JSON.stringify({
          uid: docSnapshot.id,
          nombre:docSnapshot.data().Nombre,
          Imagen:docSnapshot.data().Imagen
        }));
        setConjuntos(updateAdmins);
      },
    });
  }, []);

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
            <h1>Editar Administrador</h1>
            <form name="createListForm" autoComplete="off">

            <Grid container spacing={3}>
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
                          <Chip
                            key={value}
                            label={JSON.parse(value).nombre}
                            className={classes.chip}
                          />
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
                    {Conjuntos.map((conjunto) => (
                      <MenuItem key={conjunto} value={conjunto} style={{fontWeight: chipData.indexOf(conjunto) == -1 ? 'normal':"bold"}}>
                        {JSON.parse(conjunto).nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> 
            </Grid>   
            </form>
            <Button color="primary" onClick={updateAdministrador}>
              Actualizar
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default EditAdmin;
