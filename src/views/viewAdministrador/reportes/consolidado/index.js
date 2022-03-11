import React, { useState, useEffect } from 'react';
import Button from '../../../../components/CustomButtons/Button'
import DateFnsUtils from '@date-io/date-fns';
import useStyles from "./useStyles"
import * as FirestoreService from './service/firebase';
import { es } from 'date-fns/locale'
import { Paper, Grid, IconButton,ListItem,Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import useSettings from "../../../../contextapi/hooks/useSettings";
import LoadingData from "../../../../components/Common/LoadingData";
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import { format } from 'date-fns';
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: "#0B2F4E",
		color: theme.palette.common.white,
	},
	body: {
		fontSize: 14,
	},
}))(TableCell);
const StyledTableCell2 = withStyles((theme) => ({
	head: {
		backgroundColor: "#3c6382",
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

const Columns = ['Detalle', 'Valor Parcial', 'Valor Total'];

function Row(props) {
	const { row } = props;
	const [open, setOpen] = React.useState(true);

	return (
		<React.Fragment>
			<TableRow onClick={() => setOpen(!open)}>
				<StyledTableCell>
					<IconButton
						aria-label="expand row"
						size="small"
					>
						{open ? <ArrowUpIcon /> : <ArrowDownIcon />}
					</IconButton>
					<b>{row.name}</b>
				</StyledTableCell>
				<StyledTableCell />
				<StyledTableCell>$ {parseFloat(row.valor).toFixed(2)}</StyledTableCell>
			</TableRow>
			<TableRow>
				<StyledTableCell style={{ paddingTop: 0, paddingBottom: 0 }} colSpan={3}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Table size="small" aria-label="purchases">
								<TableBody>
									{row.subtable.length > 0 && row.subtable.map((subRow, ind) => (
										<>
											<TableRow key={ind}>
												<StyledTableCell2 style={{ width: '55%' }}>
													<b>{subRow.name}</b>
												</StyledTableCell2>
												<StyledTableCell2 style={{ width: '13%' }}>
													$ {parseFloat(subRow.valor).toFixed(2)}
												</StyledTableCell2>
												<StyledTableCell2 style={{ paddingLeft: '25px' }} />
											</TableRow>
											{subRow.subrubros ? subRow.subrubros.map((sub) => (
												<TableRow key={sub.id}>
													<StyledTableCell2 style={{ width: '55%', paddingLeft: '30px' }}>
														{sub.id}
													</StyledTableCell2>
													<StyledTableCell2 style={{ width: '13%' }}>
														$ {parseFloat(sub.valor).toFixed(2)}
													</StyledTableCell2>
													<StyledTableCell2 style={{ paddingLeft: '25px' }} />
												</TableRow>
											)) : ''}
										</>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</StyledTableCell>
			</TableRow>
		</React.Fragment>
	);
}

const Consolidado = () => {
	const { settings } = useSettings();
	const classes = useStyles();
	const [loading, setLoading] = useState(true);
	const d = new Date();
	const [fechaDesde, setFechaDesde] = useState(new Date(d.getFullYear(), d.getMonth(), 1));
	const [fechaHasta, setFechaHasta] = useState(new Date());
	const [rubros, setRubros] = useState([]);
	const [cuentas, setCuentas] = useState([]);
	const [rows, setRows] = useState([]);
	useEffect(() => {
		(async () => {
			try {
				let rubros = await FirestoreService.getRubros(settings.idConjunto);
				rubros = rubros.docs.map(doc => doc.data());
				setRubros(rubros)
				let bancos = await FirestoreService.getCuentasbyConjunto(settings.idConjunto);
				bancos = bancos.docs.map(doc => doc)
				setCuentas(bancos);

			} catch (e) {
				console.log(e)
			}
		})();
	}, [settings.idConjunto]);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const iniTransf = await getTransfIni()
			const {finTransf, transfSinApro} = await getTransfHasta();
			const {ingresosFin, ingresosSinId} = await getIngresos();
			const egresosFin = await getEgresos();
			let cobrar = { name: 'Total Cuotas Pendientes de Cobro', valor: 0 };
			let pendCobro = await FirestoreService.cuentasCobrar(settings.idConjunto, fechaDesde, fechaHasta)
			pendCobro.docs.map(query => query.data()).forEach(c => {
				if(c.SubRubro == 'Alícuota mensual') cobrar.valor += c.Valor * 1;
			})
			let pagar = { name: 'Total de Adeudo a Proveedores', valor: 0 };
			let pendPagar = await FirestoreService.cuentasPagar(settings.idConjunto, fechaDesde, fechaHasta);
			pendPagar.docs.map(query => query.data()).forEach(c => {
				pagar.valor += c.Valor * 1;
			})
			setData(ingresosFin, ingresosSinId, egresosFin, iniTransf, finTransf, transfSinApro, cobrar, pagar);
		})();
	}, [cuentas, fechaDesde, fechaHasta]);

	function setData(ingresosFin, ingresosSinId, egresosFin, iniTransf, finTransf, transfSinApro, cobrar, pagar) {
		const dataIng = filterValores(ingresosFin, 'Ingreso')
		const dataEgr = filterValores(egresosFin, 'Egreso')
		let row = [
			formatData(iniTransf, `Saldo inicial al ${format(fechaDesde, 'yyyy-MM-dd')}`),
			formatData(dataIng, 'Ingresos'),
			formatData(dataEgr, 'Egresos'),
			formatData(finTransf, `Saldo final al ${format(fechaHasta, 'yyyy-MM-dd')}`),
			{
				name: 'Ingresos y egresos pendientes',
				valor: 0,
				subtable: [cobrar, pagar],
			}
		];
		row[1].subtable.unshift(ingresosSinId, transfSinApro);
		setRows(row);
		setLoading(false);
	}

	function filterValores(arr, tipo) {
		let valores = [];
		let rub = rubros.filter(rub => rub.Tipo == tipo)
		rub.forEach(rubro => {
			let subr = [];
			let totalRub = 0;
			rubro.SubRubros.forEach(subrubro => {
				let total = 0;
				const data = arr.filter(elem => elem.SubRubro == subrubro)
				data.forEach(cur => { total += cur.Valor * 1 })
				subr.push({ id: subrubro, valor: total });
				totalRub += total;
			})
			valores.push({ name: rubro.Nombre, valor: totalRub, subrubros: subr })
		})
		return valores;
	}

	function formatData(arr, name) {

		let valor = 0;
		arr.forEach(item => { valor += item.valor })

		return {
			name,
			valor,
			subtable: arr,
		}

	}
	async function getTransfHasta() {
		let dataBancos = [];
		let transfSinApro = { name: 'Anticipos por cruzar', valor: 0 };
		let ingresos = await FirestoreService.getValoresIniciales(settings.idConjunto, 'ingresos', fechaHasta)
		ingresos = ingresos.docs.map(doc => doc.data());
		let egresos = await FirestoreService.getValoresIniciales(settings.idConjunto, 'egresos', fechaHasta)
		egresos = egresos.docs.map(doc => doc.data());

		cuentas.forEach(cuenta => {
			FirestoreService.getTransferencias(settings.idConjunto, cuenta.id, fechaDesde, fechaHasta)
				.then((doc) => {
					const data = doc.docs.map(query => query.data())
					data.forEach(t => {
						if (t.Estado == 'Pendiente') {
							transfSinApro.valor += t.Valor * 1;
						}
					})
				});
			let total = 0;
			ingresos.forEach(ingreso => {
				if (ingreso.CuentaUid == cuenta.id) {
					total += ingreso.Valor * 1;
				}
			})
			egresos.forEach(egreso => {
				if (egreso.CuentaUid == cuenta.id) {
					total -= egreso.Valor * 1;
				}
			})
			dataBancos.push({ name: `${cuenta.data().Banco} - ${cuenta.data().NumeroCuenta}`, valor: total })
		})
		return {
			finTransf: dataBancos,
			transfSinApro
		};
	}
	async function getTransfIni() {
		let dataBancos = []
		let ingIni = await FirestoreService.getValoresIniciales(settings.idConjunto, 'ingresos', fechaDesde);
		ingIni = ingIni.docs.map(doc => doc.data());
		let egrIni = await FirestoreService.getValoresIniciales(settings.idConjunto, 'egresos', fechaDesde);
		egrIni = egrIni.docs.map(doc => doc.data());
		cuentas.forEach(cuenta => {
			let total = 0;
			ingIni.forEach(ing => {
				if (ing.CuentaUid == cuenta.id) {
					total += ing.Valor * 1;
				}
			})
			egrIni.forEach(egr => {
				if (egr.CuentaUid == cuenta.id) {
					total -= egr.Valor * 1;
				}
			})
			dataBancos.push({ name: `${cuenta.data().Banco} - ${cuenta.data().NumeroCuenta}`, valor: total })
		})
		return dataBancos;
	}
	async function getIngresos() {
		const doc = await FirestoreService.getValores(settings.idConjunto, 'ingresos', fechaDesde, fechaHasta);
		const Items = doc.docs.map((snap) => snap.data());
		const data1 = Items.filter(item => item.Usuario != 'Sin Usuario')
		const data2 = Items.filter(item => item.Usuario == 'Sin Usuario')
		let val = 0;
		if (data2.length > 0) {
			data2.forEach(item => {
				val += item.data().Valor * 1;
			})
		}
		return {
			ingresosFin: data1,
			ingresosSinId: { name: 'Ingresos sin identificar', valor: val }
		}
	}
	async function getEgresos() {
		const doc = await FirestoreService.getValores(settings.idConjunto, 'egresos', fechaDesde, fechaHasta);
		const Items = doc.docs.map((snap) => snap.data());
		return Items;
	}
	
	return (
		!loading ? (
			<Paper className={classes.root}>
				<Grid container justifyContent="space-between">
					<Grid item xs md={6}>
						<h3>
							<AssessmentIcon />
							Reporte Consolidado del Condominio
						</h3>
					</Grid>
					<Grid item xs md={6}>
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
								id="test-table-xls-button"
								className={"btn btn-success"}
								table="table-to-xls"
								filename="Reporte de cuentas por pagar"
								sheet="tablexls"
								buttonText="Exportar"
								/>
							</ListItem>
						</div>
					</Grid>
				</Grid>
				<MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
					<Grid container justifyContent="space-around">
						<DatePicker
							disableToolbar
							inputVariant="outlined"
							variant="inline"
							format="MM/dd/yyyy"
							label="Only calendar"
							label="Reporte desde:"
							helperText="Escoja la fecha de inicio"
							value={fechaDesde}
							onChange={(date) => setFechaDesde(date)}
						/>
						<DatePicker
							disableToolbar
							inputVariant="outlined"
							variant="inline"
							format="MM/dd/yyyy"
							label="Only calendar"
							label="Reporte hasta:"
							helperText="Escoja la fecha final"
							value={fechaHasta}
							onChange={(date) => setFechaHasta(date)}
						/>
					</Grid>
				</MuiPickersUtilsProvider>
				<br />
				<TableContainer>
					<Table id="table-to-xls" aria-label="collapsible table" className={classes.table}>
						<TableHead>
							<StyledTableRow>
								{Columns.map(col => (
									<StyledTableCell key={col}>{col}</StyledTableCell>
								))}
							</StyledTableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<Row key={row.name} row={row} />
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
		) : (
			<LoadingData />
		)
	);
}

export default Consolidado