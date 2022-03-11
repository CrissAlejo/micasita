import React, { Fragment } from "react";
import useSettings from "../../../contextapi/hooks/useSettings";
import { useParams } from "react-router-dom";
import useStyles from "../useStyles";
import * as FirestoreService from "../services/firestore";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

function VerPres(props) {
    const classes = useStyles();
    const { settings } = useSettings();
    const [page] = React.useState(0);
    const [rowsPerPage] = React.useState(10);
    const { threadKey } = useParams();
    const [formulario2, setFormulario2] = React.useState("-");
    const [nombrePresu, setNombrePresu] = React.useState("");
    const [rubIng, setRubIng] = React.useState([]);
    const [rubEgr, setRubEgr] = React.useState([]);
    const [presIng, setPresIng] = React.useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [presEgr, setPresEgr] = React.useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const columnsR = [
        { id: "name", label: "Rubro" },
        { id: "ene", label: "Enero" },
        { id: "feb", label: "Febrero" },
        { id: "mar", label: "Marzo" },
        { id: "abr", label: "Abril" },
        { id: "may", label: "Mayo" },
        { id: "jun", label: "Junio" },
        { id: "jul", label: "Julio" },
        { id: "ago", label: "Agosto" },
        { id: "sep", label: "Septiembre" },
        { id: "oct", label: "Octubre" },
        { id: "nov", label: "Noviembre" },
        { id: "dic", label: "Diciembre" },
        { id: "porAnio", label: "Por Año" },
    ];
    const loadIngEgr = (event) => {
        setRubEgr(event.egr);
        setRubIng(event.ing);
        var contIng = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var contEgr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        event.ing.forEach(element => {
            for (let i = 0; i < 13; i++) {
                contIng[i] += element.Valor[i] * 1;
            }
        });
        event.egr.forEach(element => {
            for (let j = 0; j < 13; j++) {
                contEgr[j] += element.Valor[j] * 1;
            }
        });
        setPresIng(contIng);
        setPresEgr(contEgr);
    };
    const StyledTableCellAzul = withStyles((theme) => ({
        head: {
            backgroundColor: "#051e34",
            color: theme.palette.common.white,
        },
        body: {
            backgroundColor: "#051e34",
            color: theme.palette.common.white,
            fontSize: 14,
        },
    }))(TableCell);
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
    const StyledTableCellcian = withStyles((theme) => ({
        head: {
            backgroundColor: "rgba(75, 192, 192, 1)",
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);
    const StyledTableCellWhite = withStyles((theme) => ({
        head: {
            backgroundColor: "rgba(225, 225, 225, 1)",
            color: "#051e34",
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);
    const StyledTableCellrosa = withStyles((theme) => ({
        head: {
            backgroundColor: "rgba(255, 99, 132, 1)",
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);

    const getAll = React.useCallback(() => {
        try {
            FirestoreService.getPresupuesto(settings.idConjunto, threadKey).then((doc) => {
                const updatedGroceryItems2 = {
                    id: doc.id,
                    Nombre: doc.data().Nombre,
                    Anio: doc.data().Anio,
                    Fecha: doc.data().Fecha.toDate().toDateString(),
                    Datos: JSON.parse(doc.data().Datos),
                };
                setFormulario2(updatedGroceryItems2.Anio);
                setNombrePresu(updatedGroceryItems2.Nombre);
                loadIngEgr(updatedGroceryItems2.Datos);
            });
        } catch (e) { }
    }, [settings.idConjunto]);

    React.useEffect(() => {
        getAll();
    }, [getAll]);

    return (
        <div>
            <p className={classes.titulo}>{nombrePresu+" - "+formulario2}</p>
            <p className={classes.titulo}>Ingresos</p>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {columnsR.map((column, index) => (
                                <StyledTableCellcian align="center" key={"mainRowIng" + index}>
                                    {column.label}
                                </StyledTableCellcian>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rubIng !== undefined && rubIng
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, indexPrin) => {
                                return (
                                    <Fragment>
                                        <StyledTableRow hover tabIndex={-1} key={"rowIng" + indexPrin}>
                                            <StyledTableCellAzul align="center">{row.Nombre}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[0]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[1]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[2]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[3]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[4]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[5]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[6]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[7]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[8]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[9]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[10]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[11]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[12]}</StyledTableCellAzul>
                                        </StyledTableRow>
                                        {
                                            row.SubRubros.map((row, index) => {
                                                return (
                                                    <StyledTableRow hover tabIndex={-1} key={"rowIngDet" + index}>
                                                        <StyledTableCell align="center">{row.Nombre}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[0]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[1]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[2]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[3]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[4]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[5]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[6]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[7]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[8]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[9]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[10]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[11]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[12]}</StyledTableCell>
                                                    </StyledTableRow>
                                                );
                                            })
                                        }
                                    </Fragment>
                                );
                            })}
                    </TableBody>
                    <TableHead>
                        <TableRow>
                            <StyledTableCellcian align="center">TOTAL</StyledTableCellcian>
                            <StyledTableCellWhite align="center">{"$ " + presIng[0]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presIng[1]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presIng[2]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presIng[3]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presIng[4]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presIng[5]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presIng[6]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presIng[7]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presIng[8]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presIng[9]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presIng[10]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presIng[11]}</StyledTableCellWhite>
                            <StyledTableCellcian align="center">{"$ " + presIng[12]}</StyledTableCellcian>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>

            <p className={classes.titulo}>Egresos</p>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {columnsR.map((column, index) => (
                                <StyledTableCellrosa align="center" key={"mainRowEgr" + index}>
                                    {column.label}
                                </StyledTableCellrosa>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rubEgr !== undefined && rubEgr
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, indexPrin) => {
                                return (
                                    <Fragment>
                                        <StyledTableRow hover tabIndex={-1} key={"rowIng" + indexPrin}>
                                            <StyledTableCellAzul align="center">{row.Nombre}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[0]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[1]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[2]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[3]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[4]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[5]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[6]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[7]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[8]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[9]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[10]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[11]}</StyledTableCellAzul>
                                            <StyledTableCellAzul align="center">{"$" + row.Valor[12]}</StyledTableCellAzul>
                                            
                                        </StyledTableRow>
                                        {
                                            row.SubRubros.map((row, index) => {
                                                return (
                                                    <StyledTableRow hover tabIndex={-1} key={"rowEgrDet" + index}>
                                                        <StyledTableCell align="center">{row.Nombre}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[0]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[1]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[2]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[3]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[4]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[5]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[6]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[7]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[8]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[9]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[10]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[11]}</StyledTableCell>
                                                        <StyledTableCell align="center">{"$" + row.Valor[12]}</StyledTableCell>
                                                    </StyledTableRow>
                                                );
                                            })
                                        }
                                    </Fragment>
                                );
                            })}
                    </TableBody>
                    <TableHead>
                        <TableRow>
                            <StyledTableCellrosa align="center">TOTAL</StyledTableCellrosa>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[0]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[1]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[2]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[3]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[4]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[5]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[6]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[7]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[8]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[9]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[10]}</StyledTableCellWhite>
                            <StyledTableCellWhite align="center">{"$ " + presEgr[11]}</StyledTableCellWhite>
                            <StyledTableCellrosa align="center">{"$ " + presEgr[12]}</StyledTableCellrosa>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        </div>
    );
}

export default VerPres;
