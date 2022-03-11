import React, { useState } from "react";
import PropTypes from "prop-types";
import Page from "../../../components/Common/Page";
import useStyles from "./useStyles";
import * as FirestoreService from "./services/firestore";
import useAuth from "../../../contextapi/hooks/useAuth";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { Tooltip, IconButton, Checkbox, Toolbar } from "@material-ui/core";
import { Grid, ListItem, Avatar, TableContainer } from "@material-ui/core";
import moment from "moment";
import { useSnackbar } from "notistack";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from 'src/components/CustomButtons/Button';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchBar from "material-ui-search-bar";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

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

const showInMapClicked = (lat, long) => {
	window.open("https://maps.google.com/?q=" + lat + "," + long);
};

const Dashboard = () => {
	const classes = useStyles();
	const { user } = useAuth();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [alertas, setAlertas] = useState([]);
	const [filteredAlertas, setFilteredAlertas] = useState([]);
	const { enqueueSnackbar } = useSnackbar();
	const [searched, setSearched] = useState("");
	const [open, setOpen] = useState(false);
	const [elm, setElm] = useState(null);
    const [selectedAlerts, setSelectedAlerts] = useState([]);
	const columns = [
		{ id: 0, label: "" },
		{ id: "Detalle", label: "Detalle" },
		{ id: "Fecha", label: "Fecha" },
		{ id: "Estado", label: "Estado" },
		{ id: "Imagen", label: "Imagen" },
		{ id: "Ubicacion", label: "Ubicación" },
		{ id: "Usuario", label: "Usuario" },
	];

	function handleDelete(item, action) {
		setOpen(true);
		setElm({id:item,action});
	}

	const handleClose = () => setOpen(false)

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const confir = () => {
		setOpen(false);
		if (elm.action == 'update') {
			FirestoreService.updateestado(user.ConjuntoUidResidencia, elm.id);
		}else{
			FirestoreService.deleteAlerta(user.ConjuntoUidResidencia, elm.id);
		}
		setSelectedAlerts([]);
	};
	const getConjuntoById = React.useCallback(() => {
		try {
			FirestoreService.getAlertasAll(
				{
					next: (querySnapshot) => {
						const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
						setAlertas(Items);
						setFilteredAlertas(Items);
					},
				},
				user.ConjuntoUidResidencia
			);
		} catch (e) { }
	}, [user.ConjuntoUidResidencia]);

	const requestSearch = (searchedVal) => {
		const filteredRows = alertas.filter((row) => {
			let estadodb = row.data().Estado == 1 ? 'pendiente': 'resuelta';
			return moment(row.data()
				.Fecha.toDate()).format('ddd DD-MM-YY hh:mm A').includes(searchedVal) || row.data()
					.DatosUsuario?.toLowerCase()?.includes(searchedVal.toLowerCase()) || row.data()
						.Detalle.toLowerCase().includes(searchedVal.toLowerCase()) || estadodb.includes(searchedVal.toLowerCase())
		});
		setFilteredAlertas(filteredRows);
		setPage(0);
	};
	const cancelSearch = () => {
		setSearched("");
		requestSearch(searched);
	};
	const isChecked = (id,estado) => selectedAlerts.indexOf(JSON.stringify({id,estado})) !== -1;
	const handleCheckboxClick = (event, id, estado) => {
		if (selectedAlerts.length>0) {
			const estadoAl = JSON.parse(selectedAlerts[0]).estado;
			if (estadoAl != estado) {
				enqueueSnackbar('solo puede marcar alertas con el mismo estado', {variant: 'error'});
				return;
			}
		}
		event.stopPropagation();
		const selectedIndex = selectedAlerts.indexOf(JSON.stringify({id,estado}));
		let newSelected = [];
	
		if (selectedIndex === -1) {
		  newSelected = newSelected.concat(selectedAlerts, JSON.stringify({id,estado}));
		} else if (selectedIndex === 0) {
		  newSelected = newSelected.concat(selectedAlerts.slice(1));
		} else if (selectedIndex === selectedAlerts.length - 1) {
		  newSelected = newSelected.concat(selectedAlerts.slice(0, -1));
		} else if (selectedIndex > 0) {
		  newSelected = newSelected.concat(
			selectedAlerts.slice(0, selectedIndex),
			selectedAlerts.slice(selectedIndex + 1)
		  );
		}
	
		setSelectedAlerts(newSelected);
	};

	React.useEffect(() => {
		getConjuntoById();
	}, [getConjuntoById]);
	return (
		<Paper className={classes.root}>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="draggable-dialog-title"
			>
				<DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
					{elm?.action=='update'? 'Actualizar estado': 'Eliminar'}
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						¿Estas seguro que quieres {elm?.action=='update'? 'resolver': 'eliminar'} {selectedAlerts.length} alerta(s)?
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

			<Grid item xs={12}>
				<center>
					<h3>Historial de Alertas</h3>
				</center>
			</Grid>
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
						table="table_Alertas"
						filename="Historial de Alertas"
						sheet="tablexls"
						buttonText="Exportar"
					/>
				</ListItem>
			</div>
			<TableContainer component={Paper}>
				{selectedAlerts.length>0?(
					<Toolbar>
						<div className={classes.subtituloCon} style={{margin: 0, padding: 0, width: '-webkit-fill-available'}}>
						{selectedAlerts.length} alerta(s) seleccionada(s)
						</div>
						<div style={{flex: '1 1 100%'}}/>
						<div style={{flex:'0 0 auto'}}>
							{selectedAlerts[0].includes('"estado":1') ? (
								<Tooltip title='resolver alertas'>
									<IconButton
										onClick={()=>handleDelete(selectedAlerts, 'update')}
									>
										<VerifiedUserIcon style={{ color: 'green' }}/>
									</IconButton>
								</Tooltip>
							):(
								<Tooltip title='eliminar alertas'>
									<IconButton
										onClick={()=>handleDelete(selectedAlerts, 'delete')}
									>
										<DeleteIcon style={{ color: 'red' }}/>
									</IconButton>
								</Tooltip>
							)}
						</div>
					</Toolbar>
				):(
					<SearchBar
						value={searched}
						onChange={(searchVal) => requestSearch(searchVal)}
						onCancelSearch={() => cancelSearch()}
					/>
				)}
				<Table className={classes.table} id='table_Alertas' size="small" aria-label="customized table">
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
						{filteredAlertas
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, index) => {
								const checked = isChecked(row.id, row.data().Estado);
								return (
									<StyledTableRow hover tabIndex={-1} key={index}>
										<StyledTableCell>
											<Checkbox
												onClick={event =>
													handleCheckboxClick(event, row.id, row.data().Estado)
												}
												checked={checked}
												style={{color:"#051e34"}}
											/>
										</StyledTableCell>
										<StyledTableCell align="center">
											{row.data().Detalle || '----'}
										</StyledTableCell>
										<StyledTableCell align="center">
											{moment(row.data().Fecha.toDate()).format('ddd DD-MM-YY hh:mm A')}
										</StyledTableCell>
										<StyledTableCell align="center" className={row.data().Estado ? classes.estadoerror : classes.estadook}>{row.data().Estado?'Pendiente':'Resuelta'}</StyledTableCell>
										<StyledTableCell align="center">
											{row.data().Imagen ? (
												<img
													src={row.data().Imagen}
													alt="logo"
													width="100"
													height="100"
												/>
											) : (
												'Sin imagen'
											)}
										</StyledTableCell>
										<StyledTableCell align="center">
											<Tooltip title='mostrar en mapa'>
												<IconButton variant="outlined"
													color="primary"
													onClick={() =>
														showInMapClicked(
															row.data().Latitud,
															row.data().Longitud
														)}
												>
													<PersonPinCircleIcon />
												</IconButton>
											</Tooltip>
										</StyledTableCell>
										<StyledTableCell align="center">
											{row.data().DatosUsuario}
										</StyledTableCell>
									</StyledTableRow>
								);
							})}
					</TableBody>
				</Table>
			<TablePagination
				labelRowsPerPage='Filas por página'
				rowsPerPageOptions={[10, 25, 50]}
				component="div"
				count={filteredAlertas.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
			</TableContainer>
		</Paper>
	);
};

Dashboard.propTypes = {
	children: PropTypes.node,
};

export default Dashboard;
