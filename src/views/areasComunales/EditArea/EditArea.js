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
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
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

function EditArea(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [personName, setPersonName] = React.useState([]);
  const [formulario, setFormulario] = React.useState(props.info.data());
  const [Imagen, setImagen] = React.useState(null);
  const { threadKey } = useParams();
  const [per, setPer] = React.useState('');
  const [openPer, setOpenPer] = React.useState(false);

  const handleChangePer = (event) => {
    let userdata = formulario;
    userdata.Periodo = event.target.value;
    setFormulario(userdata);
    setPer(event.target.value);

  };
  const handleOpenPer = (event) => {
    setOpenPer(true);
  };
  const handleClosePer = () => {
    setOpenPer(false);
  };
  const [switches, setSwitches] = React.useState({
    
  });
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

  const handleOpen = () => {
    setPer(formulario.Periodo);
    setSwitches({ ...switches, 
      habilitado : formulario.Habilitado,
      multiReserva : formulario.MultiReserva  
    });
    setPersonName(formulario.DiasHabiles);
    let userdata = formulario;
    userdata.habilitado = formulario.Habilitado;
    userdata.multiReserva = formulario.MultiReserva;
    setFormulario(userdata);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSw = (event) => {
    let userdata = formulario;
    userdata[event.target.name] = event.target.checked;
    setFormulario(userdata);
    setSwitches({ ...switches, [event.target.name]: event.target.checked });
  };

  function handleChangeSelectM(event) {
    let userdata = formulario;
    userdata.DiasHabiles = event.target.value;
    setFormulario(userdata);
    setPersonName(event.target.value);
  };

  function createGroceryList(e) {
    if(Imagen !== null){
      FirestoreService.uploadImage(Imagen, props.info.id+""+formulario.Nombre).then((red) => {
        formulario.Imagen = red;
        FirestoreService.updateArea(threadKey, formulario, props.info.id).then((doc) => {
          handleClose();
          window.location.reload();
        });
      }).catch((error) => {
        FirestoreService.updateArea(threadKey, formulario, props.info.id).then((doc) => {
          handleClose();
          window.location.reload();
        });
      });
      
    }else{
      FirestoreService.updateArea(threadKey, formulario, props.info.id).then((doc) => {
        handleClose();
        window.location.reload();
      });
    }
  };
    
  const changeImagen = (e) => {
    setImagen(e.target.files[0]);
  };
  function handleChange(e) {
    const { name, value } = e.currentTarget;
    let userdata = formulario;
    userdata[name] = value;
    setFormulario(userdata);
};
    
return (
    <div>
        <Button onClick={handleOpen} color="warning">Editar</Button>

        <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description"
            className={classes.modal} open={open} onClose={handleClose} closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500, }}>
            
            <Fade in={open}>
            <div className={classes.paper}>
                    <h1>Edita área</h1>
                    
                <form name="createListForm" autoComplete="off">
                  <CustomInput labelText="Nombre" id="Nombre" name="Nombre"
                        formControlProps={{ fullWidth: false, }}
                        inputProps={{ onChange: (event) => handleChange(event), type: "text",defaultValue: formulario.Nombre,}}
                  />
                    <CustomInput labelText="Horas de uso máximo por residente" id="HorasUso" name="HorasUso"
                        formControlProps={{ fullWidth: false, }}
                        inputProps={{ onChange: (event) => handleChange(event),type: "number",defaultValue: formulario.HorasUso,}}
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
                    </FormControl><br></br>
                    <CustomInput labelText="Hora de inicio" id="HoraInicio" name="HoraInicio"
                        formControlProps={{ fullWidth: false, }}
                        inputProps={{ onChange: (event) => handleChange(event), type: "time",defaultValue: formulario.HoraInicio,}}
                    />
                    <CustomInput labelText="Hora de cierre" id="HoraFin" name="HoraFin"
                        formControlProps={{ fullWidth: false, }}
                        inputProps={{ onChange: (event) => handleChange(event), type: "time",defaultValue: formulario.HoraFin,}}
                    />
                    <CustomInput labelText="Aforo" id="Aforo" name="Aforo"
                        formControlProps={{ fullWidth: false, }}
                        inputProps={{ onChange: (event) => handleChange(event), type: "number",defaultValue: formulario.Aforo,}}
                        /><br></br>
                    <CustomInput labelText="Garantía" id="Garantia" name="Garantia"
                        formControlProps={{ fullWidth: false, }}
                        inputProps={{ onChange: (event) => handleChange(event), type: "number",defaultValue: formulario.Garantia,}}
                    />
                    <CustomInput labelText="Días de anticipación para la reserva" id="DiasAnticipacion" name="DiasAnticipacion"
                        formControlProps={{ fullWidth: false, }} 
                        inputProps={{ onChange: (event) => handleChange(event), type: "number",defaultValue: formulario.DiasAnticipacion,}}
                    />
                    <CustomInput labelText="Máximo de reservas por Usuario" id="ReservaxUsuario" name="ReservaxUsuario"
                        formControlProps={{ fullWidth: false, }} 
                        inputProps={{ onChange: (event) => handleChange(event), type: "number",defaultValue: formulario.ReservaxUsuario,}}
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
                    /><br></br>
                    <CustomInput labelText="Términos y Condiciones" id="TerminosCond" name="TerminosCond"
                        formControlProps={{ fullWidth: false, }} 
                        inputProps={{ onChange: (event) => handleChange(event), type: "text",defaultValue: formulario.TerminosCond,}}
                    />

                    <CustomInput labelText="Imagen" id="ruc" name="ruc"
                        formControlProps={{ fullWidth: false,}}
                        inputProps={{ onChange: (event) => changeImagen(event),  type: "file"}}
                    />
                </form>
                    
                <Button color="success" onClick={createGroceryList}>Actualizar</Button>
            </div>
            </Fade>
        </Modal>
    </div>
  );
}

export default EditArea;
