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
import { Tooltip, IconButton, CircularProgress } from "@material-ui/core";
import * as FirestoreService from "./services/firestore";
import NewAndEdit from "./NewAndEdit/NewAndEdit";
import Button from "../../../components/CustomButtons/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CardHeader, Grid, Box } from "@material-ui/core";
import moment from "moment";
import numeral from "numeral";
import useSettings from "../../../contextapi/hooks/useSettings";
import RateReview from "@material-ui/icons/RateReview";
import { Link } from "react-router-dom";
import NoInfo from "../../../components/Common/NoInfo";
import LoadingData from "../../../components/Common/LoadingData";

const Dashboard = () => {
  const classes = useStyles();
  const [usuario, setUsuarios] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const { settings } = useSettings();

  const columns = [
    { id: "name", label: "Fecha de corte" },
    { id: "correo", label: "Caja o Banco" },
    { id: "apellido", label: "Descripción" },
    { id: "acciones", label: "Saldo mi casita" },
    { id: "acciones", label: "Saldo real en Banco" },
    { id: "acciones", label: "Estado" },
    { id: "acciones", label: "Acciones" },
  ];
  const [open, setOpen] = React.useState(false);
  const [elm, setElm] = React.useState(null);
  const [fechavalidate, setFechavalidate] = React.useState(
    moment(new Date("2000-01-01")).format("YYYY-MM-DD")
  );
  const [categories, setCategories] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const getCuentas = () => {
    try {
      FirestoreService.getCuentasById(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            if (Items.length > 0) {
              let gt = [];
              Items.forEach((element) => {
                FirestoreService.getConciliacionByCategoria(
                  {
                    next: (querySnapshot) => {
                      const Items = querySnapshot.docs.map(
                        (docSnapshot) => docSnapshot
                      );
                      if (Items.length > 0) {
                        let data = {
                          IdCuenta: Items[0].data().IdCuenta,
                          FechaCorte: Items[0].data().FechaCorte,
                        };
                        gt.push(data);
                        setCategories(gt);
                      } else {
                        let data = {
                          IdCuenta: element.id,
                          FechaCorte: fechavalidate,
                        };
                        gt.push(data);
                        setCategories(gt);
                      }
                    },
                  },
                  settings.idConjunto,
                  element.id
                );
              });
            }
          },
        },
        settings.idConjunto
      );
    } catch (e) {}
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
      FirestoreService.getConciliacionesByConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            getCuentas();
            if (Items.length > 0) {
            } else {
              setFechavalidate(
                moment(new Date("2000-01-01")).format("YYYY-MM-DD")
              );
            }
            setUsuarios(Items);
            setLoading(false);
          },
        },
        settings.idConjunto
      );
    } catch (e) {}
  }, [settings.idConjunto]);
  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);
  function handleLike(event) {
    setOpen(true);
    setElm(event);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const confir = () => {
    setOpen(false);
    setLoading(true);
    

    if (elm) {
      FirestoreService.deleteConciliacionByConjunto(
        settings.idConjunto,
        elm
        ).then((docRef) => {
          getConjuntoById();
          setLoading(false);
        });
    }
  };
  function createMarkup(srt) {
    return {
      __html: srt,
    };
  }
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

      <CardHeader title={<h1>Conciliaciones</h1>} />
      <NewAndEdit
        fechavalidate={fechavalidate}
        data={null}
        categories={categories}
      />
      {loading ? (
        <LoadingData />
      ) : (
        <>
          {usuario.length > 0 ? (
            <>
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
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <StyledTableRow hover tabIndex={-1} key={index}>
                            <StyledTableCell align="center">
                              {moment(row.data().FechaCorte).format(
                                "DD/MM/YYYY"
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row.data().Cuenta}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <div
                                dangerouslySetInnerHTML={createMarkup(
                                  row.data().Detalle
                                )}
                              />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {}${" "}
                              {numeral(
                                row.data().Ingreso - row.data().Egreso
                              ).format(`${"USD"}0,0.00`)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {}$
                              {numeral(row.data().Saldo).format(
                                `${"USD"}0,0.00`
                              )}
                            </StyledTableCell>

                            <StyledTableCell align="center">
                              <div className={row.data().Conciliado ? classes.estadook : classes.estadoerror}>
                                {row.data().Conciliado ? "CONCILIADO" : "PENDIENTE"}
                              </div>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Grid
                                container
                                spacing={0}
                                alignItems="center"
                              >
                                {index === 0 ? (
                                  <Grid item xs={6} lg={3}>
                                    <Tooltip title="Eliminar">
                                      <IconButton
                                        aria-label="eliminar"
                                        onClick={() => handleLike(row.id)}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                ) : null}

                                <Grid item xs={6} lg={3}>
                                    <NewAndEdit
                                      fechavalidate={fechavalidate}
                                      data={row}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                  <Tooltip title="Detalle">
                                    <Link
                                      to={
                                        "/administrador/conciliaciones/detalle/" +
                                        row.id
                                      }
                                    >
                                      <IconButton aria-label="Detalle">
                                        <RateReview />
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
              labelRowsPerPage={"Filas por página"}
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={usuario.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            <NoInfo />
          )}
        </>
      )}
    </Paper>
  );
};
export default Dashboard;
