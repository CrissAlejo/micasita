import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import * as FirestoreService from "../services/firestore";
import CustomInput from "../../../components/CustomInput/CustomInput.js";
import Button from "../../../components/CustomButtons/Button";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "auto",
    // marginLeft:"80vh",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

}));

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function NewArea() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [formulario, setFormulario] = React.useState({});
  const [Imagen, setImagen] = React.useState(null);
  const { threadKey } = useParams();
  const [switches, setSwitches] = React.useState({
    habilitado: false,
    multiReserva: false
  });
  const [per, setPer] = React.useState('');
  const [openPer, setOpenPer] = React.useState(false);

  const handleChangePer = (event) => {
    let userdata = formulario;
    userdata.Periodo = event.target.value;
    setFormulario(userdata);
    setPer(event.target.value);

  };

  const handleClosePer = () => {
    setOpenPer(false);
  };

  const handleOpenPer = (event) => {
    setOpenPer(true);
  };
  const names = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChangeSw = (event) => {
    let userdata = formulario;
    userdata[event.target.name] = event.target.checked;
    setFormulario(userdata);
    setSwitches({ ...switches, [event.target.name]: event.target.checked });
  };

  const handleOpen = () => {
    let userdata = formulario;
    userdata.habilitado = switches.habilitado;
    userdata.multiReserva = switches.multiReserva;
    userdata.UidFather = threadKey;
    setFormulario(userdata);
    setOpen(true);
  };
  const changeImagen = (e) => {
    setImagen(e.target.files[0]);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function createGroceryList(e) {
    try {
      let imgInside = "https://firebasestorage.googleapis.com/v0/b/micasitaapp-d4b5c.appspot.com/o/fotoareas%2Fdefault.jpg?alt=media&token=4a064ac1-6269-4b66-91b4-70dfca91b108";
      if (Imagen !== null) {
        FirestoreService.uploadImage(Imagen, formulario.UidFather + "" + formulario.Nombre.replace(/\s/g, "")).then((red) => {
          imgInside = red;
          FirestoreService.newArea(threadKey, formulario, red).then((docRef) => {
            if (docRef) {
              handleClose();
              window.location.reload();
            }
          });
        }).catch((error) => {
          FirestoreService.newArea(threadKey, formulario, imgInside).then((docRef) => {
            if (docRef) {
              handleClose();
              window.location.reload();
            }
          });
        });
      } else {
        FirestoreService.newArea(threadKey, formulario, imgInside).then((docRef) => {
          if (docRef) {
            handleClose();
            window.location.reload();
          }
        });
      }
    } catch (error) {
    }
    
    
  }

  function handleChange(e) {
    const { name, value } = e.currentTarget;
    let userdata = formulario;
    userdata[name] = value;
    setFormulario(userdata);
  }

  function handleChangeSelectM(event) {
    let userdata = formulario;
    userdata.DiasHabiles = event.target.value;
    setFormulario(userdata);
    setPersonName(event.target.value);
  };

  return (
    <div>
      <Button color="primary" onClick={handleOpen}>Nueva área</Button>

      <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description"
        className={classes.modal} open={open} onClose={handleClose} closeAfterTransition
        BackdropComponent={Backdrop} BackdropProps={{ timeout: 500, }}>

        <Fade in={open}>
          <div className={classes.paper}>
            <h1>Nueva área</h1>
            <form name="createListForm" autoComplete="off">
              <CustomInput labelText="Nombre" id="Nombre" name="Nombre"
                formControlProps={{ fullWidth: false, }}
                inputProps={{ onChange: (event) => handleChange(event), type: "text", }}
              />
              <CustomInput labelText="Horas de uso máximo por residente" id="HorasUso" name="HorasUso"
                formControlProps={{ fullWidth: false, }}
                inputProps={{ onChange: (event) => handleChange(event), type: "number", }}
              />
              <FormControl>
                <InputLabel id="diasHabilesLabel">Días hábiles</InputLabel>
                <Select
                  labelId="diasHabilesLabel"
                  id="diasHabiles"
                  multiple
                  value={personName}
                  onChange={handleChangeSelectM}
                  input={<Input id="selectDiasHabiles" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} className={classes.chip} />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {names.map((name) => (
                    <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* <CustomInput labelText="Días hábiles" id="DiasHabiles" name="DiasHabiles"
                        formControlProps={{ fullWidth: false, }} 
                        inputProps={{ onChange: (event) => handleChange(event),type: "text",}}
                    /> */}
              <br></br>
              <CustomInput labelText="Hora  de inicio" id="HoraInicio" name="HoraInicio"
                formControlProps={{ fullWidth: false, }}
                inputProps={{ onChange: (event) => handleChange(event), type: "time", }}
              />
              <CustomInput labelText="Hora de cierre" id="HoraFin" name="HoraFin"
                formControlProps={{ fullWidth: false, }}
                inputProps={{ onChange: (event) => handleChange(event), type: "time", }}
              />
              <CustomInput labelText="Aforo del área comunal" id="Aforo" name="Aforo"
                formControlProps={{ fullWidth: false, }}
                inputProps={{ onChange: (event) => handleChange(event), type: "number", }}
              /><br></br>
              <CustomInput labelText="Garantía" id="Garantia" name="Garantia"
                formControlProps={{ fullWidth: false, }}
                inputProps={{ onChange: (event) => handleChange(event), type: "number", }}
              />

              <CustomInput labelText="Días de anticipación para la reserva" id="DiasAnticipacion" name="DiasAnticipacion"
                formControlProps={{ fullWidth: false, }}
                inputProps={{ onChange: (event) => handleChange(event), type: "number", }}
              />
              <CustomInput labelText="Máximo de reservas por Usuario" id="ReservaxUsuario" name="ReservaxUsuario"
                formControlProps={{ fullWidth: false, }}
                inputProps={{ onChange: (event) => handleChange(event), type: "number", }}
              /><br></br>

              <FormControl className={classes.formControl}>
                <InputLabel id="demo-controlled-open-select-label">Periodo</InputLabel>
                <Select
                  labelId="demo-controlled-open-select-label"
                  id="demo-controlled-open-select"
                  open={openPer}
                  onClose={handleClosePer}
                  onOpen={handleOpenPer}
                  value={per}
                  onChange={handleChangePer}
                >
                  <MenuItem value="">
                    <em>Seleccionar</em>
                  </MenuItem>
                  <MenuItem value={7}>Semanal</MenuItem>
                  <MenuItem value={30}>Mensual</MenuItem>
                  <MenuItem value={365}>Anual</MenuItem>
                </Select>
              </FormControl>
              {/* <CustomInput labelText="Período" id="Periodo" name="Periodo"
                        formControlProps={{ fullWidth: false, }} 
                        inputProps={{ onChange: (event) => handleChange(event), type: "text",}}
                    /> */}
              <FormControlLabel
                control={
                  <Switch
                    checked={switches.habilitado}
                    onChange={handleChangeSw}
                    name="habilitado"
                    id="habilitado"
                    color="primary"
                  />}
                label="Habilitado"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={switches.multiReserva}
                    onChange={handleChangeSw}
                    name="multiReserva"
                    id="multiReserva"
                    color="primary"
                  />
                }
                label="Multi-Reserva"
              />
              <br></br>
              <CustomInput labelText="Términos y Condiciones" id="TerminosCond" name="TerminosCond"
                formControlProps={{ fullWidth: true, }}
                inputProps={{ onChange: (event) => handleChange(event), type: "text", }}
              /><br></br>

              <CustomInput labelText="Imagen" id="ruc" name="ruc" accept="image/*"
                formControlProps={{ fullWidth: false, }}
                inputProps={{ onChange: (event) => changeImagen(event), type: "file", }}
              />

            </form>
            <Button color="success" onClick={createGroceryList}> Crear </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default NewArea;
