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
import useSettings from "../../../contextapi/hooks/useSettings";
import New from "./New/New";
import NoInfo from "../../../components/Common/NoInfo";
import GenerarExpensas from "./Expensas/GenerarExpensas";
import GenerarExpensasExtraordinarias from "./Expensas/GenerarExpensasExtraordinarias";
import * as FirestoreService from "./services/firestore";
import DetalleUsuario from "./DetalleUsuario/DetalleUsuario";
import Box from '@material-ui/core/Box';
import {Button} from '@material-ui/core'
import SearchBar from "material-ui-search-bar";
import LoadingData from "src/components/Common/LoadingData";
import { nullFormat } from "numeral";

const Dashboard = () => {
  const classes = useStyles();
  const [usuario, setUsuarios] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  const { settings } = useSettings();
  const columns = [
    { id: "name", label: "Nombre" },
    { id: "apellido", label: "Apellido" },
    { id: "cedula", label: "Cedula" },
    { id: "correo", label: "Número de Casa" },
    { id: "acciones", label: "Acciones" },
  ];
  
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
   
    setPage(newPage);
  };
  const [searched, setSearched] = React.useState("");
  const [filterUsuario, setfilterUsuario] = React.useState([]);
  

  const requestSearch = (searchedVal) => {
   
    const filteredRows = filterUsuario.filter((row) => {
      return row.data()
        .Nombre.toLowerCase().includes(searchedVal.toLowerCase()) || row.data()
        .Casa.toString().toLowerCase().includes(searchedVal.toLowerCase()) || row.data()
        .Apellido.toLowerCase().includes(searchedVal.toLowerCase()) || row.data()
        .Cedula.toString().toLowerCase().includes(searchedVal.toLowerCase())
      ;
    }
    );
    setUsuarios(filteredRows);
    setPage(0);
  };
 
  const handleChangeRowsPerPage = (event) => {
    
    setRowsPerPage(+event.target.value);
    setPage(0);
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
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };
  const borrarSearch = () => {
    setSearched("");
    requestSearch(searched);
  };
  const getConjuntoById = React.useCallback(() => {
    try {
      FirestoreService.getUserByConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setUsuarios(Items);
            setfilterUsuario(Items);
          },
        },
        settings.idConjunto
        );
        setLoading(false)
    } catch (e) { }
  }, [settings.idConjunto]);
  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);

  return (
    
    loading?(
      <LoadingData onLoad={() => borrarSearch()} /> 
    ):(
    <Paper  className={classes.root}>
      <Box mt={2} >
      <center>
       
        <Grid container spacing={1}>
          <Grid item xs={12} lg={4}  onFocus={() => borrarSearch()}>
            <New />
          </Grid>
          <Grid item xs={12} lg={4} onFocus={() => borrarSearch()}>
            <GenerarExpensas />
          </Grid>
          <Grid item xs={12} lg={4} onFocus={() => borrarSearch()}>
           <GenerarExpensasExtraordinarias/>
          </Grid>
        </Grid>
      </center>
      
      </Box>
      {usuario ?(
      <Box mt ={2}>  
     
      <SearchBar
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
      />   
      <TableContainer component={Paper}>
        <Table className={classes.table} size='small' aria-label="customized table">
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
            {
                (usuario && usuario
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
                      {row.data().Cedula}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Casa}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {""}
                      <DetalleUsuario info={row} />
                    </StyledTableCell>
                    </StyledTableRow>
                  );
                })
                
                )
              }
                  
               
         
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
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={usuario.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    )
  );
};
export default Dashboard;
