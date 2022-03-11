import React, { useState, useEffect } from 'react'
import numeral from 'numeral';
import { Paper, Grid, Box, CircularProgress, CardHeader, Tooltip, IconButton } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import TablePagination from '@material-ui/core/TablePagination';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";
import Button from "../../../../components/CustomButtons/Button";
import useSettings from "../../../../contextapi/hooks/useSettings";
import useStyles from './useStyles'
import NewOrEdit from './newOrEdit/NewOrEdit';
import * as FirestoreService from "./services/firebase";
import NoInfo from 'src/components/Common/NoInfo';
import DetallesCaja from './DetallesCaja';
import NewTransferencia from './newTransferencia/NewTransferencia';
import moment from 'moment';

const Cajas = () => {
	const classes = useStyles();
	const { settings } = useSettings();
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [cajas, setCajas] = useState([]);
	const [elm, setElm] = useState(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const columns = [
		{ id: 'caja', label: 'Nombre' },
		{ id: 'fecha', label: 'Fecha de Corte' },
		{ id: 'saldo', label: 'Saldo Inicial' },
		{ id: 'acciones', label: 'Acciones' },
	];

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

	useEffect(() => {
		try {
			FirestoreService.getCajasbyConjunto(
				{
					next: (querySnapshot) => {
						const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
						setCajas(Items);
						setLoading(false);
					},
				},
				settings.idConjunto
			);
		} catch (e) { }
	}, [settings.idConjunto]);

	const handleClose = () => {
		setOpen(false);
	};

	const confir = () => {
		setOpen(false);
		setLoading(true);

		if (elm) {
			FirestoreService.deleteCaja(settings.idConjunto, elm).then(() => {
				setLoading(false);
			}
			);
		}
	};

	function deleteCaja(event) {
		setOpen(true);
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
		!loading ? (
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
				<CardHeader title="Cajas" />
				<Grid container justifyContent='space-between'>
					<Grid items xs={12} md={2}>
						<NewOrEdit cajaData={null} />
					</Grid>
					<Grid items xs={12} md={10}>
						<NewTransferencia />
					</Grid>
				</Grid>
				{cajas.length > 0 ? (
					<>
						<TableContainer component={Paper} style={{ margin: '10px 0' }}>
							<Table className={classes.table} size='small' aria-label="customized table">
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
									{cajas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map(caja => (
											<StyledTableRow hover tabIndex={-1} key={caja.id}>
												<StyledTableCell align="center">
													{caja.data().NombreCaja}
												</StyledTableCell>
												<StyledTableCell align="center">
													{moment(caja.data().FechaCorte.seconds*1000).format('L')}
												</StyledTableCell>
												<StyledTableCell align="center">
													${parseFloat(caja.data().SaldoInicial).toFixed(2)}
												</StyledTableCell>
												<StyledTableCell>
													<Grid
														container
														spacing={0}
														alignItems="center"
														justifyContent="center"
													>
														<Tooltip title="Eliminar">
															<IconButton
																aria-label="eliminar"
																onClick={() => deleteCaja(caja.id)}
															>
																<DeleteIcon />
															</IconButton>
														</Tooltip>
														<NewOrEdit cajaData={caja} />
														<DetallesCaja cajaData={caja} />
													</Grid>
												</StyledTableCell>
											</StyledTableRow>
										))}
								</TableBody>
							</Table>
						</TableContainer>
						<TablePagination
						labelRowsPerPage={"Filas por página"}
							rowsPerPageOptions={[5, 10, 25]}
							component="div"
							count={cajas.length}
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
		) : (
			<Box display='flex' justifyContent='center' alignSelf='center'>
				<CircularProgress />
			</Box>
		)
	)
}

export default Cajas