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
import useAuth from "../../../contextapi/hooks/useAuth";
import * as FirestoreService from "./services/firestore";
import Box from '@material-ui/core/Box';
import NoInfo from "../../../components/Common/NoInfo";
import LoadingData from "../../../components/Common/LoadingData";
import SearchBar from "material-ui-search-bar";

const ListarVisitasAnticipadas = () => {
  const classes = useStyles();
  const [visitasAnticipadas, setvisitasAnticipadas] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { user } = useAuth();
  const columns = [
    { id: "nombre", label: "Nombre" },
    { id: "apellido", label: "Apellido" },
    { id: "casa", label: "Lugar de destino" },
    { id: "cedula", label: "Cédula" },
    { id: "placa", label: "Placa vehículo" },
    { id: "color", label: "Color vehículo" },
    { id: "horallegada", label: "Hora estimada de llegada" },
    { id: "tiemposalida", label: "Tiempo estimado de salida" },
    { id: "tipo", label: "Tipo Entrada" },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = React.useState("");
  const [filterVisitas, setfilterVisitas] = React.useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = filterVisitas.filter((row) => {
      return row.data().Nombre.toLowerCase().includes(searchedVal.toLowerCase())|| row.data()
      .Apellido.toLowerCase().includes(searchedVal.toLowerCase()) || row.data()
      .Cedula.toLowerCase().includes(searchedVal.toLowerCase()) || row.data()
      .ColorVehiculo.toLowerCase().includes(searchedVal.toLowerCase()) || row.data()
      .PlacaVehiculo.toLowerCase().includes(searchedVal.toLowerCase()) || row.data()
      .CasaDestino.toLowerCase().includes(searchedVal.toLowerCase()) || row.data()
      .NombreDestino.toLowerCase().includes(searchedVal.toLowerCase()) || row.data()
      .ApellidoDestino.toLowerCase().includes(searchedVal.toLowerCase()) || row.data()
      .TipoVisita.toLowerCase().includes(searchedVal.toLowerCase()) 
      ;
    });
    setvisitasAnticipadas(filteredRows);
    setPage(0)
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

  const getVisitasAnticipadas = React.useCallback(() => {
    setLoading(true);
    try {
      FirestoreService.getVisitasAnticipadas(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setvisitasAnticipadas(Items);
            setfilterVisitas(Items);
            setLoading(false);
          },
        },
        user.ConjuntoUidResidencia
      );
     
    } catch (e) { }
  }, [user.ConjuntoUidResidencia]);

  React.useEffect(() => {
    getVisitasAnticipadas();
  }, [getVisitasAnticipadas]);


  return (
    loading?(
      <LoadingData />
    ):(
    <Paper className={classes.root}>
      <Box mt={2}>
      <center>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <h1>Visitas anticipadas para hoy</h1>
          </Grid>
        </Grid>
      </center>
      </Box>
      {visitasAnticipadas ?(
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
              {visitasAnticipadas
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <StyledTableRow hover tabIndex={-1} key={index}>   
                    <StyledTableCell align="center">
                      {row.data().Nombre}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Apellido}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().CasaDestino}-{row.data().NombreDestino} {row.data().ApellidoDestino}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Cedula}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().PlacaVehiculo?(row.data().PlacaVehiculo):("Sin vehículo")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().ColorVehiculo?(row.data().ColorVehiculo):("Sin vehículo")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().HoraEstimadaLlegada.toDate().toLocaleTimeString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().TiempoEstimadoSalida}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().TipoVisita}
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
        count={visitasAnticipadas.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    )
  );
};
export default ListarVisitasAnticipadas;
