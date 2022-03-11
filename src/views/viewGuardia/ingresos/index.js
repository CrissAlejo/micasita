import React, { useEffect, useState } from 'react'
import LoadingData from 'src/components/Common/LoadingData';
import * as FirestoreService from './service/firestore'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, ListItem, Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import NoInfo from "../../../components/Common/NoInfo";
import DetallesIngreso from './DetallesIngreso'
import useStyles from '../rondas/Styles';
import useAuth from 'src/contextapi/hooks/useAuth';
import moment from 'moment';
import 'moment/locale/es-mx'
import SearchBar from "material-ui-search-bar";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
const Ingresos = () => {
    const classes = useStyles();
    const [searched, setSearched] = React.useState("");
    const [loading, setLoading] = useState(true)
    const [ingresos, setIngresos] = useState([]);
    const [ingresosfiler, filterIngresos] = useState([]);
    const { user } = useAuth();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const columns = [
        { id: 1, label: "Fecha y Hora" },
        { id: 2, label: "Nombre" },
        { id: 3, label: "Observación" },
        { id: 4, label: "Acciones" }
    ];
    const requestSearch = (searchedVal) => {
        const filteredRows = ingresosfiler.filter((row) => {
            return moment(row.data()
            .Fecha.toDate()).format('ddd DD-MM-YY hh:mm A').includes(searchedVal.toLowerCase()) || row.data()
            .Nombre?.toLowerCase()?.includes(searchedVal.toLowerCase()) || row.data()
            .Observaciones.toLowerCase().includes(searchedVal.toLowerCase())
          ;
          });
         setIngresos(filteredRows);
         setPage(0);    
      };
      const cancelSearch = () => {
        setSearched("");
        requestSearch(searched);
      };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    useEffect(() => {
        try {
            FirestoreService.getIngresos(user.ConjuntoUidResidencia).then(doc => {
                if(doc){
                    let items = doc.docs.map(snap => snap);
                    setIngresos(items);
                    filterIngresos(items);
                }
            });
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }, []);
    const StyledTableCell = withStyles((theme) => ({
        head: {
          backgroundColor: "#0B2F4E",
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
        loading?(
          <LoadingData />
        ):(
            <Paper className={classes.root}>
                <br></br><center>
                <div>
                    <h3>Historial de Ingresos</h3>
                </div><br></br>
                </center>
                <div style={{ float: "right" }}>
                    <ListItem>
                        <Avatar>
                            <img
                                src="/assets/img/excel.png"
                                alt="imagen descriptiva de carga de archivos excel"
                                width="50px;"
                            />
                        </Avatar>
                        <ReactHTMLTableToExcel
                            id="export_file"
                            className={"btn btn-success"}
                            table="table_Ingresos"
                            filename="Historial de ingresos guardia"
                            sheet="tablexls"
                            buttonText="Exportar"
                        />
                    </ListItem>
                </div>
                <TableContainer component={Paper}>
                    <SearchBar
                    value={searched}
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    />
                    <Table className={classes.table} id="table_Ingresos" size='small' aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                            <StyledTableCell align="center" key={column.id}>
                                {column.label}
                            </StyledTableCell>
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            {ingresos
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map( (ingreso, ind) => {
                                const data = ingreso.data();
                                return (
                                    <StyledTableRow hover tabIndex={-1} key={ind}>
                                        <StyledTableCell align="center">
                                            {moment(data.Fecha.toDate()).format('ddd DD-MM-YY hh:mm A')}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {data.Nombre}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {data.Observaciones}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <DetallesIngreso
                                                ingreso={data}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    labelRowsPerPage={"Filas por página"}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={ingresos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        )
    )
}
export default Ingresos