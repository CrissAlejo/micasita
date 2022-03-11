import React from "react";
import PropTypes from "prop-types";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import useSettings from "../../../../contextapi/hooks/useSettings";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Typography } from "@material-ui/core";
import numeral from "numeral";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
const useStyles = makeStyles(() => ({
  root: {},
  estadook:{
    backgroundColor:'#95D890',
    height:'100%',
    width:'100%',
    alignContent:'center',
    alignItems:'center',
    textAlign:'center',
    alignSelf:'center'
  },
  estadoerror:{
    backgroundColor:'#FBD469',
    height:'100%',
    width:'100%',
    alignContent:'center',
    alignItems:'center',
    textAlign:'center',
    alignSelf:'center'
  }
}));

const Egresos = (prop) => {
  const classes = useStyles();
  const { settings } = useSettings();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [egresos] = React.useState(prop.egresos);
  const {metodo, dataNoCon} = prop;
  const egrConc = egresos.filter( egr => metodo=='excel' ? egr.data().Conciliado === true : true )
  const egrNoConc = egresos.filter( egr => egr.data().Conciliado === false)

  const columns = [
    { id: "Fecha", label: "Fecha" },
    { id: "Comprobante", label: "# de Comprobante" },
    { id: "Rubro", label: "Rubro" },
    { id: "Descripcion", label: "Descripcion" },
    { id: 'Estado', label: "Estado" },
    { id: "Valor", label: "Valor" },
  ];
  if(metodo!='excel') columns.splice(4,1)

  const columnsData = [
    { id: "Fecha", label: "Fecha" },
    { id: "Comprobante", label: "# de Comprobante" },
    { id: "Observaciones", label: "Observaciones" },
    { id: "Valor", label: "Valor" },
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

  return (
    <view>
      {egrConc.length > 0 && (
        <Accordion defaultExpanded component={Paper}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography><b>{metodo=='excel' ? 'Egresos conciliados' : 'Tabla de egresos'}</b></Typography>
        </AccordionSummary>
        <AccordionDetails>
        <TableContainer style={{width: "100%"}}>
        <Table className={classes.table} aria-label="customized table">
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
            {egrConc
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <StyledTableRow hover tabIndex={-1} key={index}>
                    <StyledTableCell align="center">
                      {moment(row.data().Fecha.seconds * 1000).format(
                        "YYYY-MM-DD"
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Comprobante}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Rubro}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Descripcion}
                    </StyledTableCell>
                    {metodo == 'excel' && (
                      <StyledTableCell align="center">
                      <div className={row.data().Conciliado ? classes.estadook : classes.estadoerror}>
                        {row.data().Conciliado ? "CONCILIADO" : "PENDIENTE"}
                      </div>
                    </StyledTableCell>
                    )}
                    <StyledTableCell align="center">
                      {}$ {numeral(row.data().Valor).format(`${"USD"}0,0.00`)}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      </AccordionDetails>
      <AccordionActions>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={egrConc.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      </AccordionActions>
      </Accordion>
      )}
      {egrNoConc.length > 0 && (
        <Accordion defaultExpanded component={Paper}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography><b>Egresos no conciliados</b></Typography>
        </AccordionSummary>
        <AccordionDetails>
        <TableContainer style={{width: "100%"}}>
        <Table className={classes.table} aria-label="customized table">
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
            {egrNoConc
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                return (
                  <StyledTableRow hover tabIndex={-1} key={index}>
                    <StyledTableCell align="center">
                      {moment(row.data().Fecha.seconds * 1000).format(
                        "YYYY-MM-DD"
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Comprobante}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Rubro}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.data().Descripcion}
                    </StyledTableCell>
                    {metodo=='excel' && (
                      <StyledTableCell align="center">
                      <div className={row.data().Conciliado ? classes.estadook : classes.estadoerror}>
                        {row.data().Conciliado ? "CONCILIADO" : "PENDIENTE"}
                      </div>
                    </StyledTableCell>
                    )}

                    <StyledTableCell align="center">
                      {}$ {numeral(row.data().Valor).format(`${"USD"}0,0.00`)}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      </AccordionDetails>
      <AccordionActions>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={egrNoConc.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      </AccordionActions>
      </Accordion>
      )}
      {dataNoCon.length > 0 && (
        <Accordion defaultExpanded component={Paper}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography><b>Egresos del archivo excel que no fueron conciliados</b></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer style={{width: "100%"}}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {columnsData.map((column, index) => (
                      <StyledTableCell align="center" key={index}>
                        {column.label}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataNoCon
                    .map((row, index) => {
                      return (
                        <StyledTableRow hover tabIndex={-1} key={index}>
                          <StyledTableCell align="center">
                            {moment(row.data().Fecha.seconds * 1000).format(
                              "YYYY-MM-DD"
                            )}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.data().Comprobante}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.data().Observaciones}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {}$ {numeral(row.data().Valor).format(`${"USD"}0,0.00`)}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}
    </view>
  );
};

Egresos.propTypes = {
  className: PropTypes.string,
};

export default Egresos;
