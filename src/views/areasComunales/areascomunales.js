import React from "react";
import * as FirestoreService from "./services/firestore";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import NewArea from "./NewArea/NewArea";
import EditArea from "./EditArea/EditArea";
import Button from "../../components/CustomButtons/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import NewAndEdit from "./NewAndEdit/NewAndEdit";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    width: "100%",
  },
});
function Areas(props) {
  const [areas, setAreas] = React.useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [elm, setElm] = React.useState(null);
  const { threadKey } = useParams();

  const columns = [
    { id: "name", label: "Nombre" },
    { id: "imagen", label: "Imagen" },
    { id: "uso", label: "Horas uso" },
    { id: "habiles", label: "Días hábiles" },
    { id: "apertura", label: "Hora apertura" },
    { id: "cierre", label: "Hora cierre" },
    { id: "aforo", label: "Aforo" },
    { id: "garantia", label: "Garantía" },
    { id: "anticipacion", label: "Días anticipación" },
    { id: "reserva", label: "Reserva por usuario" },
    { id: "periodo", label: "Período" },
    { id: "habilitado", label: "Habilitado" },
    { id: "multireserva", label: "Multi reserva" },
    { id: "terminos", label: "Términos y condiciones" },
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
      FirestoreService.deleteAreaById(threadKey, elm).then((docRef) => {
        setOpen(false);
      });
    }
  };

  function deleteAreaById(event) {
    setOpen(true);
    setElm(event);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    FirestoreService.getAllAreas(threadKey, {
      next: (querySnapshot) => {
        const updatedGroceryItems = querySnapshot.docs.map(
          (docSnapshot) => docSnapshot
        );
        setAreas(updatedGroceryItems);
      },
    });
  }, []);

  return (
    <Paper className={classes.root}>
   //   <NewAndEdit info={threadKey} data={null} />
      <NewArea info={threadKey}/>
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
            ¿Estas seguro que deseas eliminar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            {" "}
            Cancelar
          </Button>
          <Button onClick={confir} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

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
            {areas
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <TableRow hover tabIndex={-1} key={index}>
                    <TableCell align="center">{row.data().Nombre}</TableCell>
                    <TableCell align="center">
                      {" "}
                      <img
                        src={row.data().Imagen}
                        alt="logo"
                        width="100"
                        height="100"
                      />
                    </TableCell>
                    <TableCell align="center">{row.data().HorasUso}</TableCell>
                    <TableCell align="center">
                      {row.data().DiasHabiles}
                    </TableCell>
                    <TableCell align="center">
                      {row.data().HoraInicio}
                    </TableCell>
                    <TableCell align="center">{row.data().HoraFin}</TableCell>
                    <TableCell align="center">{row.data().Aforo}</TableCell>
                    <TableCell align="center">{row.data().Garantia}</TableCell>
                    <TableCell align="center">
                      {row.data().DiasAnticipacion}
                    </TableCell>
                    <TableCell align="center">
                      {row.data().ReservaxUsuario}
                    </TableCell>
                    <TableCell align="center">{row.data().Periodo}</TableCell>
                    <TableCell align="center">
                      {row.data().Habilitado ? (
                        <FormControlLabel
                          disabledRipple
                          control={
                            <Switch
                              checked
                              name={"hab" + row.data().Nombre}
                              color="primary"
                            />
                          }
                        />
                      ) : (
                        <FormControlLabel
                          disabled
                          disabledRipple
                          control={
                            <Switch
                              name={"hab" + row.data().Nombre}
                              color="primary"
                            />
                          }
                        />
                      )}
                    </TableCell>
                    
                    <TableCell align="center">
                      {row.data().MultiReserva ? (
                        <FormControlLabel
                          disabledRipple
                          control={
                            <Switch
                              checked
                              name={"multi" + row.data().Nombre}
                              color="primary"
                            />
                          }
                        />
                      ) : (
                        <FormControlLabel
                          disabled
                          disabledRipple
                          control={
                            <Switch
                              name={"multi" + row.data().Nombre}
                              color="primary"
                            />
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row.data().TerminosCond}
                    </TableCell>
                    <TableCell>
                      <EditArea info={row} />
                      <Button
                        color="danger"
                        onClick={() => deleteAreaById(row.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={areas.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default Areas;
