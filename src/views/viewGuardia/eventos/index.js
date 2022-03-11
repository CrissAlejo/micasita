import React, { useEffect, useState } from 'react'
import LoadingData from 'src/components/Common/LoadingData';
import * as FirestoreService from './service/firestore'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, ListItem, Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import NoInfo from "../../../components/Common/NoInfo";
import DetallesEvento from './DetalleEvento'
import useStyles from '../rondas/Styles';
import useAuth from 'src/contextapi/hooks/useAuth';
import moment from 'moment';
import 'moment/locale/es-mx'
import SearchBar from "material-ui-search-bar";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
const Eventos = () => {
    const classes = useStyles();
    const [searched, setSearched] = useState("");
    const [loading, setLoading] = useState(true)
    const [eventos, setEventos] = useState([]);
    const [eventosfiler, filterEventos] = useState([]);
    const { user } = useAuth();
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const columns = [
        { id: 1, label: "Fecha y Hora" },
        { id: 2, label: "Nombre" },
        { id: 3, label: "Observación" },
        { id: 4, label: "Relacionado a" },
        { id: 5, label: "Acciones" }
    ];
    const requestSearch = (searchedVal) => {
        const filteredRows = eventosfiler.filter((row) => {
            return moment(row.data().Fecha.toDate()).format('ddd DD-MM-YY hh:mm A').includes(searchedVal) || row.data()
                .Nombre?.toLowerCase()?.includes(searchedVal.toLowerCase()) || row.data()
                    .Observaciones?.toLowerCase()?.includes(searchedVal.toLowerCase()) || row.data()
                    .Residentes?.includes(searchedVal.toLowerCase())
        });
        setEventos(filteredRows);
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
            FirestoreService.getEventos(user.ConjuntoUidResidencia).then(doc => {
                if (doc) {
                    let items = doc.docs.map(snap => snap)
                    setEventos(items)
                    filterEventos(items)
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
        loading ? (
            <LoadingData />
        ) : (
            <Paper className={classes.root}>
                <br></br><center>
                    <div>
                        <h3>Historial de Novedades</h3>
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
                            table="table_Novedades"
                            filename="Historial de Novedades"
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
                    <Table className={classes.table} id='table_Novedades' size='small' aria-label="customized table">
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
                            {eventos
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((evento, ind) => {
                                    const data = evento.data();
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
                                                {data.Residentes?.map(res=>res) || '-----'}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">
                                                <DetallesEvento
                                                    evento={data}
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
                    count={eventos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        )
    )
}
export default Eventos