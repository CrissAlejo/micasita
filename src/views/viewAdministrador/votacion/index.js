import React, { useEffect, useState } from 'react'
import { Paper, Dialog, DialogContent, TableContainer,
    TableHead, TableRow, TableCell, Table, TableBody,
    TablePagination, Tooltip, IconButton, DialogTitle,
    DialogContentText, DialogActions} from '@material-ui/core';
import New from './New'
import Button from "../../../components/CustomButtons/Button";
import LoadingData from 'src/components/Common/LoadingData';
import useSettings from 'src/contextapi/hooks/useSettings';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteVotation, getVotation } from './service/firestore';
import NoInfo from 'src/components/Common/NoInfo';
import { withStyles } from '@material-ui/styles';
import { useSnackbar } from "notistack";
import useStyles from './Styles';
import moment from 'moment';
import 'moment/locale/es-us';
import Resultados from './Resultados';

const StyledCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#0B2F4E",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);
const StyledRow = withStyles((theme) => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const Votacion = () => {
    const classes = useStyles();
    const { settings } = useSettings();
    const [page, setPage] = useState(0);
    const [elm, setElm] = useState(null);
    const [limite, setLimite] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [votaciones, setVotaciones] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openAlert, setOpenAlert] = useState(false);
    const columns = [
        {id: 1, label: 'Nombre'},
        {id: 2, label: 'Inicio'},
        {id: 3, label: 'Fin'},
        {id: 4, label: '# participantes'},
        {id: 5, label: 'Acciones'},
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAlert = () => {
		setOpenAlert(false);
	};

    function handleDelete(id) {
		setOpenAlert(true);
		setElm(id);
	}

    const confir = () => {  
        setOpenAlert(false);
        if (elm) {
            deleteVotation(settings.idConjunto, elm).then(() => {
                    enqueueSnackbar("Se eliminó el reporte de daño", {
                        variant: "success",
                    });
                }
			);
		}
	};

    useEffect(() => {
        getVotation(settings.idConjunto, {
            next: res => {
                const items = res.docs.map(snap => snap);
                setVotaciones(items);
                setLimite(items.length);
                setLoading(false);
            }
        })
    }, [settings.idConjunto]);

    if(loading){
        return <LoadingData/>
    } else {
        return (
            <Paper className={classes.root}>
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
                <New limite={limite}/>
                {votaciones.length > 0 ? (
                    <TableContainer style={{marginTop: '10px'}}>
                    <Table size='small' className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {columns.map(col => (
                                    <StyledCell key={col.id} align='center'>
                                        {col.label}
                                    </StyledCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {votaciones
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map( row => {
                                const data = row.data();
                                return (
                                    <StyledRow key={row.id}>
                                        <StyledCell align='center'>
                                            {data.Titulo}
                                        </StyledCell>
                                        <StyledCell align='center'>
                                            {moment(data.Inicio.toDate()).format('DD-MM-YYYY hh:mm A')}
                                        </StyledCell>
                                        <StyledCell align='center'>
                                            {moment(data.Fin.toDate()).format('DD-MM-YYYY hh:mm A')}
                                        </StyledCell>
                                        <StyledCell align='center'>
                                            {data.Participantes.length}
                                        </StyledCell>
                                        <StyledCell align='center'>
                                            <Resultados data={data}/>
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
                                        </StyledCell>
                                    </StyledRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    <TablePagination
                        labelRowsPerPage={"Filas por página"}
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={votaciones.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
                ):(
                    <NoInfo/>
                )}
            </Paper>
        )
    }
}

export default Votacion