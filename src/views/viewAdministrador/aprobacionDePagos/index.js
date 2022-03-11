import React from 'react';
import * as FirestoreService from "./Services/firestore";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeIcon from '@material-ui/icons/Home';
import { Breadcrumbs } from '@material-ui/core';
import useSettings from "../../../contextapi/hooks/useSettings";
import { withStyles } from "@material-ui/core/styles";
import numeral from "numeral";
import useStyles from './useStyles';
import NoInfo from "../../../components/Common/NoInfo";
import {Box } from "@material-ui/core";
import ConfirmarTransferencia from './ConfirmarTransferencia/ConfirmarTransferencia';
import TablePagination from "@material-ui/core/TablePagination";


function AprobacionPagos() {
  const classes = useStyles();
  const { settings } = useSettings();
  const [transferencias, setTransferencias] = React.useState([]);
  const [cuentas, setCuentas] = React.useState([]);
  const [valTab, setValTab] = React.useState(0);
  const [usuarios, setUsuarios] = React.useState([]);
  const columns = [
    { id: "fecha", label: "Fecha" },
    { id: "detalle", label: "Detalle" },
    { id: "usuario", label: "Residente que transfirió" },
    { id: "imagen", label: "Comprobante" },
    { id: "valor", label: "Valor" },
    { id: "acciones", label: "Acciones" },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState(true);


  const handleChangeTab = (event, value) => {
    FirestoreService.getAllTranferencias({
      next: (querySnapshot) => {
        const Items = querySnapshot.docs.map((docSnapshot) =>
          docSnapshot
        );
        setTransferencias(Items);
      },
    },
      settings.idConjunto, cuentas[value].id
    );
    setValTab(value);
    setLoading(false);
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
    } catch (e) { }
  }, [settings.idConjunto]);
  React.useEffect(()=>{
    getUsr();
  },[transferencias])

  async function getUsr(){
    if(transferencias.length>0){
      let users= [];
      for(let i = 0 ; i<transferencias.length; i++){
        const doc = await FirestoreService.getUsuario(transferencias[i].data().Usuario)
        users.push(doc.data())
      }
      setUsuarios(users)
      setLoading(false);
    }
  }

  function renderUsuario(userCorreo) {
      if(usuarios.length>0){
        const usr = usuarios.find( us => us.Correo === userCorreo);
        return usr ? `${usr.Nombre} ${usr.Apellido} - ${usr.Casa}` : userCorreo
      }
  }

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };



  return (
    <Paper className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={valTab}
          onChange={handleChangeTab}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
        >
          {cuentas
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, i) => {
              return (
                <Tab key={i} label={row.data().Banco + " \n #:" + row.data().NumeroCuenta} icon={<HomeIcon />} />
              );
            })}
        </Tabs>
      </AppBar>

      {!loading ? (
        <>
        {transferencias.length > 0 ? (
          <Box justifyContent="center" marginTop={5}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table" size='small'>
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
                {transferencias
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <StyledTableRow hover tabIndex={-1} key={index}>
                        <StyledTableCell align="center">
                          {row.data().Fecha.toDate().toDateString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.data().Detalle}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {renderUsuario(row.data().Usuario)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <a href={row.data().Imagen} target="_blank" rel="noreferrer">Recibo</a>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          ${numeral(row.data().Valor).format(`${"USD"}0,0.00`)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <ConfirmarTransferencia data={row} cuentaId={cuentas[valTab].id} />
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            labelRowsPerPage='Filas por página'
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={transferencias.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        ):(
          <NoInfo/>
        )}
        </>
      ) : (
        <Box display="flex" justifyContent="center" my={5}>
          <h1>Selecciona una cuenta</h1>
        </Box>
      )}
    </Paper>
  );
}

export default AprobacionPagos;
