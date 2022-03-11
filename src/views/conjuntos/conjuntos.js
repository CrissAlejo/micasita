import React from "react";
import * as FirestoreService from "./services/firestore";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { Grid } from "@material-ui/core";

import Button from "../../components/CustomButtons/Button";
import useStyles from "./useStyles";
import NewAndEdit from "./NewAndEdit/NewAndEdit";
import DeleteIcon from "@material-ui/icons/Delete";
import VerifiedUser from "@material-ui/icons/PeopleAltOutlined";
import Areascomunales from "@material-ui/icons/AccountBalance";
import StorageIcon from '@material-ui/icons/Storage';

import { Tooltip, IconButton } from "@material-ui/core";
// import AddUsersConjunto from "./AddUsersConjunto/AddUsersConjunto";
// import LoadingTgLabs from "../../components/Common/LoadingTgLabs";
// import Button from "../../components/CustomButtons/Button";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function Conjuntos(props) {
  const [conjuntos, setConjuntos] = React.useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [elm, setElm] = React.useState(null);

  const columns = [
    { id: "name", label: "Nombre" },
    { id: "ruc", label: "RUC" },
    { id: "imagen", label: "Imagen" },
    { id: "number", label: "Número de parqueaderos" },
    { id: "recidente", label: "Número de residentes" },
    { id: "acciones", label: "Acciones" },
    { id: "otros", label: "Otros" },
  ];
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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

  const handleClose = () => {
    setOpen(false);
  };
  const confir = () => {
    if (elm) {
      FirestoreService.deleteConjuntoById(elm).then((docRef) => {
        setOpen(false);
      });
    }
  };

  React.useEffect(() => {
    FirestoreService.getAllConjuntos({
      next: (querySnapshot) => {
        const updatedGroceryItems = querySnapshot.docs.map(
          (docSnapshot) => docSnapshot
        );
        setConjuntos(updatedGroceryItems);
      },
    });
  }, []);
  function deleteConjuntoById(event) {
    setOpen(true);
    setElm(event);
  }

  return (
    <div>
      <NewAndEdit data={null} />
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
              {conjuntos
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <StyledTableRow hover tabIndex={-1} key={index}>
                      <StyledTableCell align="center">
                        {row.data().Nombre}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.data().Ruc}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {" "}
                        <img
                          src={row.data().Imagen}
                          alt="logo"
                          width="100"
                          height="100"
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.data().NumParqueaderos}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.data().NumResidentes}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Grid
                          container
                          spacing={0}
                          alignItems="center"
                          justify="center"
                        >
                          <NewAndEdit data={row} />
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
                        {/* <AddUsersConjunto /> */}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Grid
                          container
                          spacing={0}
                          alignItems="center"
                          justify="center"
                        >
                          <Grid item xs={6} lg={3}>
                            <Tooltip title="Usuarios">
                              <Link
                                to={"/superAdmin/conjuntos/newuser/" + row.id}
                              >
                                <IconButton aria-label="Usuarios">
                                  <VerifiedUser />
                                </IconButton>
                              </Link>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={6} lg={3}>
                            <Tooltip title="Áreas comunales">
                              <Link
                                to={"/superAdmin/conjuntos/areas/" + row.id}
                              >
                                <IconButton aria-label="Áreas comunales">
                                  <Areascomunales />
                                </IconButton>
                              </Link>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={6} lg={3}>
                            <Tooltip title="Ingresos y egresos">
                              <Link
                                to={
                                  "/superAdmin/conjuntos/cargardatos/" +
                                  row.id
                                }
                              >
                                <IconButton aria-label="Datos Iniciales">
                                  <StorageIcon/>
                                </IconButton>
                              </Link>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={conjuntos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Conjuntos;
