import React from "react";
import "./administrador.css"
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
import NewAdmin from "./NewAdmin/NewAdmin";
import EditAdmin from "./EditAdmin/EditAdmin";
import Button from "../../components/CustomButtons/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid, IconButton, Tooltip } from "@material-ui/core";
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
    width: "100%",
  },
});


function Administradores(props) {
  const [administrador, setAdministradores] = React.useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [elm, setElm] = React.useState(null);

  const columns = [
    { id: "name", label: "Nombre" },
    { id: "apellido", label: "Apellido" },
    { id: "correo", label: "Correo electrónico" },
    { id: "cedula", label: "Número de cédula" },
    { id: "telefono", label: "Teléfono"},
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
      FirestoreService.deleteAdminbyID(elm).then((docRef) => {
        setOpen(false);
      });
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  
  React.useEffect(() => {
    FirestoreService.getAllAdmins({
      next: (querySnapshot) => {
        const updatedGroceryItems = querySnapshot.docs.map((docSnapshot) =>docSnapshot);
        setAdministradores(updatedGroceryItems);
      },
    });
  }, []);

  
  function deleteAdminby(event) {
    setOpen(true);
    setElm(event);
  }

  return (
    <div>
      <NewAdmin/>
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
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
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
              {administrador
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const admin = row.data();
                  return (
                    <TableRow hover tabIndex={-1} key={index}>
                      <TableCell align="center">{admin.Nombre}</TableCell>
                      <TableCell align="center">{admin.Apellido}</TableCell>
                      <TableCell align="center">{admin.Correo}</TableCell>
                      <TableCell align="center">{admin.Cedula}</TableCell>
                      <TableCell align="center">{admin.Telefono}</TableCell>                      
                      <TableCell align="center">
                      <Grid
                          container
                          spacing={0}
                          alignItems="center"
                          justify="center"
                        >
                          <Grid item xs={6} md={6}>
                            <EditAdmin info={row} />
                          </Grid>
                          <Grid item xs={6} md={6}>
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => deleteAdminby(row.id)}
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
          labelRowsPerPage={"Filas por página"}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={administrador.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Administradores;
