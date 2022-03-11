import React from "react";
import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  CardHeader,
  CardContent,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import * as FirestoreService from "../services/firestore";
import useSettings from "../../../../contextapi/hooks/useSettings";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import numeral from "numeral";
import moment from "moment";
import Button from "../../../../components/CustomButtons/Button";
import { Tooltip, IconButton } from "@material-ui/core";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSnackbar } from "notistack";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import styles from "../../../../assets/jss/material-dashboard-react/components/buttonStyle.js";
import PagosAndPedidos from "../PagosAndPedidos/PagosAndPedidos";
import "bootstrap/dist/css/bootstrap.min.css";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import useStyles from "./useStyles";
import LoadingData from "src/components/Common/LoadingData";
//const useStyles = makeStyles(styles);
const Pagos = (prop) => {
  const classes = useStyles();
  const { settings } = useSettings();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [usuario, setUsuarios] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [opendelete, setOpendelete] = React.useState(false);
  const [elmDelete, setElmDelete] = React.useState(null);
  const [totaldeuda, setTotaldeuda] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [elm, setElm] = React.useState(null);
  const { enqueueSnackbar } = useSnackbar();
 
  const columns = [
   
    { id: "ProveedorNombre", label: "Proveedor Nombre" },
    { id: "ProveedorTelefono", label: "Proveedor Telefono" },
    { id: "Cantidad", label: "Cantidad" },
    { id: "Costo", label: "Costo" },
    { id: "Plazo", label: "Plazo" },
    { id: "FechaPedido", label: "Fecha Pedido" },
    { id: "Acciones", label: "Acciones" },
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
  const getConjuntoById = React.useCallback(() => {
    try {
      FirestoreService.getPedidos(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            let vars = 0;
            Items.forEach((element) => {
              vars = vars + parseFloat(element.data().Costo);
            });
            setTotaldeuda(vars);
            setUsuarios(Items);
            setLoading(false);
          },
        },
        settings.idConjunto,
        prop.threadKey
      );
    } catch (e) {
      setLoading(false);
    }
  }, [settings.idConjunto]);
  function handleLike(event) {
    setOpen(true);
    setElm(event);
  }
  function handleLikeDelete(event) {
    setOpendelete(true);
    setElmDelete(event);
  }

  const handleClose = () => {
    setOpen(false);
    setOpendelete(false);
  };

  const confir = () => {
    setOpen(false);
    let formulario = elm;
    if (elm) {
      setLoading(true);
      FirestoreService.newEgreso(settings.idConjunto, formulario.data()).then(
        (docRef) => {
          FirestoreService.finPagoPendiente(
            settings.idConjunto,
            formulario.id
          ).then((docRef) => {
            handleClose();
            setLoading(false);
            enqueueSnackbar("Pedido finalizado correctamente", {
              variant: "success",
            });
          });
        }
      );
    }
  };
  const confirdelete = () => {
    if (elmDelete) {
      setLoading(true);
      FirestoreService.deletepago(settings.idConjunto, elmDelete).then(
        (docRef) => {
          handleClose();
          setLoading(false)
          enqueueSnackbar("Pedido eliminado correctamente", {
            variant: "success",
          });
        }
      );
    }
  };

  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);

  if(loading){
    return <LoadingData/>
  }else{
    return (
      <Paper className={classes.rootPage}>
        <Dialog
          open={opendelete}
          onClose={handleClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Confirmar
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Estas seguro que quieres eliminar esta cuenta?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="danger">
              Cancelar
            </Button>
            <Button onClick={confirdelete} color="warning">
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            Confirmar
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Estas seguro que quieres pagar esta cuenta?
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
  
        <Grid container spacing={12} style={{justifyContent: 'space-between'}}>
          <Grid item xs={12} lg={3}>
            <Card>
              <CardHeader title="Total a pagar" />
              <Divider />
              <CardContent>
                <Grid item md={12} xs={12}>
                  <h4>${numeral(totaldeuda).format(`${"USD"}0,0.00`)}</h4>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CardContent>
              <Grid container spacing={4}>
                <Grid item md="12">
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
                        id="test-table-xls-button"
                        className={"btn btn-success"}
                        table="table-to-xls"
                        filename="Reporte de cuentas por pagar"
                        sheet="tablexls"
                        buttonText="Exportar"
                      />
                    </ListItem>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
  
        <TableContainer component={Paper}>
          <Table
            id="table-to-xls"
            className={classes.table}
            size="small"
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <StyledTableCell align="center" name="" key={index}>
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
                        {row.data().ProveedorNombre}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.data().ProveedorCelular}
                      </StyledTableCell>
  
                      <StyledTableCell align="center">
                        {row.data().Cantidad}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {}$ {numeral(row.data().Costo).format(`${"USD"}0,0.00`)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {moment(row.data().Plazo.seconds * 1000).format("YYYY-MM-DD")}
                      </StyledTableCell>
  
                      <StyledTableCell align="center">
                        {moment(row.data().Fecha.seconds * 1000).format(
                          "YYYY-MM-DD"
                        )}
                      </StyledTableCell>
                      
                      <StyledTableCell align="center">
                        {row.data().ProveedorNombre === "noproveedor" ? (
                          <PagosAndPedidos data={row} />
                        ) : (
                            <Grid
                              container
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Grid item md={4} xs={4}>
                                <Tooltip title="Eliminar">
                                  <IconButton
                                    aria-label="eliminar"
                                    onClick={() => handleLikeDelete(row.id)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                              <Grid item md={4} xs={4}>
                                  <PagosAndPedidos data={row} new={false} />
                              </Grid>
                              <Tooltip title="Realizar pago">
                                <IconButton
                                  aria-label="money"
                                  onClick={() => handleLike(row)}
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                        )}
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
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
};

Pagos.propTypes = {
  className: PropTypes.string,
};

export default Pagos;
