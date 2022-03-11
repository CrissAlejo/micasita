import React, { useState, useEffect } from 'react';
import numeral from "numeral";
import Dropdown from 'react-multilevel-dropdown';
import {Paper, Grid} from "@material-ui/core";
import useStyles from "./useStyles"
import * as FirestoreService from './service/firebase'
import useSettings from "../../../../contextapi/hooks/useSettings";
import NoInfo from "../../../../components/Common/NoInfo";
import LoadingData from "../../../../components/Common/LoadingData";
import Button from '@material-ui/core/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Divider}from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Bar } from 'react-chartjs-2';
import PayIcon from '@material-ui/icons/FeaturedPlayListOutlined';

const IngvsEgr = () => {
  const { settings } = useSettings();
  const classes = useStyles();
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true);
  const [rubrosIng, setRubrosIng] = useState([]);
  const [rubrosEgr, setRubrosEgr] = useState([]);
  const [rubro1, setRubro1] = useState('');
  const [rubro2, setRubro2] = useState('');
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const columns = [
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
    try {
      FirestoreService.getRubros(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
            setRubrosIng(Items);
          },
        },
        settings.idConjunto, "Ingreso"
      );
      FirestoreService.getRubros(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot.data());
            setRubrosEgr(Items);
            setLoading(false);
          },
        },
        settings.idConjunto, "Egreso"
      );
    } catch (e) { }
  }, [settings.idConjunto]);

  useEffect(() => {
    try {
      if(rubro1){
        const [rubro, tipo, campo] = rubro1.split('+')
        setShow(false)
        FirestoreService.getValoresByRubro(settings.idConjunto, tipo, campo, rubro)
          .then((doc)=> {
            let items = doc.docs.map(snap => snap.data()).filter(doc=> new Date(doc.Fecha.seconds*1000).getFullYear()==new Date().getFullYear());
            let lista = [0,0,0,0,0,0,0,0,0,0,0,0];
            columns.forEach( (col, ind) => {
              items.forEach( (elem, i) => {
                if(new Date(elem.Fecha.seconds*1000).getMonth() == ind){
                  lista[ind] += elem.Valor*1;
                }
              })
            })
            setData1(lista)
            setShow(true)
          })
      }
    } catch (e) { }
  }, [rubro1]);

  useEffect(()=> {
    try {
      if(rubro2){
        const [rubro, tipo, campo] = rubro2.split('+');
        setShow(false)
        FirestoreService.getValoresByRubro(settings.idConjunto, tipo, campo, rubro)
          .then((doc)=> {
            let items = doc.docs.map(snap => snap.data()).filter(doc=> new Date(doc.Fecha.seconds*1000).getFullYear()==new Date().getFullYear());
            let lista = [0,0,0,0,0,0,0,0,0,0,0,0];
            columns.forEach( (col, ind) => {
              items.forEach( (elem, i) => {
                if(new Date(elem.Fecha.seconds*1000).getMonth() == ind){
                  lista[ind] += elem.Valor*1;
                }
              })
            })
            setData2(lista)
            setShow(true)
          })
      }
    } catch (e) {}
  }, [rubro2])

  return (
    !loading ? (
        <Paper className={classes.root}>
        <div style={{marginBottom:'10px'}}>
          <h3><PayIcon/> Reporte de Ingresos y Egresos</h3>
        </div>
        <Grid container spacing={3} className={classes.banner}>
          <Grid item xs={12} sm={4}>
            <Dropdown
              title='Escoja un Rubro o SubRubro'
            >
              <Dropdown.Item>
                Ingresos
                <Dropdown.Submenu position={'right'} className={classes.der}>
                  {rubrosIng.map( rub => (
                    <Dropdown.Item key={rub.Nombre} className={classes.item}>
                      <Button
                        size='small'
                        onClick={()=> setRubro1(`${rub.Nombre}+ingresos+Rubro`)}
                      >
                        {rub.Nombre}
                      </Button>
                      <Dropdown.Submenu position={'right'} className={classes.der}>
                        {rub.SubRubros.map( sub => (
                          <Dropdown.Item key={sub} className={classes.item}>
                            <Button
                              size='small'
                              onClick={()=> setRubro1(`${sub}+ingresos+SubRubro`)}
                            >
                              {sub}
                            </Button>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Submenu>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Submenu>
              </Dropdown.Item>
              <Dropdown.Item>
                Egresos
                <Dropdown.Submenu position={'right'} className={classes.der}>
                  {rubrosEgr.map( rub => (
                    <Dropdown.Item key={rub.Nombre} className={classes.item}>
                      <Button
                        size='small'
                        onClick={()=> setRubro1(`${rub.Nombre}+egresos+Rubro`)}
                      >
                        {rub.Nombre}
                      </Button>
                      <Dropdown.Submenu position={'right'} className={classes.der}>
                        {rub.SubRubros.map( sub => (
                          <Dropdown.Item key={sub} className={classes.item}>
                            <Button
                              size='small'
                              onClick={()=> setRubro1(`${sub}+egresos+SubRubro`)}
                            >
                              {sub}
                            </Button>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Submenu>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Submenu>
              </Dropdown.Item>
            </Dropdown>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Dropdown
              title='Escoja otro Rubro o SubRubro para comparar'
            >
              <Dropdown.Item>
                Ingresos
                <Dropdown.Submenu>
                  {rubrosIng.map( rub => (
                    <Dropdown.Item key={rub.Nombre} className={classes.item}>
                      <Button
                        size='small'
                        onClick={()=> setRubro2(`${rub.Nombre}+ingresos+Rubro`)}
                      >
                        {rub.Nombre}
                      </Button>
                      <Dropdown.Submenu>
                        {rub.SubRubros.map( sub => (
                          <Dropdown.Item key={sub} className={classes.item}>
                            <Button
                              size='small'
                              onClick={()=> setRubro2(`${sub}+ingresos+SubRubro`)}
                            >
                              {sub}
                            </Button>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Submenu>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Submenu>
              </Dropdown.Item>
              <Dropdown.Item>
                Egresos
                <Dropdown.Submenu>
                  {rubrosEgr.map( rub => (
                    <Dropdown.Item key={rub.Nombre} className={classes.item}>
                      <Button
                        size='small'
                        onClick={()=> setRubro2(`${rub.Nombre}+egresos+Rubro`)}
                      >
                        {rub.Nombre}
                      </Button>
                      <Dropdown.Submenu>
                        {rub.SubRubros.map( sub => (
                          <Dropdown.Item key={sub} className={classes.item}>
                            <Button
                              size='small'
                              onClick={()=> setRubro2(`${sub}+egresos+SubRubro`)}
                            >
                              {sub}
                            </Button>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Submenu>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Submenu>
              </Dropdown.Item>
            </Dropdown>
          </Grid>
        </Grid>
        <Divider/>
        <Grid container spacing={3} className={classes.banner}>
          <Grid item xs={12} sm={4}>
            {rubro1 && (<><b>Rubro 1:</b> {rubro1.split('+')[0]}</>)}
          </Grid>
          <Grid item xs={12} sm={4}>
            {rubro2 && (<><b>Rubro 2:</b> {rubro2.split('+')[0]}</>)} 
          </Grid>
        </Grid>
        {show && (
          <>
          <Bar data={{
              labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
              datasets: [
                {
                  type: 'line',
                  label: rubro2.split('+')[0],
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgb(255, 99, 132)',
                  borderWidth: 2,
                  data: data2,
              },
              {
                  type: 'bar',
                  label: rubro1.split('+')[0],
                  borderColor: 'rgb(75, 192, 192)',
                  backgroundColor: 'rgb(75, 192, 192)',
                  borderWidth: 2,
                  data: data1,
                },
              ],
            }}
            width={'50%'}
            height={'15%'} />
          {data1.length > 0 && (
            <>
            <h5>{rubro1.split('+')[0]}</h5>
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
                  {data1.map(num => (
                    <StyledTableCell align="center">
                      ${numeral(num).format(`${"USD"}0,0.00`)}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableBody>
            </Table>
            </TableContainer>
            </>
          )}
          {data2.length > 0 && (
            <>
            <h5>{rubro2.split('+')[0]}</h5>
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
                  {data2.map(num => (
                    <StyledTableCell align="center">
                      ${numeral(num).format(`${"USD"}0,0.00`)}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              </TableBody>
            </Table>
            </TableContainer>
            </>
          )}
          </>
        )}
      </Paper>
    ):(
      <LoadingData/>
    )
  )
}

export default IngvsEgr;