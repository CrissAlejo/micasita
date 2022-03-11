import React, { Fragment, useState, useEffect } from 'react'
import useSettings from "../../../../contextapi/hooks/useSettings";
import SearchBar from "material-ui-search-bar";
import useStyles from './useStyles';
import Table from "@material-ui/core/Table";
import { withStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeIcon from '@material-ui/icons/Home';
import * as FirestoreService from '../services/firestore'
import { Paper } from '@material-ui/core'
import { Button } from '@material-ui/core';
import NoInfo from 'src/components/Common/NoInfo';
import { useSnackbar } from 'notistack';
var ServidorFCM = require('node-gcm');
const ViewReservas = () => {
	const { enqueueSnackbar } = useSnackbar();
	const { settings } = useSettings();
	const classes = useStyles();
	const [searched, setSearched] = React.useState("");
	const [filterUsuario, setfilterUsuario] = React.useState([]);
	const [area, setArea] = useState([]);
	const [reservas, setReservas] = useState([]);
	const [usu, setUsu] = useState([]);
	const [nuevo, setNuevo] = useState([]);
	const [page, setPage] = React.useState(0);
	const [valTab, setValTab] = React.useState(null);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [usuariosC, setUsuariosC] = useState([]);
	const columns = [
		{ id: "usuarios", label: "Usuarios" },
		{ id: "aforo", label: "Áforo" },
		{ id: "fecha", label: "Fecha" },
		{ id: "estado", label: "Estado" },
		{ id: "acciones", label: "Acciones" },
	];

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	function rechazar(aforoID, usuarioID, tokenID, fechaID, docID) {
		var conjunto = [];
		var aforo = 0;
		var aforoF = 0;
		reservas.forEach(document => {
			if (document.data().time === fechaID) {
				conjunto.push(document.data().usuario);
				aforo = document.data().aforo;
			}
		})
		aforoF = aforo - aforoID;
		var reservasActuales = JSON.parse(conjunto);
		var cont = reservasActuales.length;
		var reservasActuales = reservasActuales.filter(function (newreservas) {
			return newreservas.usuario !== usuarioID;
		});
		const newReservas = JSON.stringify(reservasActuales);
		if (cont === 1) {
			FirestoreService.deleteresva(settings.idConjunto, nuevo, docID)
		}
		else {
			FirestoreService.updateresva(settings.idConjunto, nuevo, docID, newReservas, aforoF)
		}
		enqueueSnackbar("Reserva rechazada, se envió la notificación la residente", {
			variant: "success",
		});
		var token = tokenID.split(',');
		var sender = new ServidorFCM.Sender('AAAAQSgq8kc:APA91bHQmE-lNIrpVPsKXddyaxl4TVnNg-G0zlR8mAB9eKMqpdUZYE7Mi043WJWEXEU_DIydiFgy6jv0VqnmZlJZ8WBBhFKL_2NbYKlQ9QtSuJ4W6QtOMNEBix4SENU-rw6xTMx2VOKC');
		var message = new ServidorFCM.Message({
			notification: {
				title: `Reserva de ${area[valTab].data().Nombre}`,
				body: `Su reserva para ${fechaID} ha sido rechazada comuníquese con el administrador`
			},
			data: {
				your_custom_data_key: 'your_custom_data_value'
			}
		});
		sender.send(message, { registrationTokens: token }, function (err, response) {
			if (err) console.error(err);
			else console.log(response);
		});
	}
	const cancelSearch = () => {
		setSearched("");
		requestSearch(searched);
	};
	const requestSearch = (searchedVal) => {
		const filteredRows = filterUsuario.filter((row) => {
			return row.usuario.toLowerCase().includes(searchedVal.toLowerCase()) || row
				.fecha.toLowerCase().includes(searchedVal.toLowerCase()) || row
				.status.toLowerCase().includes(searchedVal.toLowerCase())
		});
		setUsu(filteredRows);
		setPage(0);
	};
	const StyledTableRow = withStyles((theme) => ({
		root: {
			"&:nth-of-type(odd)": {
				backgroundColor: theme.palette.action.hover,
			},
		},
	}))(TableRow);
	const StyledTableCell = withStyles((theme) => ({
		head: {
			backgroundColor: "#051e34",
			color: theme.palette.common.white,
		},
		body: {
			fontSize: 14,
		},
	}))(TableCell);
	const handleChangeTab = (event, value) => {
		FirestoreService.getHoras(settings.idConjunto, area[value].id, {
			next: (querySnapshot) => {
				const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
				setReservas(Items)
				userList(Items)
			},
		})
		setValTab(value);
		setNuevo(area[value].id)
	};
	function aprobar(tokenID, fecha, userID) {
		let resvApro = reservas.find(resv => resv.data().time === fecha);
		let updateUsers = JSON.parse(resvApro.data().usuario).map(usr => {
			if(usr.usuario == userID) usr.status = 1;
			return usr
		})
		FirestoreService.updateresv(settings.idConjunto, nuevo, resvApro.id, {usuario:JSON.stringify(updateUsers)})
			.then(()=>{
				enqueueSnackbar("Reserva aprobada, se envió la notificación la residente", {
					variant: "success",
				});
			})
		var token = tokenID.split(',');
		var sender = new ServidorFCM.Sender('AAAAQSgq8kc:APA91bHQmE-lNIrpVPsKXddyaxl4TVnNg-G0zlR8mAB9eKMqpdUZYE7Mi043WJWEXEU_DIydiFgy6jv0VqnmZlJZ8WBBhFKL_2NbYKlQ9QtSuJ4W6QtOMNEBix4SENU-rw6xTMx2VOKC');
		var message = new ServidorFCM.Message({
			notification: {
				title: `Reserva de ${area[valTab].data().Nombre}`,
				body: `¡Su reserva con fecha ${fecha} ha sido aprobada!`
			},
			data: {
				your_custom_data_key: 'your_custom_data_value'
			}
		});
		sender.send(message, { registrationTokens: token }, function (err, response) {
			if (err) console.error(err);
			else console.log(response);
		});
	}
	useEffect(() => {
		try {
			FirestoreService.getAreaComu(settings.idConjunto, {
				next: (querySnapshot) => {
					const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
					setArea(Items);
				},
			});
			FirestoreService.getUserByConjunto(settings.idConjunto, {
				next: (querySnapshot) => {
					const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
					setUsuariosC(Items);
				},
			});
		} catch (e) { }
		
	}, [settings.idConjunto]);
	function userList(reservas) {
		if (reservas.length > 0) {
			let usu = [];
			reservas.forEach(r => {
				JSON.parse(r.data().usuario).sort((a,b)=> a.status - b.status).forEach(u => {
					let user = u.usuario
					let p = u.personas
					user = usuariosC.filter(usr => usr.data().Correo === user)
					let token = user.length > 0 ? `${user[0].data().tokens}` : "Error"
					let id = user.length > 0 ? `${user[0].id}` : "Error"
					let status = u.status ? 'aprobada' : 'pendiente'
					user = user.length > 0 ? `${user[0].data().Nombre} ${user[0].data().Apellido} - ${user[0].data().Casa}` : "Administración"
					usu.push({ 'doc': r.id, 'token': token, 'id': id, 'usuario': user, 'personas': p, 'fecha': r.data().time, status});
				})
			})
			setUsu(usu)
			setfilterUsuario(usu)
			return;
		}
		setUsu([])
	}

	return (
		<Paper className={classes.root}>
			<AppBar position="static" color="default">
				<Tabs
					value={valTab}
					onChange={handleChangeTab}
					variant="scrollable"
					scrollButtons="on"
					indicatorColor="primary"
					textColor="primary"
				>
					{area.map((row, i) => {
						return (
							<Tab key={i} label={row.data().Nombre + "  Desde: " + row.data().HoraInicio + " Hasta: " + row.data().HoraFin + " Garantia: " + row.data().Garantia + "$"} icon={<HomeIcon />} />
						);
					})
					}
				</Tabs>
			</AppBar>
			{valTab != null ? (
			<Box style={{marginTop: '20px'}}>
				<Link
					to={"/administrador/reservas/reserva/" + nuevo}
					style={{ textDecoration: "none", color: "inherit"}}
				>
					<Button variant="contained" size="large" color="primary">
						Reservar
					</Button>
				</Link>
				<SearchBar
					value={searched}
					onChange={(searchVal) => requestSearch(searchVal)}
					onCancelSearch={() => cancelSearch()}
				/>
				<Table className={classes.table} size='small' aria-label="customized table">
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
					{usu.length > 0 ? usu.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((u, i) => (
							<StyledTableRow hover tabIndex={-1} key={i}>
								<StyledTableCell align="center">
									{u.usuario}
								</StyledTableCell>
								<StyledTableCell align="center">
									Áforo: {u.personas}
								</StyledTableCell>
								<StyledTableCell align="center">
									{u.fecha}
								</StyledTableCell>
								<StyledTableCell align="center">
									{u.status}
								</StyledTableCell>
								<StyledTableCell align="center">
									{u.status == 'pendiente' && (
										<>
										<Button variant="outlined" size="small" onClick={() => aprobar(u.token, u.fecha, u.id)} color="primary">
											Aprobar
										</Button>
										<Button size="small" variant="outlined" onClick={() => rechazar(u.personas, u.id, u.token, u.fecha, u.doc)} color="primary">
											Rechazar
										</Button>
										</>
									)}
								</StyledTableCell>
							</StyledTableRow>
						)
					) : (
						<TableRow>
							<TableCell colSpan={6}>
								<NoInfo/>
							</TableCell>
						</TableRow>
					)}
					</TableBody>
				</Table>
				<TablePagination
					labelRowsPerPage='Filas por página'
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={usu.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Box>
			):(
				<Box className={classes.absoluteCenter}>
					<h3>Escoge un área comunal</h3>
				</Box>
			)}
		</Paper>
	)
}
export default ViewReservas