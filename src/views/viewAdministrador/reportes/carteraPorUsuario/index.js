import React, { useState, useEffect } from 'react';
import numeral from "numeral";
import { Bar } from 'react-chartjs-2';
import useStyles from "./useStyles"
import * as FirestoreService from './service/firebase'
import useSettings from "../../../../contextapi/hooks/useSettings";
import LoadingData from "../../../../components/Common/LoadingData";
import {Paper, Grid,} from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import DateRangeIcon from '@material-ui/icons/DateRange';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow }from "@material-ui/core";

const CarteraUsuario = () => {
    const { settings } = useSettings();
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [deudas, setDeudas] = useState([]);
    const [items, setItems] = useState([]);
    const [selectUser, setSelectUser] = useState('none');
    const columns = [
        { id: "ant", label: "Saldo Ant." },
        { id: "ene", label: "Ene" },
        { id: "feb", label: "Feb" },
        { id: "mar", label: "Mar" },
        { id: "abr", label: "Abril" },
        { id: "may", label: "Mayo" },
        { id: "jun", label: "Jun" },
        { id: "jul", label: "Jul" },
        { id: "agos", label: "Agos" },
        { id: "sep", label: "Sep" },
        { id: "oct", label: "Oct" },
        { id: "nov", label: "Nov" },
        { id: "dic", label: "Dic" },
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
        try{
            FirestoreService.getUsuariosByConjunto(settings.idConjunto)
                .then((doc)=>{
                    const items = doc.docs.map(snap => snap.data());
                    const data = items.sort((a,b)=> a.Casa - b.Casa)
                    setUsuarios(data);
                })
            FirestoreService.getDeudas(settings.idConjunto)
                .then((doc)=>{
                    const items = doc.docs.map(snap => snap.data());
                    setItems(items);
                    dataFormat(items)
                    setLoading(false);
                })
        } catch(e){
            console.log('ha ocurrido un error', e)
        }
    }, [settings.idConjunto]);

    useEffect(() => {
        if(selectUser!='none'){
            const deudasUsr = items.filter( item => item.UsuarioId == selectUser)
            dataFormat(deudasUsr);
            return;
        }
        dataFormat(items);
    }, [selectUser])

    function dataFormat(items) {
      let data = [0,0,0,0,0,0,0,0,0,0,0,0,0];
      const lastYear = new Date().getFullYear()-1;
      items.forEach(deuda=>{
          const fechaDeuda = new Date(deuda.FechaLimite.seconds*1000)
          if(fechaDeuda.getFullYear()<=lastYear){
              data[0] += deuda.Valor;
          } else {
              data[fechaDeuda.getMonth()+1] += deuda.Valor*1;
          }
      })
      setDeudas(data);
    }
    
    return (
        !loading ? (
            <Paper className={classes.root}>
            <div>
            <h3><DateRangeIcon/> Reporte de Cartera Mensualizada</h3>
            </div>
            <Grid container className={classes.banner}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        id="outlined-select-currency"
                        select
                        label="Filtar por"
                        value={selectUser}
                        onChange={(e)=>setSelectUser(e.target.value)}
                        helperText="Seleccione un usuario para filtrar"
                        variant="outlined"
                        SelectProps={{
                            MenuProps:{
                                PaperProps: {
                                style: {
                                    maxHeight: 50 * 4.5 + 8,
                                },
                                },
                            }
                        }}
                        >
                            <MenuItem value='none'>Todos</MenuItem>
                        {usuarios.map((user) => (
                            <MenuItem key={user.Cedula} value={user.Correo}>
                                {user.Nombre} {user.Apellido} - {user.Casa}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>            
            <TableContainer component={Paper} style={{margin: '10px 0'}}>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <td></td>
                      {columns.map((column) => (
                        <StyledTableCell align="center" key={column.id}>
                          {column.label}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <StyledTableRow hover tabIndex={-1}/*  key={index} */>
                      <StyledTableCell align="center">
                        Total
                      </StyledTableCell>
                      {deudas.map(num => (
                        <StyledTableCell align="center">
                          ${numeral(num).format(`${"USD"}0,0.00`)}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  </TableBody>
                </Table>
            </TableContainer>
            <Bar data={{
                labels: ['Saldo Ant.','Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                datasets: [
                {
                    type: 'bar',
                    label: 'Valores de Cartera',
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderWidth: 2,
                    data: deudas,
                },
                ],
            }}
            width={'50%'}
            height={'15%'} />
            </Paper>
        ):(
          <LoadingData/>
        )
    )
}

export default CarteraUsuario
