import React, { useState } from "react";
import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  CardHeader,
  CardContent,
  makeStyles,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Ingresos from "./Ingresos";
import Egresos from "./Egresos";
import Page from "../../../../components/Page";
import * as FirestoreService from "./../services/firestore";
import useSettings from "../../../../contextapi/hooks/useSettings";
import SplashScreen from "../../../../components/Common/SplashScreen";
import numeral from "numeral";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: "100%",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));
const Detalle = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState("Ingresos");
  const { settings } = useSettings();
  const [ingresos, setIngresos] = React.useState([]);
  const [valoringreso, setValoringreso] = React.useState(0);
  const [conciliacion, setConciliacion] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [egresos, setEgresos] = React.useState([]);
  const [valoregreso, setValoregreso] = React.useState(0);

  const [ingNoCon, setIngNoCon] = useState([]);
  const [egrNoCon, setEgrNoCon] = useState([]);

  const tabs = [
    { value: "Ingresos", label: "Ingresos" },
    { value: "Egresos", label: "Egresos" },
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };
  const { threadKey } = useParams();
  const getConjuntoById = React.useCallback(() => {
    try {
      FirestoreService.getConciliacionById(
        {
          next: (querySnapshot) => {
            getIngresos(querySnapshot);
            setConciliacion(querySnapshot.data());
          },
        },
        settings.idConjunto,
        threadKey
      );
    } catch (e) {}
  }, [settings.idConjunto]);
  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);
  React.useEffect(()=>{
    if(conciliacion.Metodo == "excel"){
      FirestoreService.getNoCon(settings.idConjunto, threadKey, 'ingresos',{
        next: (querySnapshot) => {
          const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
          setIngNoCon(Items)
        }
      });
      FirestoreService.getNoCon(settings.idConjunto, threadKey, 'egresos',{
        next: (querySnapshot) => {
          const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
          setEgrNoCon(Items)
        }
      });
    }
  }, [conciliacion]);
  const getIngresos = (value) => {
    try {
      FirestoreService.getIngresos(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            let conts = 0;
            Items.forEach((element) => {
              conts = parseFloat(conts + parseFloat(element.data().Valor));
            });
            setValoringreso(conts);
            setIngresos(Items);
            getEgresos(value);
          },
        },
        settings.idConjunto,
        value.data().IdCuenta,
        value.data().FechaCorte,
        value.data().FechaDesde
      );
    } catch (error) {}
  };
  const getEgresos = (value) => {
    FirestoreService.getEgresos(
      {
        next: (querySnapshot) => {
          const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
          let conts = 0;
          Items.forEach((element) => {
            conts = parseFloat(conts + parseFloat(element.data().Valor));
          });
          setValoregreso(conts);
          setEgresos(Items);
          setLoading(false);
        },
      },
      settings.idConjunto,
      value.data().IdCuenta,
      value.data().FechaCorte,
      value.data().FechaDesde
    );
  };
  if (loading) {
    return <SplashScreen />;
  }
  return (
    <Page className={classes.root}>
      <Container maxWidth="lg">
        <Header />

        <Grid container spacing={3} style={{marginTop: "10px"}}>
          <Grid item xs={12} lg={3}>
            <Card>
              <CardHeader title="Saldo cuenta" />
              <Divider />
              <CardContent>
                <Grid item md={12} xs={12}>
                  <h4>
                    ${numeral(conciliacion.Saldo).format(`${"USD"}0,0.00`)}
                  </h4>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Card>
              <CardHeader title="Total Ingreso" />
              <Divider />
              <CardContent>
                <Grid item md={12} xs={12}>
                  <h4>${numeral(valoringreso).format(`${"USD"}0,0.00`)}</h4>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Card>
              <CardHeader title="Total de Egresos" />
              <Divider />
              <CardContent>
                <Grid item md={12} xs={12}>
                  <h4>${numeral(valoregreso).format(`${"USD"}0,0.00`)}</h4>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={3}>
            <Card>
              <CardHeader title="Diferencia" />
              <Divider />
              <CardContent>
                <Grid item md={12} xs={12}>
                  <h4>
                    $
                    {numeral(valoringreso - valoregreso).format(
                      `${"USD"}0,0.00`
                    )}
                  </h4>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>


        <Box mt={3}>
          <Tabs
            onChange={handleTabsChange}
            scrollButtons="auto"
            value={currentTab}
            variant="scrollable"
            textColor="secondary"
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        <Divider />
        <Box mt={3}>
          {currentTab === "Egresos" && (
            <Egresos threadKey={threadKey} egresos={egresos} metodo={conciliacion.Metodo} dataNoCon={egrNoCon}/>
          )}
          {currentTab === "Ingresos" && (
            <Ingresos threadKey={threadKey} ingresos={ingresos} metodo={conciliacion.Metodo} dataNoCon={ingNoCon}/>
          )}
        </Box>
      </Container>
    </Page>
  );
};
export default Detalle;
