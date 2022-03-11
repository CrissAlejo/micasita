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
import New from "./New/New";
import Edit from "./Edit/Edit";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";

import Button from "../../../components/CustomButtons/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CircularProgress, CardContent, Box, Grid } from "@material-ui/core";
import useSettings from "../../../contextapi/hooks/useSettings";
import PagosAndPedidos from "./PagosAndPedidos/PagosAndPedidos";
import SearchBar from "material-ui-search-bar";
import NoInfo from "../../../components/Common/NoInfo";

const Proveedor = () => {
  const classes = useStyles();
  const [usuario, setUsuarios] = React.useState([]);
  const { settings } = useSettings();
  const columns = [
    { id: "NombreRepresentante", label: "Nombre Representante" },
    { id: "ApellidoRepresentante", label: "Apellido Representante" },
    { id: "CorreoRepresentante", label: "Correo Representante" },
    { id: "TelefonoRepresentante", label: "Telefono Representante" },
    { id: "Ruc", label: "Ruc" },
    { id: "Acciones", label: "Acciones" },
  ];
  const [Items, setItems] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [elm, setElm] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [searched, setSearched] = React.useState('');
  const [filterUsuario, setfilterUsuario] = React.useState([]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const requestSearch = (searchedVal) => {
    const filteredRows = filterUsuario.filter((row) => {
      return row.data()
      .NombreRepresentante.toLowerCase().includes(searchedVal.toLowerCase()) ||  row.data()
      .Ruc.toString().toLowerCase().includes(searchedVal.toLowerCase()) ||  row.data()
      .ApellidoRepresentante.toLowerCase().includes(searchedVal.toLowerCase()) ||  row.data()
      .CorreoRepresentante.toLowerCase().includes(searchedVal.toLowerCase()) ||  row.data()
      .TelefonoRepresentante.toLowerCase().includes(searchedVal.toLowerCase())
    });
    setUsuarios(filteredRows);
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
  const getConjuntoById = React.useCallback(() => {
    try {
      FirestoreService.getProveedoresByConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setUsuarios(Items);
            setfilterUsuario(Items);
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
  function nuevaFoto() {
    document.getElementById("file").click();
  }
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      setItems(d);
    });
  };
  const confir = () => {
    setOpen(false);
    setLoading(true);

    if (elm) {
      FirestoreService.deleteProveedorByConjunto(settings.idConjunto, elm).then(
        (docRef) => {
          setLoading(false);
        }
      );
    }
  };
  function cargardata() {
    Items.forEach((rs) => {
      try {
        FirestoreService.newProveedor(settings.idConjunto, rs).then(() => {});
      } catch (err) {
        console.error(err);
      }
    });
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

      <CardContent>
        <New />
      </CardContent>
      {Items.length > 0 ? (
        <Button onClick={cargardata} color="warning">
          Confirmar
        </Button>
      ) : null}
      {!loading ? (
        <>
           <SearchBar value={searched} onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          /> 
            <Table className={classes.table} size="small" aria-label="customized table">
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
                {usuario && usuario
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <StyledTableRow hover tabIndex={-1} key={index}>
                        <StyledTableCell align="center">
                          {row.data().NombreRepresentante}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.data().ApellidoRepresentante}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.data().CorreoRepresentante}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.data().TelefonoRepresentante}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.data().Ruc}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Grid container spacing={3}>
                            <Grid item md={4} xs={4}>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  aria-label="eliminar"
                                  onClick={() => handleLike(row.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item md={4} xs={4}>
                              <Tooltip title="Editar">
                                <Edit data={row} />
                              </Tooltip>
                            </Grid>
                            <Grid item md={4} xs={4}>
                              <PagosAndPedidos data={row} new={true} />
                            </Grid>
                          </Grid>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}


              </TableBody>
            </Table>
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
        </>
      ) : (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};
export default Proveedor;
