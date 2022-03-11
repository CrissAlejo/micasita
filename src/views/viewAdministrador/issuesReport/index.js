import React, { useEffect, useState } from 'react';
import { Paper, Tooltip, IconButton } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from "@material-ui/core";
import LoadingData from 'src/components/Common/LoadingData';
import useSettings from 'src/contextapi/hooks/useSettings';
import { withStyles } from '@material-ui/styles';
import CheckIcon from '@material-ui/icons/CheckCircle';
import * as FirestoreService from './services/firestore';
import useStyles from './Styles';
import moment from 'moment';
import 'moment/locale/es-us'
import Reparados from './listaReparados';
import { useSnackbar } from "notistack";
import NoInfo from 'src/components/Common/NoInfo';

const IssuesReport = () => {
    const classes = useStyles();
    const { settings } = useSettings();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [reportes, setReportes] = useState([]);
    const [reparados, setReparados] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const columns = [
        { id: 'estado', label: 'Estado' },
        { id: 'fecha', label: 'Fecha' },
        { id: 'usuario', label: 'Usuario' },
        { id: 'obs', label: 'Observaciones' },
        { id: 'acciones', label: 'Acciones' },
    ]

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function handleUpdate(id) {
        FirestoreService.updateReporte(settings.idConjunto, id).then(
            () => {
                enqueueSnackbar("Se reparó el daño", {
                    variant: "success",
                });
            }
        ).catch(
            ()=>{
                enqueueSnackbar("Ha ocurrido un problema", {
                    variant: "error",
                });
            }
        );
    }

    useEffect(() => {
        FirestoreService.getReportes(settings.idConjunto, {
            next: res => {
                const filtro = item => item.data().Estado == 1;
                const items = res.docs.map(snap => snap);
                let repo = items.filter( item => filtro(item) )
                let repa = items.filter( item => !filtro(item) )
                setReportes(repo);
                setReparados(repa)
                setLoading(false);
            }
        });
    }, [settings.idConjunto])

    if (loading) {
        return <LoadingData />
    } else {
        return (
            <Paper className={classes.root}>
                <div>
                    <h3>Reportes de Daños</h3>
                </div>
                <Reparados reparados={reparados}/>
                <br />
                {reportes.length > 0 ? (
                    <>
                <TableContainer component={Paper}>
                    <Table size='small' className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {columns.map(col => (
                                    <StyledTableCell align='center' key={col.id}>
                                        {col.label}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reportes
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map( row => {
                                const reporte = row.data();
                                return (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell align='center'>
                                    <div className={classes.estadoerror}>
                                        Pendiente
                                    </div>
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        {moment(reporte.Fecha.seconds*1000).format('ddd, DD-MM-YYYY hh:mm A')}
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        {reporte.DetalleUsuario}
                                    </StyledTableCell>
                                    <StyledTableCell align='center'>
                                        {reporte.Observaciones}
                                    </StyledTableCell>
                                   
                                    <StyledTableCell align='center'>
                                        <Tooltip title="Marcar como reparado">
                                            <IconButton
                                                name={row.id}
                                                edge="end"
                                                aria-label="reparar"
                                                onClick={() => handleUpdate(row.id)}
                                                color='primary'
                                            >
                                                <CheckIcon />
                                            </IconButton>
                                                    
                                        </Tooltip>
                                    </StyledTableCell>
                                </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    labelRowsPerPage={"Filas por página"}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={reportes.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </>
                ) : (
                    <NoInfo />
                )}
            </Paper>
        );
    }
}

export default IssuesReport
