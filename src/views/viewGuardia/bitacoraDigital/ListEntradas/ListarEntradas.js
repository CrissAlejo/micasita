import React from "react";
import useStyles from "./useStyles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import Grid from "@material-ui/core/Grid";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import useAuth from "../../../../contextapi/hooks/useAuth";
import Box from '@material-ui/core/Box';
import moment from 'moment';
import axios from "axios";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { IconButton } from "@material-ui/core";
import NoInfo from "../../../../components/Common/NoInfo";
import LoadingData from "../../../../components/Common/LoadingData";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "../../../../components/CustomButtons/Button";
import SearchBar from "material-ui-search-bar";


const ListaEntradasPendientes = () => {
  const classes = useStyles();
  const [entradasConjunto, setEntradasConjunto] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [registro, setRegistro] = React.useState(null);
  const { user } = useAuth();
  const columns = [
    { id: "nombre", label: "Cédula" },
    { id: "apellido", label: "Nombre y Apellido" },
    { id: "casa", label: "Lugar de destino" },
    { id: "placa", label: "Vehículo" },
    { id: "fecha", label: "Fecha y Hora" },
    { id: "salida", label: "Tiempo Salida" },
    { id: "acciones", label: "Acciones" },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = React.useState("");
  const [filterEntradas, setfilterEntradas] = React.useState([]);
  const urlRequest = "https://micasitabackend.herokuapp.com/";
  //const urlRequest = "http://127.0.0.1:8000/";

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const requestSearch = (searchedVal) => {

    const filteredRows = filterEntradas.filter((row) => {
      return row
      .nombre_persona_ingreso.toLowerCase().includes(searchedVal.toLowerCase())|| row
      .apellido_persona_ingreso?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .casa_destino?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .nombre_destino?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .apellido_destino?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .cedula_persona_ingreso?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .color_vehiculo_ingreso?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .placa_vehiculo_ingreso?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .tipo_visita.toLowerCase()?.includes(searchedVal.toLowerCase())
    });
    setEntradasConjunto(filteredRows);
    setPage(0);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#051e34",
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  const confir = () => {
    setOpen(false);
    setLoading(true);
    if (registro) {
      axios.get(urlRequest+'api/bitacora_digital/'+user.ConjuntoUidResidencia+'/'+registro+'/insertar_hora_salida/')
          .then(res => {
            if(res.status == 200){
             setLoading(false)
            }
          })
    }
    getEntradasConjunto();
  };

  function handleUpdate(event) {
    setOpen(true);
    setRegistro(event);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const getDiferenciaHoras = (hora,tiempoSalida) => {
    
    if(tiempoSalida != null){
      hora = getHoraEntrada(hora);
      var horaSalida = moment(hora,"DD-MM-YYYY").add(parseFloat(tiempoSalida),'hours');
      var horaActual = moment(new Date());      
      var diferencia = moment.duration(horaSalida.diff(horaActual)).asMinutes();
        return (
          <div className={diferencia <= 0 ? classes.estadoerror : classes.estadook}>
            {diferencia <= 0 ?
                diferencia > -60? "Tiempo Excedido en " + parseInt(diferencia - (diferencia*2)) +  " min"
                     : "Tiempo Excedido en " + parseInt((diferencia - (diferencia*2))/60) + " horas"
                :diferencia< 60? parseInt(diferencia)+" Min restantes":parseInt(diferencia/60)+" Horas restantes" }
          </div>
        );
    }else {
      return ("tiempo no definido")
    }
  }

  const getHoraEntrada = (hora_entrada) => {
    let date = Date.parse(hora_entrada);
    date = new Date(date);
    return date;
  }

  const getdiferenciaHoras = (hora,tiempoSalida) => {
    hora = getHoraEntrada(hora);
    if (tiempoSalida === null){
      tiempoSalida = 1000
    }
    var horaSalida = moment(hora,"DD-MM-YYYY").add(parseFloat(tiempoSalida),'hours');
    var horaActual = moment(new Date());
    var diferencia = moment.duration(horaSalida.diff(horaActual)).asMinutes();
    //console.log(diferencia)
    return diferencia;
  }

  const getEntradasConjunto = React.useCallback(() => {
    try {
      axios.get(urlRequest+'api/bitacora_digital/'+user.ConjuntoUidResidencia+'/')
          .then(res => {
            //console.log(res.data)
            let array = res.data.sort((a,b)=>getdiferenciaHoras(a.hora_entrada,a.tiempo_estimado_salida ) - getdiferenciaHoras(b.hora_entrada,b.tiempo_estimado_salida));
            //console.log(array)
            setEntradasConjunto( array)
            setfilterEntradas(array)
          })
    } catch (e) {
      console.log(e)
    }
  }, [user.ConjuntoUidResidencia]);

  React.useEffect(() => {
    getEntradasConjunto();
    //setInterval(getEntradasConjunto, 5000);
  }, [getEntradasConjunto]);

  return (
    loading?(
      <LoadingData />
    ):(
    <Paper className={classes.root}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Registrar salida
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas registrar la salida?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="danger">
            Cancelar
          </Button>
          <Button onClick={confir} color="warning">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Box mt={2}>
      <center>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <h1>Entradas pendientes de salida</h1>
          </Grid>
        </Grid>
      </center>
      </Box>
      {entradasConjunto ?(
      <Box mt ={2}> 
      <SearchBar
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
      />    
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <StyledTableCell align="center" key={index}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
              {entradasConjunto
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <StyledTableRow hover tabIndex={-1} key={index}>
                        <StyledTableCell align="center">
                          {row.cedula_persona_ingreso}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.nombre_persona_ingreso + " "+ row.apellido_persona_ingreso}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.casa_destino}-{row.nombre_destino} {row.apellido_destino}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.placa_vehiculo_ingreso?(row.placa_vehiculo_ingreso + "\n" + row.color_vehiculo_ingreso):("Sin vehículo")}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {getHoraEntrada(row.hora_entrada).toLocaleString()}
                        </StyledTableCell>
                        {<StyledTableCell align="center">
                        {getDiferenciaHoras(row.hora_entrada,row.tiempo_estimado_salida)}
                        </StyledTableCell>}
                        <StyledTableCell align="center">
                        <IconButton aria-label="Registrar salida" onClick = {() => 
                          
                          handleUpdate(row.id)
                        
                          }>
                          
                            <ExitToAppIcon />
                        </IconButton>
                        </StyledTableCell>                  
                      </StyledTableRow>
                    );
                  })}
            
          </TableBody>
        </Table>
      </TableContainer>
      
      </Box>
      ):(
        <center>
          <NoInfo/>
        </center>  
      )}
      <TablePagination
        rowsPerPageOptions={[5, 25, 100]}
        component="div"
        count={entradasConjunto.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    )
  );
};
export default ListaEntradasPendientes;
