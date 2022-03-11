import React from "react";
import useStyles from "./useStyles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import { Grid, ListItem, Avatar, Button} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import useAuth from "../../../../contextapi/hooks/useAuth";
import Box from '@material-ui/core/Box';
import NoInfo from "../../../../components/Common/NoInfo";
import LoadingData from "../../../../components/Common/LoadingData";
import SearchBar from "material-ui-search-bar";
import Dialogs from "./ImagenyDetalles";
import axios from "axios";
import { useState } from "react";
import MomentUtils from "@date-io/moment";
//import DatePicker from "react-datepicker";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { DatePicker,MuiPickersUtilsProvider} from "@material-ui/pickers";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import es from 'date-fns/locale/es';
import "moment/locale/es";
import EventBusyIcon from '@material-ui/icons/EventBusy';


const ListarBitacoraDigital = () => {
  
  const classes = useStyles();
  const [bitacoraDigital, setBitacoraDigital] = React.useState([]);
  const [filterfecha, setBitacoraDigital1] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { user } = useAuth();
  const columns = [
    { id: "cedula", label: "Cédula" },
    { id: "nombre", label: "Nombre y Apellido" },
    { id: "casa", label: "Lugar de destino" },
    { id: "placa", label: "Vehículo" },
    { id: "fecha", label: "Fecha y Hora de entrada" },
    { id: "horaentrada", label: "Fecha y Hora de salida" },
    { id: "tipo", label: "Tipo Entrada" },
    { id: "imagenes", label: "Imagenes" },
    { id: "observaciones", label: "Observaciones" },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = React.useState("");
  const [filterBitacora, setfilterBitacora] = React.useState([]);
  const urlRequest = "https://micasitabackend.herokuapp.com/";
  //const urlRequest = "http://127.0.0.1:8000/";
    



    const [startdesde, setStartDesde] = useState( new Date(moment().subtract(4,"days")));
    const [starthasta, setStartHasta] = useState(new Date());

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function limpiarfecha(){
    setStartDesde(null)
    setStartHasta(null)
    setfilterBitacora(filterfecha)
    setBitacoraDigital(filterfecha);
    
  }

  function buscarfecha(){

    let fecha2 = moment(starthasta).format('YYYY-MM-DD')
                  fecha2 = fecha2+"T23:59:59"
                  setStartHasta(starthasta)
                  setfilterBitacora(filterfecha)
                  setBitacoraDigital(filterfecha);
                  let fecha1 = moment(startdesde).format('YYYY-MM-DD')
                  const filteredRows = (filterfecha.filter((row) =>(row.hora_entrada >= fecha1) && (row.hora_entrada <= fecha2)));
                  setBitacoraDigital(filteredRows);
                  setfilterBitacora(filteredRows);
                  setPage(0);
  }

  const requestSearch = (searchedVal) => {
    searchedVal.toString()
    console.log(searchedVal)
    const filteredRows = filterBitacora.filter((row) => {
      return row
      .nombre_persona_ingreso?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .apellido_persona_ingreso?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .casa_destino?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .nombre_destino?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .apellido_destino?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .cedula_persona_ingreso?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .color_vehiculo_ingreso?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .placa_vehiculo_ingreso?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .tipo_visita?.toLowerCase().includes(searchedVal.toLowerCase()) || row
      .hora_entrada?.toLowerCase().includes(searchedVal.toLowerCase()) 
      ;
    });
    setBitacoraDigital(filteredRows);
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

  const getFechayHora = (hora) => {
    let date = Date.parse(hora);
    date = new Date(date);
    return date;
  }

  const getBitacora = React.useCallback(() => {
    setLoading(true);
    try {
      axios.get(urlRequest+'api/bitacora_digital_lista/'+user.ConjuntoUidResidencia+'/')
          .then(res => {
            //console.log(res.data)
           // setBitacoraDigital(res.data);
            setBitacoraDigital1(res.data);
            //setfilterBitacora(res.data);


            let fecha2 = moment(starthasta).format('YYYY-MM-DD')
            fecha2 = fecha2+"T23:59:59";
            let fecha1 = moment(startdesde).format('YYYY-MM-DD');
            fecha1= fecha1
            console.log(fecha1)
            console.log(fecha2)
            
            const filteredRows = (res.data.filter((row) =>(row.hora_entrada >= fecha1) && (row.hora_entrada <= fecha2)));
            console.log(filteredRows)
            setBitacoraDigital(filteredRows);
            setfilterBitacora(filteredRows);
            setPage(0);


            setLoading(false);
          })
    } catch (e) {
      console.log(e)
    }
  }, [user.ConjuntoUidResidencia]);

  const filtrobitacora = React.useCallback(() => {
  
    try {
      axios.get(urlRequest+'api/bitacora_digital_lista/'+user.ConjuntoUidResidencia+'/')
          .then(res => {
            //console.log(res.data)
            setfilterBitacora(res.data)
            
            
          })
    } catch (e) {
      console.log(e)
    }
  }, [user.ConjuntoUidResidencia]);

  React.useEffect(() => {
    getBitacora()



  }, [getBitacora]);


  return (
    loading?(
      <LoadingData />
    ):(
    <Paper className={classes.root}>
      <Box mt={2}>
      <center>
        <Grid container spacing={1}>
          <Grid item xs={12}>
          <div style={{ float: "Center", marginTop:-30 }}>
            <h1>Bitácora digital</h1>
            <br></br>
            </div>
          </Grid>
        </Grid>
        <div style={{ float: "right" }}>
				<ListItem>
					<Avatar>
						<img
							src="/assets/img/excel.png"
							alt="imagen descriptiva de carga de archivos excel"
							width="50px;"
						/>
					</Avatar>
					<ReactHTMLTableToExcel
						id="export_file"
						className={"btn btn-success"}
						table="table_bitacora"
						filename="Bitácora digital"
						sheet="tablexls"
						buttonText="Exportar"
					/>
				</ListItem>
			</div>
      </center>
      </Box>
      {bitacoraDigital  ?(
      <Box mt ={2}> 
        <Box>  
          <div style={{ float: "left" ,  marginLeft:20  }}>
            <MuiPickersUtilsProvider  locale="es" utils={MomentUtils}>
              <DatePicker  
                label='Desde'
                inputVariant="outlined"
                variant="inline"
                format="DD-MM-YYYY"
                disableToolbar
                value={startdesde}
                selected={startdesde} 
                maxDate={new Date()}
                onChange={setStartDesde}
              /> 
            </MuiPickersUtilsProvider>
          </div>
          <div style={{float: "left", marginLeft:30}}>
            {startdesde && (<> 
              <MuiPickersUtilsProvider  locale="es" utils={MomentUtils}>
                <DatePicker
                  className={classes.datePicker}
                  label='Hasta'
                  inputVariant="outlined"
                  variant="inline"
                  format="DD-MM-YYYY"
                  disableToolbar
                  value={starthasta}
                  selected={starthasta} 
                  minDate={new Date(startdesde)}
                  maxDate={new Date()}
                  onChange={setStartHasta}
                />
              </MuiPickersUtilsProvider>
              </>)
            }
          </div>
          <div style={{ float: "left", marginTop:-20, marginLeft:10 }}>
            {starthasta && (<><IconButton color="primary" onClick={() => { buscarfecha()}}>
              <EventAvailableIcon   /><h6 >Buscar</h6>
              </IconButton>
              
              </>)
            }
          </div>
          <div style={{ float: "left", marginTop:20, marginLeft:-95 }}>
            {starthasta && (<><IconButton color="secondary"  onClick={() => { limpiarfecha()}}>
              <EventBusyIcon   /><h6>Limpiar</h6>
              </IconButton>
              </>)
            }
          </div>
          <br></br>
          <br></br>
          <br></br>
        </Box>
        <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        />
        <TableContainer component={Paper}>
          <Table className={classes.table} id='table_bitacora' aria-label="customized table">
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
              {bitacoraDigital 
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <StyledTableRow hover tabIndex={-1} key={index}>
                        <StyledTableCell align="center">
                          {row.cedula_persona_ingreso}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.nombre_persona_ingreso + " " +row.apellido_persona_ingreso}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.casa_destino}-{row.nombre_destino} {row.apellido_destino}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.placa_vehiculo_ingreso?(row.placa_vehiculo_ingreso + "\n" +row.color_vehiculo_ingreso):("Sin vehículo")}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {
                          
                          moment(row.hora_entrada).format('DD-MM-YYYY HH:mm')
                          }
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.hora_salida? moment(row.hora_salida).format('DD-MM-YYYY HH:mm') : "No se ha registrado su salida"}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.tipo_visita}
                        </StyledTableCell> 
                        <StyledTableCell align="center">
                        <Dialogs
                          ced={row.imagen_cedula}
                          face={row.imagen_rostro}
                          car={row.imagen_vehiculo}
                        /> 
                        </StyledTableCell>
                        <StyledTableCell align="center">
                        <Dialogs
                          obs = {"No se ha agregado ninguna observación"}
                        />
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
        labelRowsPerPage={"Filas por página"}
        rowsPerPageOptions={[5, 25, 100]}
        component="div"
        count={bitacoraDigital.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    )
  );
};
export default ListarBitacoraDigital;
