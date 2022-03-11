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
import NewandEdit from "./New/NewandEdit";
import NoInfo from "../../../components/Common/NoInfo";
import * as FirestoreService from "./services/firestore";
import {Box, Button,} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LoadingData from "src/components/Common/LoadingData";
import DeleteIcon from "@material-ui/icons/Delete";
import { Tooltip, IconButton } from "@material-ui/core";
import ReactTooltip from 'react-tooltip';
import { dangerBoxShadow } from "src/assets/jss/material-dashboard-react";
import { useParams } from "react-router-dom";
const Swal = require("sweetalert2");
import BuildIcon from '@material-ui/icons/Build';
const Dashboard = () => {
  const { threadKey } = useParams();
  const classes = useStyles();
  const [usuario, setUsuarios] = React.useState([]);
  const [usuario1, setUsuarios1] = React.useState([]);
  const [usuario2, setUsuarios2] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
 
  const columns = [
    { id: "fechainicio", label: "Fecha de registro" },
    { id: "responsable", label: "Responsable del mantenimiento" },
    { id: "descripcion", label: "Descripción" },
    { id: "fechafuturo", label: "Proximo Mantenimiento" },
    { id: "observaciones", label: "Observaciones"},
    { id: "acciones", label: "Acciones" },
  ];
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [elm, setElm] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { settings } = useSettings();
 

// document.write(fecha);
const mostratAlerta=()=>{
  var fecha = new Date();
  var dia = fecha.getDate();
  var mes = fecha.getMonth()+1;
  var anio = fecha.getFullYear();
  var n=28;
  var vfecha=""
  var smdia = "";
  var smmes = "";
  var smanio = "";
  var idia=0;
  var imes=0;
  var ianio=0;
   FirestoreService.getUserByConjunto(
    {
      next: (querySnapshot) => {
        const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
        setUsuarios2(Items);
      },
    },
 
    );
    usuario2.forEach(document=>{
       vfecha = document.data().ManFuturo;
    })
    var anio0 = vfecha.charAt(0);
    var anio1 = vfecha.charAt(1);
    var anio2 = vfecha.charAt(2);
    var anio3 = vfecha.charAt(3);
    var aler = 0;
    smanio = anio0+anio1+anio2+anio3;
    ianio = parseInt(smanio);
    var mes0 = vfecha.charAt(5);
    var mes1 = vfecha.charAt(6);
    smmes = mes0+mes1;
    imes = parseInt(smmes);
    var dia0 = vfecha.charAt(8);
    var dia1 = vfecha.charAt(9);
    smdia = dia0+dia1;
    idia = parseInt(smdia);
    
    if(anio>ianio){
      swal({
        title: "Existen mantenimientos pendientes",
        //text: "",
        icon: "warning",
        button: "Detalles",
        timer: "5000"
      },
      );
     }else if(anio==ianio){
      if(mes>=imes){
        if(dia>idia){
          swal({
            title: "Existen mantenimientos pendientes",
            //text: "",
            icon: "warning",
            button: "Detalles",
            timer: "5000"
          },
          );
        }
      }
     }
 
}
  const handleChangePage = (event, newPage) => {
    
    setPage(newPage);
  
  };
  const handleClose = () => {
    setOpen(false);
    
  };
  const confir = () => {
    
    if (elm) {
      
      FirestoreService.deleteSplashId(elm,settings.idConjunto).then((docRef) => {
        setOpen(false);
      });
    }
  
  
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

  const getConjuntoById = React.useCallback(() => {

    try {
      FirestoreService.getUserByConjunto2(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setUsuarios1(Items);
          },
        },
        settings.idConjunto
        );
        setLoading(false)
    } catch (e) { }

    try {
      FirestoreService.getUserByConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setUsuarios(Items);
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
  function deleteConjuntoById(event) {
    setOpen(true);
    setElm(event);
  }
  return (
    loading?(
      <LoadingData /> 
    
    ):(
      <div>

        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Eliminar
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estas seguro que quieres eliminar?
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
    <Paper className={classes.root}>
    <NewandEdit info={threadKey} data={null} />
      <Box mt={2} >
      <center> 
        <Grid container spacing={1}>
          <Grid item xs={12} lg={4}  >
           
          </Grid>
        </Grid>
      </center>
      </Box>
      {usuario ?(
      <Box mt ={2}>  
      <h3>Mantenimiento Expirado</h3>
      <TableContainer component={Paper}>
        <Table className={classes.table}  size='small' aria-label="customized table">
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
            {usuario
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <StyledTableRow hover tabIndex={-1} key={index}>
                    <StyledTableCell align="center">
                      {row.data().Fechainicio}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Responsable}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Mantenimiento}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                    <div className={classes.estadoerror}>
                                {row.data().ManFuturo}
                    </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Observaciones}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Grid
                          container
                          spacing={0}
                          alignItems="center"
                          justify="center"
                        >
                          <Grid item xs={6} lg={3}>
                            <Tooltip title="Eliminar">
                              <IconButton
                                aria-label="eliminar"
                                onClick={() => deleteConjuntoById(row.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          <Grid >
                          <NewandEdit
                            aria-label="editar"
                            info={threadKey}
                            data={row}  />
                          
                        </Grid>
                        </Grid>
                      </StyledTableCell>
                  </StyledTableRow>
                )
              }
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

{usuario ?(
      <Box mt ={2}>  
      <h3>Futuro Mantenimiento</h3>
      <TableContainer component={Paper}>
        <Table className={classes.table}  size='small' aria-label="customized table">
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
            {usuario1
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <StyledTableRow hover tabIndex={-1} key={index}>
                    <StyledTableCell align="center">
                      {row.data().Fechainicio}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Responsable}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Mantenimiento}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                    <div className={classes.estadook}>
                                {row.data().ManFuturo}
                    </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Observaciones}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Grid
                          container
                          spacing={0}
                          alignItems="center"
                          justify="center"
                        >
                          <Grid item xs={6} lg={3}>
                            <Tooltip title="Eliminar">
                              <IconButton
                                aria-label="eliminar"
                                onClick={() => deleteConjuntoById(row.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          <Grid >
                          <NewandEdit
                            aria-label="editar"
                            info={threadKey}
                            data={row}  />
                          
                        </Grid>
                        </Grid>
                      </StyledTableCell>
                  </StyledTableRow>
                )
              }
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
      <TablePagination TablePagination
      labelRowsPerPage={"Filas por página"}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={usuario1.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
    </div>
    )
  );
};
export default Dashboard;
