import React from "react";
import "./usuarios.css"
import * as FirestoreService from "./services/firestore";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import EditUsuario from "./EditUsuario/EditUsuario";
import Button from "../../components/CustomButtons/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid, IconButton, Tooltip } from "@material-ui/core";
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import SearchBar from "material-ui-search-bar";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
    width: "100%",
  },
});

function Usuarios(props) {
  const [usuario, setUsuarios] = React.useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [elm, setElm] = React.useState(null);
  const [informacion] = React.useState(props.info);
  const [filteredUsers, setFilteredUsers] = React.useState([]);
  const [searched, setSearched] = React.useState('');

  const columns = [
    { id: "name", label: "Nombre" },
    { id: "apellido", label: "Apellido" },
    { id: "correo", label: "Correo electrónico" },
    { id: "cedula", label: "Número de cédula" },
    { id: "telefono", label: "Número de contacto" },
    { id: "alicuota", label: "Valor Alícuota" },
    { id: "casa", label: "Número de casa" },
    { id: "acciones", label: "Acciones" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const confir = () => {
    if (elm) {
      FirestoreService.deleteUserbyID(elm).then((docRef) => {
        setOpen(false);
      });
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = usuario.filter((row) => {
        return row.data().Nombre.toLowerCase().includes(searchedVal.toLowerCase()) || row.data()
                .Apellido.toLowerCase()?.includes(searchedVal.toLowerCase()) || row.data()
                .Correo.toLowerCase()?.includes(searchedVal.toLowerCase()) || row.data()
                .Cedula.toString().includes(searchedVal) || row.data().Alicuota == searchedVal || row.data()
                .Casa.toLowerCase()?.includes(searchedVal.toLowerCase()) || row.data()
                .Telefono.includes(searchedVal)
    });
    setFilteredUsers(filteredRows);
    setPage(0);
  };
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  React.useEffect(() => {
    FirestoreService.getUserByConjunto({
      next: (querySnapshot) => {
        const Items = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot
        );
        setUsuarios(Items);
        setFilteredUsers(Items);
      },
    }, informacion)
  }, []);

  function deleteUserby(event) {
    setOpen(true);
    setElm(event);
  }

  return (
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
            Estás seguro que quieres eliminar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="warning">
            Cancelar
          </Button>
          <Button onClick={confir} color="danger">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Paper className={classes.root}>
        <SearchBar
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
        />
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell align="center" key={index}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell align="center">{row.data().Nombre}</TableCell>
                      <TableCell align="center">{row.data().Apellido}</TableCell>
                      <TableCell align="center">{row.data().Correo}</TableCell>
                      <TableCell align="center">{row.data().Cedula}</TableCell>
                      <TableCell align="center">{row.data().Telefono}</TableCell>
                      <TableCell align="center">{row.data().Alicuota}</TableCell>
                      <TableCell align="center">{row.data().Casa}</TableCell>
                      <TableCell align="center">
                        <Grid
                          container
                          spacing={0}
                          alignItems="center"
                          justify="center"
                        >
                          <Grid item xs={6} md={6}>
                            <EditUsuario info={row} />
                          </Grid>
                          <Grid item xs={6} md={6}>
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => deleteUserby(row.id)}
                            >
                              <DeleteSweepIcon color="secondary"/>
                            </IconButton>
                          </Tooltip>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelRowsPerPage='Usuarios por página'
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Usuarios;
