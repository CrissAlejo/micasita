import React from "react";
import useStyles from "./useStyles";
import Paper from "@material-ui/core/Paper";

import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
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
import Mail from "@material-ui/icons/Mail";
import { Tooltip, IconButton } from "@material-ui/core";
import { useParams } from "react-router-dom";
import Consolidado from "../reportes/consolidado";
var ServidorFCM = require('node-gcm');
const Dashboard = () => {
  const { threadKey } = useParams();
  const classes = useStyles();
  const [usuario, setUsuarios] = React.useState([]);
  const [usuario1, setUsuarios1] = React.useState([]);
  const [usuario2, setUsuarios2] = React.useState([]);
  const [usuario3, setUsuarios3] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const columns = [
    { id: "fecha", label: "Inicio" },
    { id: "titulo", label: "Título" },
    { id: "mensaje", label: "Mensaje" },
    { id: "acciones", label: "Acciones" },
  ];
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [elm, setElm] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { settings } = useSettings();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const confir = () => {
    if (elm) {
      FirestoreService.deleteMensaje(elm,settings.idConjunto).then((docRef) => {
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
      FirestoreService.getMensaje(
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
  }, [settings.idConjunto]);
  React.useEffect(() => {
    FirestoreService.get_token(
      {
          next: querySnapshot => {
              const items = querySnapshot.docs.map(docSnapshot => docSnapshot);
              setUsuarios3(items);
          },
      }
  );
    getConjuntoById();
  }, [getConjuntoById]);
  function deleteConjuntoById(event) {
    setOpen(true);
    setElm(event);
  }
  function reenviar(dato1,dato2) {
   console.log(dato1,dato2);
    var ntoken = "";
    var conjunto = "";
    var stokens = "";
    var token = [];
    var rol="";
        FirestoreService.get_token(
            {
                next: querySnapshot => {
                    const items = querySnapshot.docs.map(docSnapshot => docSnapshot);
                    setUsuarios3(items);
                },
            }
        );
    usuario3.forEach(document=>{
    conjunto = document.data().ConjuntoUidResidencia;

        if(conjunto === settings.idConjunto){
          if (JSON.parse(document.data().Rol).residente === true || JSON.parse(document.data().Rol).administrador === true){
          ntoken = document.data().tokens;
            if(ntoken != null ){
           stokens = ""+ntoken;
           rol = document.data().Rol;
           const roles = JSON.stringify(rol)
           console.log(roles);
            if(stokens.indexOf(",")){
                var strArr = stokens.split(',');
                var i=0;
                for(i=0; i < strArr.length; i++)
                token.push(strArr[i]);
            }
        }
        }
      }
    })
    let result = token.filter((item,index)=>{
      return token.indexOf(item) === index;
    })
    var sender = new ServidorFCM.Sender ('AAAAQSgq8kc:APA91bHQmE-lNIrpVPsKXddyaxl4TVnNg-G0zlR8mAB9eKMqpdUZYE7Mi043WJWEXEU_DIydiFgy6jv0VqnmZlJZ8WBBhFKL_2NbYKlQ9QtSuJ4W6QtOMNEBix4SENU-rw6xTMx2VOKC');
    var message = new ServidorFCM.Message({
        date: {
            year: 2021,
            month: 11,
            day: 8,
            hour: 16,
            minutes: 35
            },
        notification: {
            title: dato1,
            body: dato2
        },
        data: {
            your_custom_data_key: 'your_custom_data_value'
        }
    });
    console.log(result);
    sender.send(message, {registrationTokens: result}, function(err, response)
    {
        if (err) console.error(err);
        else console.log(response);
    });
    
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
      <h3>Lista de mensajes</h3>
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
                      {row.data().Fecha}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Titulo}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Mensaje}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                        <Grid
                          container
                          spacing={0}
                          alignItems="right"
                          justify="center"
                        >
                          <Grid>
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
                        <Grid>
                            <Tooltip title="Reenviar">
                              <IconButton
                                aria-label="reenviar"
                                onClick={() => reenviar(row.data().Titulo, row.data().Mensaje)}
                              >
                                <Mail />
                              </IconButton>
                            </Tooltip>
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