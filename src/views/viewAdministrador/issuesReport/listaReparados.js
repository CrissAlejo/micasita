import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Tooltip } from "@material-ui/core";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import Slide from '@material-ui/core/Slide';
import { useSnackbar } from "notistack";
import Button from "../../../components/CustomButtons/Button";
import NoInfo from 'src/components/Common/NoInfo';
import moment from 'moment';
import 'moment/locale/es-us'
import useSettings from 'src/contextapi/hooks/useSettings';
import { deleteReporte } from './services/firestore';


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        backgroundColor: '#0B2F4E'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    estadook:{
        backgroundColor:'#95D890',
        height:'100%',
        width:'100%',
        alignContent:'center',
        alignItems:'center',
        textAlign:'center',
        alignSelf:'center'
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function Reparados({reparados}) {
    const { settings } = useSettings();
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [elm, setElm] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { enqueueSnackbar } = useSnackbar();
    const columns = [
        {id:'estado' ,label: 'Estado'},
        {id:'fecha' ,label: 'Fecha'},
        {id:'usuario' ,label: 'Usuario'},
        {id:'obs' ,label: 'Observaciones'},
        {id:'acciones' ,label: 'Acciones'},
    ]
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleAlert = () => {
		setOpenAlert(false);
	};

	const confir = () => {
        setOpenAlert(false);
        if (elm) {
            deleteReporte(settings.idConjunto, elm).then(() => {
                    enqueueSnackbar("Se eliminó el reporte de daño", {
                        variant: "success",
                    });
                }
			);
		}
	};

	function handleDelete(event) {
		setOpenAlert(true);
		setElm(event);
	}

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            <Button variant="outlined" color="danger" onClick={handleClickOpen}>
                Daños reparados
            </Button>
            <Dialog
                open={openAlert}
                onClose={handleAlert}
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
                    <Button autoFocus onClick={handleAlert} color="danger">
                        Cancelar
                    </Button>
                    <Button onClick={confir} color="warning">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Daños reparados
                        </Typography>
                    </Toolbar>
                </AppBar>
                {
                    reparados.length > 0 ? (
                        <>
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
                            {reparados
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map( row => {
                                const reporte = row.data();
                                return (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell align='center'>
                                    <div className={classes.estadook}>
                                        Reparado
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
                                        <Tooltip title="eliminar">
                                            <IconButton
                                                name={row.id}
                                                edge="end"
                                                aria-label="reparar"
                                                onClick={() => handleDelete(row.id)}
                                                color='primary'
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                                    
                                        </Tooltip>
                                    </StyledTableCell>
                                </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <TablePagination
                        labelRowsPerPage={"Filas por página"}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={reparados.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    </>
                    ) : (
                        <NoInfo/>
                    )
                }
            </Dialog>
        </div>
    );
}