import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as FirestoreService from "../services/firestore";
import { Paper } from "@material-ui/core";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  CircularProgress,
  Box,
  CardHeader,
  CardContent,
  Card,
  Grid,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import useSettings from "../../../contextapi/hooks/useSettings";
import List from "@material-ui/core/List";
import numeral from "numeral";
import { setSubmitFailed } from "redux-form";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    height: "100%",
    width: "100%",
  },
  pageName: {
    paddingTop: theme.spacing(3),
    font: "var(--unnamed-font-style-normal) normal bold 30px/34px var(--unnamed-font-family-arial)",
    letterSpacing: "var(--unnamed-character-spacing-0)",
    color: "var(--unnamed-color-ffffff)",
    opacity: 1,
  },
  headItem: {
    background: "#051e34",
    color: "#FFFFFF",
  },
  icon: {
    color: "#FFFFFF",
    paddingRight: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
}));
const Validar = () => {
  const classes = useStyles();
  const { settings } = useSettings();
  const [ingresos, setIngresos] = React.useState([]);
  const [totalingresos, setTotalengresos] = React.useState(0);
  const [totalingresossum, setTotalengresossum] = React.useState(0);

  const [egresos, setEgresos] = React.useState([]);
  const [totalegreso, setTotalegresos] = React.useState(0);
  const [totalegresosum, setTotalegresossum] = React.useState(0);

  const [loading, setLoading] = React.useState(true);
  const { threadKey } = useParams();

  const [viewMes, setViewMes] = React.useState(false);
  const [monthDesde, setMonthDesde] = React.useState('');
  const [monthHasta, setMonthHasta] = React.useState('');
  const [ingReal, setIngReal]= React.useState([]);
  const [egrReal, setEgrReal]= React.useState([]);
  const meses = [
    {id:1, name:"Enero"},
    {id:2, name:"Febrero"},
    {id:3, name:"Marzo"},
    {id:4, name:"Abril"},
    {id:5, name:"Mayo"},
    {id:6, name:"Junio"},
    {id:7, name:"Julio"},
    {id:8, name:"Agosto"},
    {id:9, name:"Septiembre"},
    {id:10, name:"Octubre"},
    {id:11, name:"Noviembre"},
    {id:12, name:"Diciembre"},
  ];
  const getConjuntoById = React.useCallback(() => {
    try {
      FirestoreService.getDetalleBypresupuesto(
        {
          next: (querySnapshot) => {
            const datas = querySnapshot.data();
            getPresupuesto(threadKey);

            setIngresos(JSON.parse(datas.Datos).ing);
            sumtotalIng(JSON.parse(datas.Datos).ing);
            setEgresos(JSON.parse(datas.Datos).egr);
            sumtotalEgr(JSON.parse(datas.Datos).egr);
            setLoading(false);
          },
        },
        settings.idConjunto,
        threadKey
      );
    } catch (e) {}
  }, [settings.idConjunto, monthHasta]);
  React.useEffect(() => {
    setTotalengresos(0);
    setTotalegresos(0);
    getConjuntoById();
  }, [getConjuntoById]);

  const getPresupuesto = (value) => {
    try {
      FirestoreService.getPresupuesto(settings.idConjunto, value).then(
        (res) => {
          getIngresos(res.data().Anio);
          getEgresos(res.data().Anio);
        }
      );
    } catch (error) {}
  };
  const getIngresos = (value) => {
    let desde;
    let hasta;
    if(monthDesde==="" || monthHasta===""){
      desde = new Date("01/01/" + value);
      hasta = new Date("12/31/" + value);
    } else {
      desde = new Date(monthDesde+"/01/" + value);
      hasta = new Date(monthHasta+"/31/" + value);
    }
    try {
      FirestoreService.getIngresos(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            
            let sumas = 0;
            Items.forEach((sa) => {
              sumas = sumas + sa.data().Valor;
            });
            setTotalengresossum(sumas);
            setIngReal(Items);
          },
        },
        settings.idConjunto,
        desde,
        hasta
      );
    } catch (error) {}
  };
  const getEgresos = (value) => {
    let desde;
    let hasta;
    if(monthDesde==="" || monthHasta===""){
      desde = new Date("01/01/" + value);
      hasta = new Date("12/31/" + value);
    } else {
      desde = new Date(monthDesde+"/01/" + value);
      hasta = new Date(monthHasta+"/31/" + value);
    }
    FirestoreService.getEgresos(
      {
        next: (querySnapshot) => {
          const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
          let sumas = 0;
          Items.forEach((sa) => {
            sumas = sumas + sa.data().Valor;
          });
          setTotalegresossum(sumas);
          setEgrReal(Items);
        },
      },
      settings.idConjunto,
      desde,
      hasta
    );
  };
  const handleMonth = (e) => {
    const {value, name} = e.target;
    if(name==="select-desde"){
      setMonthDesde(value);
      setMonthHasta("");
    } else {
      setMonthHasta(value);
    }
    if(value===""){
      setMonthDesde("");
      setMonthHasta("");
      setViewMes(false);
    } else {
      setViewMes(true);
    }
  }
  const renderSubIngReal = (name) =>{
    let suma=0;
    if(ingReal.length >0){
      const resultado = ingReal.find( sub => sub.data()?.SubRubro === name );
      if(resultado!== undefined){
        suma+=resultado.data().Valor;
      }
    }
    //setUniqueSuma(suma);
    return (
      suma
    );
  }
  const renderSubEgrReal = (name) =>{
    let suma=0;
    if(egrReal.length >0){
      const resultado = egrReal.find( sub => sub.data()?.SubRubro === name );
      if(resultado!== undefined){
        suma+=resultado.data().Valor;
      }
    }
    return (
      suma
    );
  }
  const renderPorMes=(item)=>{
    let valor=0;
    const arrayDesdeHasta = item.Valor.slice(monthDesde-1,monthHasta-1);
    arrayDesdeHasta.forEach(val =>{
      valor+=val;
    });
    return (
      valor
    );
  }
  
  function renderdays(item, index) {
    let valor = 0;
    valor = item.Valor[12];
    return (
      valor
    );
  }
  function sumtotalIng(item) {
    let valor = 0;
    item.forEach((element) => {
      valor += element.Valor[12];
    });
    setTotalengresos(valor);
  }
  function sumtotalEgr(item) {
    let valor = 0;
    item.forEach((element) => {
      valor += element.Valor[12];
    });
    setTotalegresos(valor);
  }
  return (
    <Paper className={classes.root}>
      {!loading ? (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Grid container style={{alignItems: "center"}}>
              <Grid item xs={12} sm={4}>
                <h5 style={{ paddingLeft: "10px"}}>Selecciona un mes:</h5>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="filter-month-select-label">Desde</InputLabel>
                  <Select
                    labelId="filter-month-select-label"
                    id="filter-month-select"
                    name="select-desde"
                    value={monthDesde}
                    onChange={(e)=>handleMonth(e)}
                    label="filtar"
                  >
                    <MenuItem value={""}>Por Año</MenuItem>
                    {meses.map((mes, index) => (
                      <MenuItem key={index} value={mes.id}>{mes.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                {monthDesde!=="" ? (
                  <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="filter-month-select-label">Hasta</InputLabel>
                  <Select
                    labelId="filter-month-select-label"
                    id="filter-month-select"
                    name="select-hasta"
                    value={monthHasta}
                    onChange={(e)=>handleMonth(e)}
                    label="filtar"
                  >
                    <MenuItem value={""}>Por Año</MenuItem>
                    {meses.slice(monthDesde===""?0:monthDesde).map((mes, index) => (
                      <MenuItem key={index} value={mes.id}>{mes.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                ): ""}
              </Grid>
            </Grid>
            <CardHeader title="Ingresos" />

            {ingresos.map((rubro) => {
              return (
                <Accordion defaultExpanded>
                  <Box width={1} className={classes.headItem}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon className={classes.icon} />}
                      aria-controls="expandir o contraer contenido"
                      id="panel1a-header"
                    >
                      <Grid container spacing={3} style={{alignItems: "center"}}>
                        <Grid item xs={12} lg={4}>
                          {" "}
                          <Typography>{rubro.Nombre} </Typography>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                          {" "}
                          Val. Pres.
                        </Grid>
                        <Grid item xs={12} lg={3}>
                          {" "}
                          Val. Real
                        </Grid>
                        <Grid item xs={12} lg={2}>
                          {" "}
                          Dif.
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                  </Box>
                  <AccordionDetails style={{paddingBottom: "0px"}}>
                    <Box width={1}>
                      <List>
                        {rubro.SubRubros.map((subRubro) => {
                          return (
                            <Box
                              width={1}
                              borderBottom={1}
                              borderColor="grey.500"
                            >
                              <Grid container spacing={3} style={{alignItems: "center"}}>
                                <Grid item xs={12} lg={4}>
                                  {" "}
                                  <Typography>{subRubro.Nombre}</Typography>
                                </Grid>
                                <Grid item xs={12} style={{maxWidth: "100px"}}>
                                  {" "}
                                  {viewMes ? (
                                    <Typography>
                                      {}$ {numeral(renderPorMes(subRubro)).format(`${"USD"}0,0.00`)}
                                    </Typography>
                                    ) : (
                                      <Typography>
                                        {}$ {numeral(renderdays(subRubro)).format(`${"USD"}0,0.00`)}
                                      </Typography>
                                      )}
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                  {" "}
                                  {<Typography>
                                  {}$ {numeral(renderSubIngReal(subRubro.Nombre)).format(`${"USD"}0,0.00`)}
                                </Typography>}
                                </Grid>
                                {viewMes ? (
                                  <Grid item xs={12} lg={2}>
                                  {}$ {numeral(renderPorMes(subRubro)-renderSubIngReal(subRubro.Nombre)).format(`${"USD"}0,0.00`)}
                                  </Grid>
                                ):(
                                  <Grid item xs={12} lg={2}>
                                  {}$ {numeral(renderdays(subRubro)-renderSubIngReal(subRubro.Nombre)).format(`${"USD"}0,0.00`)}
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          );
                        })}
                      </List>
                    </Box>
                  </AccordionDetails>
                  <Divider />
                  <AccordionActions style={{paddingLeft: "15px"}}>
                  <Box width={1} >
                      <Grid container spacing={3}>
                        <Grid item xs={12} lg={4}>
                          {" "}
                          <Typography >Total: </Typography>
                        </Grid>
                        <Grid item xs={12} style={{maxWidth: "100px"}}>
                          {" "}
                          {viewMes ? (
                            <Typography>
                              {}$ {numeral(renderPorMes(rubro)).format(`${"USD"}0,0.00`)}
                            </Typography>
                            ) : (
                              <Typography>
                                {}$ {numeral(renderdays(rubro)).format(`${"USD"}0,0.00`)}
                              </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          {" "}
                          {}$ {numeral(totalingresossum).format(`${"USD"}0,0.00`)}
                        </Grid>
                        {viewMes ? (
                          <Grid item xs={12} sm={2}>
                          {" "}
                          {}$ {numeral(renderPorMes(rubro)-totalingresossum).format(`${"USD"}0,0.00`)}
                        </Grid>
                        ):(
                          <Grid item xs={12} sm={2}>
                          {" "}
                          {}$ {numeral(renderdays(rubro)-totalingresossum).format(`${"USD"}0,0.00`)}
                        </Grid>
                        )}
                      </Grid>
                  </Box>
                  </AccordionActions>
                </Accordion>
              );
            })}
            <CardHeader title="Egresos" />
            <Divider />

            {egresos.map((rubro) => {
              return (
                <Accordion defaultExpanded>
                  <Box width={1} className={classes.headItem}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon className={classes.icon} />}
                      aria-controls="expandir o contraer contenido"
                      id="panel1a-header"
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12} lg={4}>
                          {" "}
                          <Typography>{rubro.Nombre} </Typography>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                          {" "}
                          Val. Pres.
                        </Grid>
                        <Grid item xs={12} lg={3}>
                          {" "}
                          Val. Real
                        </Grid>
                        <Grid item xs={12} lg={2}>
                          {" "}
                          Dif.
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                  </Box>
                  <AccordionDetails>
                    <Box width={1}>
                      <List>
                        {rubro.SubRubros.map((subRubro) => {
                          return (
                            <Box
                              width={1}
                              borderBottom={1}
                              borderColor="grey.500"
                            >
                              <Grid container spacing={3} style={{alignItems: "center"}}>
                                <Grid item xs={12} lg={4}>
                                  {" "}
                                  <Typography>{subRubro.Nombre}</Typography>
                                </Grid>
                                <Grid item xs={12} style={{maxWidth: "100px"}}>
                                  {" "}
                                  {viewMes ? (
                                    <Typography>
                                      {}$ {numeral(renderPorMes(subRubro)).format(`${"USD"}0,0.00`)}
                                    </Typography>
                                    ) : (
                                      <Typography>
                                        {}$ {numeral(renderdays(subRubro)).format(`${"USD"}0,0.00`)}
                                      </Typography>
                                      )}
                                </Grid>
                                <Grid item xs={12} lg={3}>
                                  {" "}
                                  {<Typography>
                                  {}$ {numeral(renderSubEgrReal(subRubro.Nombre)).format(`${"USD"}0,0.00`)}
                                </Typography>}
                                </Grid>
                                {viewMes ? (
                                  <Grid item xs={12} lg={2}>
                                  {}$ {numeral(renderPorMes(subRubro)-renderSubEgrReal(subRubro.Nombre)).format(`${"USD"}0,0.00`)}
                                  </Grid>
                                ):(
                                  <Grid item xs={12} lg={2}>
                                  {}$ {numeral(renderdays(subRubro)-renderSubEgrReal(subRubro.Nombre)).format(`${"USD"}0,0.00`)}
                                  </Grid>
                                )}
                              </Grid>
                            </Box>
                          );
                        })}
                      </List>
                    </Box>
                  </AccordionDetails>
                  <Divider />
                  <AccordionActions style={{paddingLeft: "15px"}}>
                  <Box width={1} >
                  <Grid container spacing={3}>
                        <Grid item xs={12} lg={4}>
                          {" "}
                          <Typography >Total: </Typography>
                        </Grid>
                        <Grid item xs={12} style={{maxWidth: "100px"}}>
                          {" "}
                          {viewMes ? (
                            <Typography>
                              {}$ {numeral(renderPorMes(rubro)).format(`${"USD"}0,0.00`)}
                            </Typography>
                            ) : (
                              <Typography>
                                {}$ {numeral(renderdays(rubro)).format(`${"USD"}0,0.00`)}
                              </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          {" "}
                          {}$ {numeral(totalegresosum).format(`${"USD"}0,0.00`)}
                        </Grid>
                        {viewMes ? (
                          <Grid item xs={12} sm={2}>
                          {" "}
                          {}$ {numeral(renderPorMes(rubro)-totalegresosum).format(`${"USD"}0,0.00`)}
                        </Grid>
                        ):(
                          <Grid item xs={12} sm={2}>
                          {" "}
                          {}$ {numeral(renderdays(rubro)-totalegresosum).format(`${"USD"}0,0.00`)}
                        </Grid>
                        )}
                      </Grid>
                  </Box>
                  </AccordionActions>
                </Accordion>
              );
            })}
          </Grid>
          <Grid item xs={12} lg={6}>
            <CardHeader title="Saldo Total presupuestado" />

            <Grid container spacing={12}>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardHeader title="Total Ingreso" />
                  <Divider />
                  <CardContent>
                    <Grid item md={12} xs={12}>
                      <h4>
                        ${numeral(totalingresos).format(`${"USD"}0,0.00`)}
                      </h4>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardHeader title="Total de Egresos" />
                  <Divider />
                  <CardContent>
                    <Grid item md={12} xs={12}>
                      <h4>${numeral(totalegreso).format(`${"USD"}0,0.00`)}</h4>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <CardHeader title="Saldo en cuenta" />

            <Grid container spacing={12}>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardHeader title="Total Ingreso" />
                  <Divider />
                  <CardContent>
                    <Grid item md={12} xs={12}>
                      <h4>
                        ${numeral(totalingresossum).format(`${"USD"}0,0.00`)}
                      </h4>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardHeader title="Total de Egresos" />
                  <Divider />
                  <CardContent>
                    <Grid item md={12} xs={12}>
                      <h4>
                        ${numeral(totalegresosum).format(`${"USD"}0,0.00`)}
                      </h4>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <CardHeader title="Total" />

            <Grid container spacing={12}>
              <Grid item xs={12} lg={4}>
                <Card>
                  <CardHeader title="Presupuestado" />
                  <Divider />
                  <CardContent>
                    <Grid item md={12} xs={12}>
                      <h4>
                        $
                        {numeral(totalingresos - totalegreso).format(
                          `${"USD"}0,0.00`
                        )}
                      </h4>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Card>
                  <CardHeader title="Cuenta" />
                  <Divider />
                  <CardContent>
                    <Grid item md={12} xs={12}>
                      <h4>
                        $
                        {numeral(totalingresossum - totalegresosum).format(
                          `${"USD"}0,0.00`
                        )}
                      </h4>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Card>
                  <CardHeader title="Diferencia" />
                  <Divider />
                  <CardContent>
                    <Grid item md={12} xs={12}>
                      <h4>
                        $
                        {numeral(
                          totalingresos -
                            totalegreso -
                            (totalingresossum - totalegresosum)
                        ).format(`${"USD"}0,0.00`)}
                      </h4>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};
export default Validar;
