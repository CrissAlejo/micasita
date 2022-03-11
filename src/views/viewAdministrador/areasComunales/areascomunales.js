import React, {Fragment} from "react";
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
import Button from "../../../components/CustomButtons/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import NewAndEdit from "./NewAndEdit/NewAndEdit";
import useSettings from "../../../contextapi/hooks/useSettings";
import { withStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import { Tooltip, IconButton } from "@material-ui/core";
import ReactTooltip from 'react-tooltip';
import VisibilityIcon from "@material-ui/icons/Visibility";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DetalleAreaComunal from "./DetalleAreaComunales/DetalleAreaComunal";
import {Grid } from "@material-ui/core";
import useStyles from "./useStyles";

function Areas(props) {
  const [areas, setAreas] = React.useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [openHab, setOpenHab] = React.useState(false);
  const [elm, setElm] = React.useState(null);
  const [habi, setHabilt] = React.useState(null);
  const { threadKey } = useParams();
  const { settings } = useSettings();
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);   



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

  const columns = [
    { id: "imagen", label: "" },
    { id: "name", label: "Área" },
    { id: "apertura", label: "Hora apertura" },
    { id: "cierre", label: "Hora cierre" },
    { id: "habilitado", label: "Habilitado" },
    { id: "acciones", label: "Acciones" },
  ];

  function updateHabilitado(event) {
    setIsEnabled(!isEnabled);
    setOpenHab(true);
    setHabilt(event);
  }
  
const handleCloseHabilit = () => {
    setOpenHab(false);
  };

 const confirHabilt = () => {
   if (habi) {
      FirestoreService.updateHabilitado(settings.idConjunto,habi,habi.id).then((docRef) => {
        setOpenHab(false);
      });
    }
  };


  const handleClose = () => {
    setOpen(false);
  };

  const confir = () => {
    if (elm) {
      
      FirestoreService.deleteAreaById(settings.idConjunto, elm).then((docRef) => {
        setOpen(false);
      });
    }
  };


 
 function deleteAreaById(event) {
    setOpen(true);
    setElm(event);
  }

  const getConjuntoById = React.useCallback(() => {
    try {
      FirestoreService.getAreasByConjunto(settings.idConjunto, {
      next: (querySnapshot) => {
        const updatedGroceryItems = querySnapshot.docs.map(
          (docSnapshot) => docSnapshot
        );
        setAreas(updatedGroceryItems);
      },
    });
    } catch (e) {}
  }, [settings.idConjunto]);

  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);
  
  return (
     
    <Paper className={classes.root}>
      <NewAndEdit info={threadKey} data={null} />
      <Dialog
        open={openHab}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Área comunal
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea {habi ? (habi.data().Habilitado? ("Deshabilitar"):("Habilitar")):null}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseHabilit} color="primary">
            {" "}
            Cancelar
          </Button>
          <Button onClick={confirHabilt} color="primary">
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

      <TableContainer component={Paper}>
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
            {areas
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <StyledTableRow hover tabIndex={-1} key={index}>
                    <StyledTableCell align="center">
                      {" "}
                      <img
                        src={row.data().Imagen}
                        alt="logo"
                        width="100"
                        height="100"
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.data().Nombre}</StyledTableCell>
                    <StyledTableCell align="center">{row.data().HoraInicio}</StyledTableCell>
                    <StyledTableCell align="center">{row.data().HoraFin}</StyledTableCell>
                    <StyledTableCell align="center">
                     
                        <FormControlLabel
                          control={
                            <Switch
                              onChange={toggleSwitch}
                              checked={row.data().Habilitado}
                              onClick={() => updateHabilitado(row)}
                              color="primary"
                            />
                          }         
                        />
                      
                    </StyledTableCell>
                    
                    <StyledTableCell>
                      <Grid
                            container
                            spacing={0}
                            alignItems="center"
                            justifyContent="center"
                      >
                       
                        <Grid >
                          <Tooltip title="Eliminar">
                              <IconButton 
                            aria-label="eliminar"
                            onClick={() => deleteAreaById(row.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          </Tooltip>
                        </Grid>
                         <Grid >
                          <NewAndEdit
                            aria-label="editar"
                            info={threadKey}
                            data={row}  />
                          
                        </Grid>
                        <Grid >
                          {" "}
                            <DetalleAreaComunal info={row} />
                         
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
        count={areas.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default Areas;
