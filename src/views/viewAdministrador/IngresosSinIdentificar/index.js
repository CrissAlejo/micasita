import React from "react";
import * as FirestoreService from "./services/firestore";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import useStyles from "./useStyles";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import HomeIcon from "@material-ui/icons/Home";
import { Breadcrumbs } from "@material-ui/core";
import useSettings from "../../../contextapi/hooks/useSettings";
import { withStyles } from "@material-ui/core/styles";
import numeral from "numeral";
import { Box, Grid } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { Tooltip } from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import "bootstrap/dist/css/bootstrap.min.css";
import AsignacionUsuario from "./AsignacionUsuario";
import NoInfo from "../../../components/Common/NoInfo";
import LoadingData from "../../../components/Common/LoadingData";

function IngresosSinIdentificar(props) {
  const classes = useStyles();
  const { settings } = useSettings();
  const [ingresos, setIngresos] = React.useState([]);
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
  const [loading, setLoading] = React.useState(true);

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
      FirestoreService.getIngresosNoAsignados(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setIngresos(Items);
            setLoading(false);
          },
        },
        settings.idConjunto
      );
    } catch (e) {}
  }, [settings.idConjunto]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <center>
        <h1> Ingresos sin identificar</h1>
      </center>
      <h2>Selecciona el ingreso que deseas asignar a un usuario</h2>
      {!loading ? (
        <Box>
          {ingresos.length > 0 ? (
            <Box justifyContent="center" my={5}>
              <TableContainer component={Paper}>
                <Table
                  className={classes.table}
                  id="table-to-xls"
                  aria-label="customized table"
                >
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
                    {ingresos
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        return (
                          <StyledTableRow hover tabIndex={-1} key={index}>
                            <StyledTableCell align="center">
                              {row.data().Rubro}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row.data().SubRubro}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row.data().Descripcion}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row
                                .data()
                                .Fecha.toDate()
                                .toDateString()}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              $
                              {numeral(row.data().Valor).format(
                                `${"USD"}0,0.00`
                              )}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <Grid
                                container
                                spacing={0}
                                alignItems="center"
                                justify="center"
                              >
                                <Grid item xs={6} lg={3}>
                                  <Tooltip title="Asignar Usuario">
                                    <AsignacionUsuario ingresoId={row.id} />
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
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={ingresos.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Box>
          ) : (
            <NoInfo />
          )}
        </Box>
      ) : (
        <LoadingData />
      )}
    </Paper>
  );
}

export default IngresosSinIdentificar;
