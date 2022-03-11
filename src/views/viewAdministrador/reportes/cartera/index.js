import React, { useState, useEffect } from 'react';
import numeral from "numeral";
import { Pie } from 'react-chartjs-2';
import { Paper, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import useStyles from "./useStyles"
import * as FirestoreService from './service/firebase'
import useSettings from "../../../../contextapi/hooks/useSettings";
import NoInfo from "../../../../components/Common/NoInfo";
import LoadingData from "../../../../components/Common/LoadingData";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider}from "@material-ui/core";
import { Accordion, AccordionDetails, AccordionSummary, AccordionActions } from '@material-ui/core';
import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TitleIcon from '@material-ui/icons/FeaturedVideo';
import { subDays } from 'date-fns';

const DeudoresLista = (arr, dias, show) => {
  return (
  <Accordion defaultExpanded={show}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1c-content"
      id="panel1c-header"
    >
      <b>Listado de deudores ({dias} días)</b>
    </AccordionSummary>
    <AccordionDetails style={{display: "block"}}>
      <List>
        {arr.usuarios.map((value) => {
          return (
            <ListItem key={value.id}>
              <ListItemText primary={value.label}/>
              <ListItemSecondaryAction>
                ${numeral(value.valor).format(`${"USD"}0,0.00`)}
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </AccordionDetails>
    <Divider />
    <AccordionActions>
      <Grid item xs={12} sm={10}>
        <b>Total: </b>
      </Grid>
      <Grid item xs={12} sm={2}>
      ${numeral(arr.valor).format(`${"USD"}0,0.00`)}
      </Grid>
    </AccordionActions>
  </Accordion>
  );
}

const Cartera = () => {
  const { settings } = useSettings();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [deuda30, setDeuda30] = useState({});
  const [deuda60, setDeuda60] = useState({});
  const [deuda90, setDeuda90] = useState({});
  const [deudaMayor, setDeudaMayor] = useState({});
  const thrityDays = subDays(new Date(), 30);
  const sixtyDays = subDays(new Date(), 60);
  const ninetyDays = subDays(new Date(), 90);
  
  useEffect(() => {
    dataFormat();
  }, [settings.idConjunto]);

  async function dataFormat() {
    try {
      const Items = await FirestoreService.getUsuariosMorosos(settings.idConjunto).then(
        (querySnapshot) => {
          let Items = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
          return Items
        }
        );
      let treinta = {valor: 0, usuarios: []};
          let sesenta = {valor: 0, usuarios: []};
          let noventa = {valor: 0, usuarios: []};
          let mayor = {valor: 0, usuarios: []};
          
          Items.map(item => {
            if(new Date(item.FechaLimite.seconds * 1000) >= thrityDays){
              calcular(treinta, item)
            } else if (new Date(item.FechaLimite.seconds * 1000) >= sixtyDays){
              calcular(sesenta, item)
            } else if (new Date(item.FechaLimite.seconds * 1000) >= ninetyDays){
              calcular(noventa, item)
            } else {
              calcular(mayor, item)
            }
          })
          setDeuda30(treinta);
          setDeuda60(sesenta);
          setDeuda90(noventa);
          setDeudaMayor(mayor);
          setLoading(false);
    } catch (e) {}
  }

  function calcular(arr, item) {
    const found = arr.usuarios.find(element => element.id == item.UsuarioId);
    if(!found){
      arr.usuarios.push({id:item.UsuarioId, label: `${item.NombreUsuario} UH-${item.CasaUsuario}`, valor: item.Valor*1})
    } else {
      for(let i=0; i < arr.usuarios.length; i++){
        arr.usuarios[i].valor += item.Valor*1;
      }
    }
    arr.valor += item.Valor*1;
  }

  const columns = [
    { id: "30dias", label: "Suma 30 días" },
    { id: "60dias", label: "Suma 60 días" },
    { id: "90dias", label: "Suma 90 días" },
    { id: "mayor90", label: "Suma > 90 días" }
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

  return (
    !loading ? (
      <Paper className={classes.root}>
        <div>
          <h3><TitleIcon /> Reporte de Cartera</h3>
        </div>
        <TableContainer component={Paper}>
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
                <StyledTableCell align="center">
                  ${numeral(deuda30.valor).format(`${"USD"}0,0.00`)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  ${numeral(deuda60.valor).format(`${"USD"}0,0.00`)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  ${numeral(deuda90.valor).format(`${"USD"}0,0.00`)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  ${numeral(deudaMayor.valor).format(`${"USD"}0,0.00`)}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container style={{ marginTop: '15px', justifyContent: 'space-between'}}>
          <Grid item xs={12} sm={5}>
            <Pie data={{
              labels: ['30 días', '60 días', '90 días', '> 90 días'],
              datasets: [
                {
                  label: '# of Votes',
                  data: [deuda30.valor, deuda60.valor, deuda90.valor, deudaMayor.valor],
                  backgroundColor: [
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                  ],
                  borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Reporte de Cartera'
                  }
                }
              }}
              width={'700'}
              height={'800'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {deuda30.valor > 0 && DeudoresLista(deuda30, 30, true)}
            {deuda60.valor > 0 && DeudoresLista(deuda60, 60, false)}
            {deuda90.valor > 0 && DeudoresLista(deuda90, 90, false)}
            {deudaMayor.valor > 0 && DeudoresLista(deudaMayor, '> 90', false)}
          </Grid>
        </Grid>
      </Paper>
    ) : (
      <LoadingData />
    )
  )
}

export default Cartera