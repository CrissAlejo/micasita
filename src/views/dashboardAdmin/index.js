import React from "react";
import PropTypes from "prop-types";
import { Container, withStyles } from "@material-ui/core";
import * as FirestoreService from "./services/firestore";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Page from "../../components/Common/Page";
import { BarChart } from "../chartJs/ChartIngEg";
import { BarChartMeses } from "../chartJs/ChartMeses";
import useSettings from "../../contextapi/hooks/useSettings";
import useStyles from "./useStyles";
import Paper from "@material-ui/core/Paper";
import numeral from "numeral";

const Dashboard = () => {
  const [page, setPage] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const columns = [
    { id: "usuario", label: "Usuario" },
    { id: "unidadHabitacional", label: "Unidad Habitacional" },
    { id: "deuda", label: "Deuda" },
    { id: "dias", label: "Días de mora" } 
  ];
  const classes = useStyles();
  const [pagosPendientes, setPagosPendientes] = React.useState([]);
  const { settings } = useSettings();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    try {
      FirestoreService.getUsuariosMorosos(settings.idConjunto).then(
        (querySnapshot) => {
          let Items = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
          const usuariosName = [];
          let ItemsMorosos = [];
            Items.map((item)=>{
            const found = usuariosName.find(element => element == item.UsuarioId);
            if(item.UsuarioId != found){
              usuariosName.push(item.UsuarioId);
              ItemsMorosos.push(item);
            }else {
              for(var i = 0; i<ItemsMorosos.length; i++){
                if(ItemsMorosos[i].UsuarioId == found){
                  ItemsMorosos[i].Valor =  ItemsMorosos[i].Valor + item.Valor;
                }    
              }              
            }                   
          })
          setPagosPendientes(ItemsMorosos);
        }
      );
    } catch (e) {}
  }, [settings.idConjunto]);

  const loadDataChart = () => {
    if (settings !== undefined) {
      return settings.idConjunto;
    } else {
      return undefined;
    }
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
  const StyledTableCell2 = withStyles((theme) => ({
    head: {
      backgroundColor: "rgba(75, 192, 192, 1)",
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

  return (
    <Page className={classes.root} title="Mi casita">
      <Container maxWidth="lg">
        <center>
          <h1>BIENVENIDO</h1>
        </center>
        <div className={classes.root}>
          <div className={classes.sobreDos}>
            {<BarChart data={loadDataChart()}></BarChart>}
          </div>
          <div className={classes.sobreDos}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {columns.map((column, index) => (
                      <StyledTableCell2 align="center" key={index}>
                        {column.label}
                      </StyledTableCell2>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagosPendientes !== undefined &&
                    pagosPendientes
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        var difference =
                          new Date().getTime() -
                          row.FechaLimite.toDate();
                        var days = difference / (1000 * 3600 * 24);
                        return (
                          <StyledTableRow hover tabIndex={-1} key={index}>
                            <StyledTableCell align="center">
                              {row.NombreUsuario}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              UH-{row.CasaUsuario}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              ${numeral(row.Valor).format(`${"USD"}0,0.00`)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {numeral(days).format("0")} días
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
             labelRowsPerPage={"Filas por página"}
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={pagosPendientes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
          <div className={classes.cien}>
            <p className={classes.titulo}>Ingresos y egresos mensualmente</p>
            {<BarChartMeses data={loadDataChart()}></BarChartMeses>}
          </div>
        </div>
      </Container>
    </Page>
  );
};

Dashboard.propTypes = {
  children: PropTypes.node,
};

export default Dashboard;
