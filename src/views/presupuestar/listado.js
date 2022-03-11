import React from "react";
import useStyles from "./useStyles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { Tooltip, IconButton } from "@material-ui/core";
import * as FirestoreService from "./services/firestore";
import { CircularProgress, Box, Grid } from "@material-ui/core";
import useSettings from "../../contextapi/hooks/useSettings";
import Button from "../../components/CustomButtons/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PenIcon from "@material-ui/icons/DoneAll";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import NoInfo from "../../components/Common/NoInfo";

const Listado = () => {
  const classes = useStyles();
  const [usuario, setUsuarios] = React.useState([]);
  const { settings } = useSettings();
  const columns = [
    { id: "nombre", label: "Descripción" },
    { id: "anio", label: "Año" },
    { id: "fecha", label: "Fecha" },
    { id: "acciones", label: "Acciones" },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [elm, setElm] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

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

  const getConjuntoById = React.useCallback(() => {
    try {
      FirestoreService.getPresupuestoByConjunto(settings.idConjunto).then(
        (querySnapshot) => {
          const Items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            Nombre: doc.data().Nombre,
            Anio: doc.data().Anio,
            Fecha: doc.data().Fecha.toDate().toDateString(),
            Datos: JSON.parse(doc.data().Datos),
          }));
          setUsuarios(Items);
          setLoading(false);
        }
      );
    } catch (e) {}
  }, [settings.idConjunto]);

  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);



  function handleDelete(item) {
    setOpen(true);
    setElm(item);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const confir = () => {
    setOpen(false);
    setLoading(true);

    if (elm) {
      FirestoreService.deletePresupuesto(settings.idConjunto, elm).then(
        (docRef) => {
          getConjuntoById();
          setLoading(false);
        }
      );
    }
  };

  return (
    <Paper className={classes.root}>
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
      <Button className={classes.Button} color="primary">
        <Link className={classes.Link} to={"/administrador/presupuestar/new"}>
          Nuevo presupuesto
        </Link>
      </Button>
      {!loading ? (
        <>
        {usuario.length > 0 ? (
          <view>
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
                {usuario
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <StyledTableRow hover tabIndex={-1} key={index}>
                        <StyledTableCell align="center">
                          {row.Nombre}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.Anio}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.Fecha}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Grid container alignItems="center" justify="center">
                            <Grid item xs={6} lg={2}>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  name={row.id}
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleDelete(row.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={6} lg={2}>
                              <Tooltip title="Ver">
                                <Link
                                  to={
                                    "/administrador/presupuestar/view/" + row.id
                                  }
                                >
                                  <IconButton aria-label="ver">
                                    <VisibilityIcon />
                                  </IconButton>
                                </Link>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={6} lg={2}>
                              <Tooltip title="Validar">
                                <Link
                                  to={
                                    "/administrador/presupuestar/validar/" + row.id
                                  }
                                >
                                  <IconButton aria-label="editar">
                                    <PenIcon />
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
            count={usuario.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </view>
        ):(
          <NoInfo />
        )}
        </>
      ) : (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};
export default Listado;
