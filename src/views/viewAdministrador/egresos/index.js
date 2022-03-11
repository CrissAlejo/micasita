import React from 'react';
import * as FirestoreService from "./services/firestore";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeIcon from '@material-ui/icons/Home';
import { Breadcrumbs } from '@material-ui/core';
import useSettings from "../../../contextapi/hooks/useSettings";
import { withStyles } from "@material-ui/core/styles";
import numeral from "numeral";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {  Box, Grid } from "@material-ui/core";
import Button from "../../../components/CustomButtons/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import { Tooltip, IconButton } from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import New from './New/New';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import styles from "../../../assets/jss/material-dashboard-react/components/buttonStyle.js";
import "bootstrap/dist/css/bootstrap.min.css";
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import useStyles from "./useStyles";
//const useStyles = makeStyles(styles,{
//  root: {
//    width: "100%",
//  },
//  container: {
//    width: "100%",
//  },
//});

function Egresos() {
  const classes = useStyles();
  const { settings } = useSettings();
  const [egresos, setEgresos] = React.useState([]);
  const [cuentas, setCuentas] = React.useState([]);  
  const [valTab, setValTab] = React.useState(0); 
  const columns = [
    { id: "rubro", label: "Rubro" },
    { id: "subrubro", label: "SubRubro" },
    { id: "description", label: "Descripción" },
    { id: "date", label: "Fecha" },
    { id: "value", label: "Valor" },
    { id: "acciones", label: "Acciones" },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [elm, setElm] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  

  const handleChangeTab = (event,value) => {
    value -= 1;
    if(value<0){
      FirestoreService.getAllEgresos(settings.idConjunto,
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setEgresos(Items);
            setLoading(false); 
          }
        })
    } else {
      FirestoreService.getEgresos(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setEgresos(Items);
            setLoading(false); 
          },
        },
        settings.idConjunto, cuentas[value].id
      );
    }
    value += 1;
    setValTab(value);
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

  
  React.useEffect(() => {
    try {
      FirestoreService.getCuentabyConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setCuentas(Items);
                      
          },
        },
        settings.idConjunto
      );
      FirestoreService.getAllEgresos(settings.idConjunto,
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setEgresos(Items);
            setLoading(false); 
          }
        })
    } catch (e) { }
  },[settings.idConjunto]);

  const confir = () => {
    setOpen(false);
    setLoading(true);

    if (elm) {
      FirestoreService.deleteEgresoByConjunto(settings.idConjunto, elm).then(
        () => {
          setLoading(false);
        }
      );
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  function handleLike(event) {
    setOpen(true);
    setElm(event);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const renderCuenta = (id) => {
    const banco = cuentas.find(cuenta => cuenta.id === id);
    if(banco){
      if(banco.data().TipoMetodo =='Cuenta Bancaria'){
        return banco.data().Banco + ' ' + banco.data().NumeroCuenta;
      }
      return banco.data().NombreCaja;
    }
    return 'Sin banco o caja'
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
            ¿Estás seguro que quieres eliminar?
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
      <h1> Egresos </h1>
      <Grid container spacing = "3">
        <Grid item md="6">
        <New/>
        </Grid>
        <Grid item md="6">
          <div style={{float: 'right'}}>
          <Box>
        <ListItem >
          
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
            filename="Reporte de egresos"
            sheet="tablexls"
            buttonText="Exportar Datos"
          />
        </ListItem>
        </Box>
          </div>
        </Grid>       
      </Grid>
      <AppBar position="static" color="default">
        <Tabs
          value={valTab}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={'Todos los egresos'} icon={<HomeIcon />} />
          {cuentas
            .filter(row => row.data().TipoMetodo == "Cuenta Bancaria")
            .map((row) => {
              return (
                <Tab label={row.data().Banco + " \n #:" + row.data().NumeroCuenta} icon={<HomeIcon />} />
              );
            })}
          {cuentas
            .filter(row => row.data().TipoMetodo == "Caja")
            .map((row) => {
              return (
                <Tab label={row.data().NombreCaja} icon={<HomeIcon />} />
              );
          })}
        </Tabs>
      </AppBar>

      {!loading ? (
          <Box justifyContent="center" marginTop={5}>
            <TableContainer component={Paper}>
              <Table className={classes.table} id="table-to-xls" aria-label="customized table" size='small'>
                <TableHead>
                  <TableRow>
                  {valTab === 0 && (
                    <StyledTableCell>
                      Cuenta
                    </StyledTableCell>
                  )}
                    {columns.map((column, index) => (
                      <StyledTableCell align={column.label == 'Valor'? 'right':''} key={index}>
                        {column.label}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {egresos
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <StyledTableRow hover tabIndex={-1} key={index}>
                          {valTab === 0 && (
                            <StyledTableCell>
                              {renderCuenta(row.data().CuentaUid)}
                            </StyledTableCell>
                          )}
                          <StyledTableCell>
                            {row.data().Rubro}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.data().SubRubro}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.data().Descripcion}
                          </StyledTableCell>
                          <StyledTableCell>
                            {row.data().Fecha.toDate().toDateString()}
                          </StyledTableCell>                                                           
                          <StyledTableCell align="right">
                            {}$
                            {numeral(row.data().Valor).format(`${"USD"}0,0.00`)}
                          </StyledTableCell>
                          <StyledTableCell>
                            <Grid
                              container
                              spacing={0}
                            >
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
                            </Grid>
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              labelRowsPerPage={'Filas por página'}
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={egresos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Box>
        ) : (
          <Box display="flex" justifyContent="center" my={5}>
            <h1>Selecciona una cuenta</h1>
          </Box>
        )}             
      </Paper>
  );
}

export default Egresos;
