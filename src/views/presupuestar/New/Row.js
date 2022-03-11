import React from 'react';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from "@material-ui/core/TableBody";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import "./row.css";

const useStyles = makeStyles((theme) => ({
    icon: {
      color: "#FFFFFF",
      paddingRight: 1,
    },
  }));

function Row(props) {
    const { data, clasStyle } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    const StyledTableCell = withStyles((theme) => ({
        head: {
            backgroundColor: "#051e34",
            color: theme.palette.common.white,
        },
        body: {
            fontSize: 14,
        },
    }))(TableCell);
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
    const StyledTableRow = withStyles((theme) => ({
        root: {
            "&:nth-of-type(odd)": {
                backgroundColor: theme.palette.action.hover,
            },
        },
    }))(TableRow);
    
    return (
        <React.Fragment>
            <StyledTableRow onClick={() => setOpen(!open)}component="th" scope="row" style={{ borderBottom: "unset" }} hover tabIndex={-1} key={"rowIng" + data.indexPrin}>
                <StyledTableCellAzul align="center">
                <IconButton aria-label="expand row" size="small">
                    {open ? <KeyboardArrowUpIcon className={classes.icon} /> : <KeyboardArrowDownIcon className={classes.icon}/>}
                </IconButton>
                    {data.Nombre}
                </StyledTableCellAzul>
                {/* Ingresos extraordinarios*/}
                    <StyledTableCellAzul align="center">{"$" + data.Valor[0]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[1]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[2]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[3]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[4]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[5]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[6]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[7]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[8]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[9]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[10]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[11]}</StyledTableCellAzul>
                    <StyledTableCellAzul align="center">{"$" + data.Valor[12]}</StyledTableCellAzul>
                </StyledTableRow>
            <TableRow>
                <TableCell style={{ padding: 0 }} colSpan={16}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        
                            <Table aria-label="purchases">
                                <TableBody>
                                {data.validator === true ? (
                                    data.SubRubros.map((row, index) => {
                                        return (
                                            <StyledTableRow hover tabIndex={-1} key={data.val + index}>
                                                <StyledTableCell width="12%" align="center">{row.Nombre}</StyledTableCell>
                                                <StyledTableCell align="center">{"$asdf"}</StyledTableCell>
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
                                ) : (
                                    data.SubRubros.map((row, index) => {
                                        return (
                                            <StyledTableRow hover tabIndex={-1} key={data.val +"Det" + index}>
                                                <StyledTableCell width="11%" align="center">{row.Nombre}</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_0_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_0_" + data.indexPrin}
                                                        key={data.val + index + "_0_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[0], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_1_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_1_" + data.indexPrin}
                                                        key={data.val + index + "_1_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[1], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_2_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_2_" + data.indexPrin}
                                                        key={data.val + index + "_2_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[2], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_3_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_3_" + data.indexPrin}
                                                        key={data.val + index + "_3_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[3], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_4_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_4_" + data.indexPrin}
                                                        key={data.val + index + "_4_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[4], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_5_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_5_" + data.indexPrin}
                                                        key={data.val + index + "_5_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[5], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_6_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_6_" + data.indexPrin}
                                                        key={data.val + index + "_6_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[6], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_7_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_7_" + data.indexPrin}
                                                        key={data.val + index + "_7_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[7], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_8_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_8_" + data.indexPrin}
                                                        key={data.val + index + "_8_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[8], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_9_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_9_" + data.indexPrin}
                                                        key={data.val + index + "_9_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[9], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_10_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_10_" + data.indexPrin}
                                                        key={data.val + index + "_10_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[10], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <TextField
                                                        className={clasStyle}
                                                        id={data.val + index + "_11_" + data.indexPrin}
                                                        label="Valor"
                                                        type="number"
                                                        name={data.val + index + "_11_" + data.indexPrin}
                                                        key={data.val + index + "_11_" + data.indexPrin}
                                                        InputProps={{ inputProps: { defaultValue: row.Valor[11], min: 0, onChange: (event) => data.handleC(event) } }}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell width="5%" align="center">{"$" + row.Valor[12]}</StyledTableCell>
                                            </StyledTableRow>
                                        );
                                    })
                                )}
                                </TableBody>
                            </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default React.memo(Row);