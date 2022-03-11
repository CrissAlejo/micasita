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
const Dashboard = () => {
  const classes = useStyles();
  const [usuario, setUsuarios] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { settings } = useSettings();
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const confir = () => {
    if (elm) {
      FirestoreService.deleteSplashId(elm).then((docRef) => {
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
      <Box mt={2} >
      <center> 
        <Grid container spacing={1}>
          <Grid item xs={12} lg={4}  >
            <New />
          </Grid>
        </Grid>
      </center>
      </Box>
      {usuario ?(
      <Box mt ={2}>  
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
                      {row.data().ManFuturo}
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
    </Paper>
    </div>
    )
  );
};
export default Dashboard;
