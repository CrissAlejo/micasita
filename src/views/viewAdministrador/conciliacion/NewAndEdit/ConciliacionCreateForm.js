import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import * as XLSX from "xlsx";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  makeStyles,
  Typography,
  Avatar
} from "@material-ui/core";
import QuillEditor from "../../../../components/QuillEditor";
import renderTextField from "../../../../components/FormElements/InputText";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import UpdateOutlined from "@material-ui/icons/UpdateOutlined";
import MomentUtils from "@date-io/moment";
import useSettings from "../../../../contextapi/hooks/useSettings";
import moment from "moment";
import "moment/locale/es";
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
const useStyles = makeStyles((theme) => ({
  root: {},

  datePicker: {
    "& + &": {
      marginLeft: theme.spacing(2),
    },
  },
  editor: {
    "& .ql-editor": {
      height: 160,
    },
  },
}));

const ConciliacionCreateForm = (prop) => {
  const classes = useStyles();
  const { settings } = useSettings();
  const [loading, setloading] = React.useState(false);
  const [cuentas, setCuentas] = React.useState([]);
  const [cajas, setCajas] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [formulario] = React.useState(prop.data);
  const [categoria] = React.useState(prop.categories);
  const [fechavalidar, setFechavalidar] = React.useState(prop.fechavalidate);
  const [dataFromFile, setDataFromFile] = useState([]);
  const [opcion, setOpcion] = useState(prop.data?.data().Metodo || '');

  const getConjuntoById = React.useCallback(() => {
    try {
      FirestoreService.getCuentasById(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            if (Items.length > 0) {
              const cB = Items.filter( item => item.data().TipoMetodo==="Cuenta Bancaria");
              const cC = Items.filter( item => item.data().TipoMetodo==="Caja")
              setCuentas(cB);
              setCajas(cC);
            } else {
              enqueueSnackbar("No existen cuentas para el conjunto", {
                variant: "error",
              });
              prop.send();
            }
          },
        },
        settings.idConjunto
      );
    } catch (e) {}
  }, [settings.idConjunto]);
  React.useEffect(() => {
    getConjuntoById();
  }, [getConjuntoById]);
  const finddate = (value) => {
    let data = JSON.parse(value);
    const resultado = categoria.find((sub) => sub?.IdCuenta === data.id);
    setFechavalidar(resultado?.FechaCorte);
  };

  const getIngresos = (value) => {
    let fechvad = fechavalidar;
    if (prop?.data) {
      fechvad = prop.data.data().FechaDesde;
    }
    try {
      FirestoreService.getIngresos(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            getEgresos(Items, value);
          },
        },
        settings.idConjunto,
        JSON.parse(value.Cuenta).id,
        value.FechaCorte,
        fechvad
      );
    } catch (error) {
      enqueueSnackbar('no se pudo calcular los ingresos', {
        variant: "error",
      });
      setloading(false);
    }
  };
  const getEgresos = (Item, value) => {
    let fechvad = fechavalidar;
    if (prop?.data) {
      fechvad = prop.data.data().FechaDesde;
    }
    FirestoreService.getEgresos(
      {
        next: (querySnapshot) => {
          const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
          if(opcion == 'saldo'){
            calcular(Item, Items, value);
          } else {
            conciliar(Item, Items, value)
          }
        },
      },
      settings.idConjunto,
      JSON.parse(value.Cuenta).id,
      value.FechaCorte,
      fechvad
    );
  };

  function cargarDatos(){
    setDataFromFile([]);
    document.getElementById('file').click();
  }
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      setDataFromFile(d);
    });
  };

  const conciliar = (Ingresos, Egresos, value) => {
    let ingNoCon = [];
    let egrNoCon = [];
    let valoringreso = 0;
    let valoregreso = 0;
    let dataInd = 0;
    
    if(dataFromFile.length>0){
      const dataIng = dataFromFile.filter((e) => Number(e.CREDITO) !== 0);
      const dataEgr = dataFromFile.filter((e) => Number(e.DEBITO) !== 0);
      let valing = 0;
      let valegr = 0;
      dataIng.forEach(d=>{valing += Number(d.CREDITO)})
      dataEgr.forEach(d=>{valegr += Number(d.DEBITO)})
      value.Saldo = valing - valegr;
      try {
        if(Ingresos.length>0){
          Ingresos.forEach(ing => {
            valoringreso = valoringreso + Number(ing.data().Valor);
            const ingC = dataIng.some((dato, ind) => {
              dataInd = ind
              const d = dato['# COMPROBANTE'] == ing.data().Comprobante && dato.CREDITO == ing.data().Valor
              return d
            });
            FirestoreService.updateIngreso(settings.idConjunto, ing.id, ingC);
            if (!ingC) { ingNoCon.push(dataIng[dataInd]) }
            dataIng.splice(dataInd,1)
          });
        }
        
        if(Egresos.length>0){
          dataInd = 0;
          Egresos.forEach(egr => {
            valoregreso = valoregreso + Number(egr.data().Valor);
            const egrC = dataEgr.some((dato,ind) => {
              dataInd = ind
              return dato['# COMPROBANTE'] == egr.data().Comprobante && dato.DEBITO == egr.data().Valor
            });
            if(egrC){
              FirestoreService.updateEgreso(settings.idConjunto, egr.id, egrC);
            } else {
              egrNoCon.push(dataEgr[dataInd])
            }
            dataEgr.splice(dataInd,1)
          });
        }
        if(dataIng.length>0) ingNoCon.push(...dataIng)
        if(dataEgr.length>0) egrNoCon.push(...dataEgr)
        value.Conciliado = !(ingNoCon.length>0 || egrNoCon.length>0)
        if(!prop.data){
          saveConciliacion(valoringreso, valoregreso, value, ingNoCon,egrNoCon)
        } else {
          updateConciliacion(valoringreso, valoregreso, value, ingNoCon,egrNoCon, true);
        }
      } catch (error) {
        setloading(false);
        console.log(error)
        enqueueSnackbar("¡Conciliación Fallida!, Inténtelo más Tarde", {
          variant: "error",
        });
        prop.send()
      }
    } else {
      calcular(Ingresos, Egresos, value)
    }
  }

  const calcular = (Ingresos, Egresos, form) => {
    let valoringreso = 0;
    let valoregreso = 0;
    if (Ingresos.length > 0) {
      Ingresos.forEach((element) => {
        valoringreso = valoringreso + parseFloat(element.data().Valor);
      });
    }
    if (Egresos.length > 0) {
      Egresos.forEach((element) => {
        valoregreso = valoregreso + parseFloat(element.data().Valor);
      });
    }
    const res = form.Saldo - (valoringreso - valoregreso)
    form.Conciliado = res === 0
    if (!prop.data) {
      saveConciliacion(valoringreso, valoregreso, form);
    } else {
      updateConciliacion(valoringreso, valoregreso, form);
    }
    setloading(false);
  };

  const updateConciliacion = (valoringreso, valoregreso, values, ingNoCon=[], egrNoCon=[], fromFile=false) => {
    if(fromFile){
      FirestoreService.deleteNoConciliados(settings.idConjunto, formulario.id)
    }
    const fr = values;

    fr.Ingreso = valoringreso;
    fr.Egreso = valoregreso;
    fr.Cuenta = prop.data?.data().Cuenta;
    fr.IdCuenta = prop.data?.data().IdCuenta;
    fr.FechaDesde = prop.data.data().FechaDesde;
    fromFile.FechaCorte = prop.data.data().FechaCorte;
    FirestoreService.updateConciliacion(
      settings.idConjunto,
      formulario.id,
      fr
    ).then(() => {
      if(ingNoCon.length>0){
        ingNoCon.forEach(ing => {
          let data = {
            Id: ing.ID,
            Fecha: new Date(Math.round((ing.FECHA - (25567 + 1)) * 86400 * 1000)),
            Comprobante: ing['# COMPROBANTE'] || '',
            Valor: Number(ing.CREDITO),
            Observaciones: ing.OBSERVACIONES,
          }
          FirestoreService.noConciliados(settings.idConjunto, formulario.id, 'ingresos',data)
        })
      }
      if(egrNoCon.length>0){
        egrNoCon.forEach(egr => {
          let data = {
            Id: egr.ID,
            Fecha: new Date((ing.FECHA - (25567 + 1)) * 86397 * 1000),
            Comprobante: egr['# COMPROBANTE'] || '',
            Valor: Number(egr.DEBITO),
            Observaciones: egr.OBSERVACIONES,
          }
          FirestoreService.noConciliados(settings.idConjunto, formulario.id, 'egresos',data)
        })
      }
      setloading(false);
      enqueueSnackbar("Conciliación generada con éxito", {
        variant: "info",
      });
      prop.send();
    });
  };
  const saveConciliacion = (valoringreso, valoregreso, values, ingNoCon=[], egrNoCon=[]) => {
    let data = JSON.parse(values.Cuenta);
    let idCt = data.id;
    let nomb = data.nombreCuenta;
    const fr = values;
    fr.Ingreso = valoringreso;
    fr.Egreso = valoregreso;
    fr.Cuenta = nomb;
    fr.IdCuenta = idCt;
    fr.FechaDesde = moment(fechavalidar).format('YYYY-MM-DD HH:mm');
    fr.FechaCorte = moment(fr.FechaCorte).format('YYYY-MM-DD HH:mm')
    FirestoreService.newConciliacion(settings.idConjunto, fr).then((docRef) => {
      try {
        if(ingNoCon.length>0){
          ingNoCon.forEach(ing => {
            let data = {
              Id: ing.ID,
              Comprobante: ing['# COMPROBANTE'] || '',
              Valor: Number(ing.CREDITO),
              Observaciones: ing.OBSERVACIONES,
              Fecha: new Date(((ing.FECHA - (25567 + 1)) * 86397 * 1000)),
            }
            FirestoreService.noConciliados(settings.idConjunto, docRef.id, 'ingresos',data)
          })
        }
        if(egrNoCon.length>0){
          egrNoCon.forEach(egr => {
            let data = {
              Id: egr.ID,
              Comprobante: egr['# COMPROBANTE'] || '',
              Valor: Number(egr.DEBITO),
              Fecha: new Date(((Number(egr.FECHA) - (25567 + 1)) * 86397 * 1000)),
              Observaciones: egr.OBSERVACIONES,
            }
            FirestoreService.noConciliados(settings.idConjunto, docRef.id, 'egresos',data)
          })
        }
        setloading(false);
        enqueueSnackbar("Conciliación exitosa", {
          variant: "success",
        });
        prop.send();
      } catch (e) {
        console.log(e)
      }
    });
  };
  function validarSaldo(value) {
    let error;
    value = parseFloat(value);
    if (isNaN(value)){
      error = 'El valor debe ser un número o ingresarlo con punto decimal'
    } else if (value < 0){
      error = 'El valor debe ser un múmero positivo'
    }
    return error;
  }

  return (
    <Formik
      initialValues={{
        Cuenta:
          JSON.stringify({
            id: prop.data?.data().IdCuenta,
            nombreCuenta: prop.data?.data().Cuenta,
          }) || "",
        Detalle: prop.data?.data().Detalle || "",
        FechaCorte: prop.data ? new Date(prop.data?.data().FechaCorte) : null,
        Saldo: prop.data?.data().Saldo || 0,
      }}
      validationSchema={Yup.object().shape({
        Cuenta: Yup.string().required("La Cuenta es requerida"),
        FechaCorte: Yup.date()
          .test(
            "DOB",
            "La fecha debe ser mayor a la ultima conciliación",
            (value) => {
              let valid = false;
              let fecha1 = moment(value);
              let fecha2 = prop?.data
                ? moment(prop.data.data().FechaDesde)
                : moment(fechavalidar);
              if (fecha1.diff(fecha2, "days") >= 0) {
                valid = true;
              }
              return valid;
            }
          )
          .required("La fecha es requerida"),

        /* Saldo: Yup.number()
          .min(0)
          .required("El Saldo es requerido"), */
        Detalle: Yup.string().required("El Detalle es requerido"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setloading(true);
        values.Metodo = opcion
        values.Saldo = Number(values.Saldo)
        try {
          if(opcion == 'excel' && dataFromFile.length==0){
            if(prop?.data){
              getIngresos(values);
            } else {
              enqueueSnackbar("Importe el archivo excel con sus datos y formato establecidos.", {
                variant: "error",
              });
              setloading(false);
            }
          } else {
            getIngresos(values);
          }
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
          setloading(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        setFieldTouched,
        values,
      }) => (
        <Fragment>
          {loading ? (
            <Box display="flex" my={5}>
              <CircularProgress />
            </Box>
          ) : (
            <form
              onSubmit={handleSubmit}
              className={clsx(classes.root, prop.className)}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                  <Card>
                    <CardHeader title="Seleccione la Caja o Banco y la Fecha de corte para el filtro de las transacciones realizadas. La fecha de corte debe ser mayor a la ultima conciliación." />
                    <Divider />
                  </Card>
                </Grid>
                <Grid item md={12} lg={12}>
                  <TextField
                    fullWidth
                    label=""
                    name="Opcion"
                    required
                    onChange={(e)=> setOpcion(e.target.value)}
                    select
                    SelectProps={{ native: true }}
                    value={opcion}
                    variant="outlined"
                    onBlur={handleBlur}
                    disabled={prop?.data}
                  >
                    <option value=''>Seleccione una opción para Conciliar</option>
                    <option value='excel'>Datos de Excel</option>
                    <option value='saldo'>Saldo total de la cuenta</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardHeader title="Datos para conciliar" />
                    <Divider />
                    <CardContent>
                      <Grid item md={12} xs={12}>
                        <TextField
                          fullWidth
                          label=""
                          name="Cuenta"
                          required
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={values.Cuenta}
                          variant="outlined"
                          onBlur={() => {
                            finddate(values.Cuenta);
                          }}
                          disabled={prop?.data}
                        >
                          <option value="">-- Seleccione una Cuenta o Caja --</option>
                          <optgroup label="Cuentas Bancarias">
                          {cuentas.map((cuentas) => (
                            <option
                              key={cuentas.id}
                              value={JSON.stringify({
                                id: cuentas.id,
                                nombreCuenta:
                                  cuentas.data().NombreCuenta +
                                  "-" +
                                  cuentas.data().Banco,
                              })}
                            >
                              {cuentas.data().NombreCuenta}-
                              {cuentas.data().Banco}
                            </option>
                          ))}
                          </optgroup>
                          <optgroup label="Cajas">
                          {cajas.map((caja) => (
                            <option
                              key={caja.id}
                              value={JSON.stringify({
                                id: caja.id,
                                nombreCuenta:
                                  caja.data().NombreCaja
                              })}
                            >
                              {caja.data().NombreCaja}
                            </option>
                          ))}
                          </optgroup>
                        </TextField>
                      </Grid>

                      {opcion==='' ? (
                        <Grid item md={12} xs={12}>
                          <Typography style={{margin: '20px 0'}}>Seleccione una opcion de conciliación</Typography>
                        </Grid>
                      ): opcion==='excel' ? (
                        <Grid item xs={12} lg={12}>
                        <input
                          type="file"
                          id="file"
                          hidden
                          accept=".xlsx, .xls"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            readExcel(file);
                          }}
                        />
                        <Button
                          variant='outlined'
                          style={{color: 'green', margin: "10px 0", justifyContent: 'space-around'}}
                          fullWidth
                          onClick={()=>cargarDatos()}
                        >
                          <Avatar>
                            <img
                              src="/assets/img/excel.png"
                              alt="imagen descriptiva de carga de archivos excel"
                              width="50px;"
                            />
                          </Avatar>
                          Importar Excel
                        </Button>
                      </Grid>
                      ):(
                        <Grid item md={12} xs={12}>
                        <Field
                          error={Boolean(touched.Saldo && errors.Saldo)}
                          helperText={touched.Saldo && errors.Saldo}
                          validate={validarSaldo}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.Saldo}
                          label="Saldo real en banco"
                          placeholder="Saldo real en banco"
                          name="Saldo"
                          id="Saldo"
                          component={renderTextField}
                        />
                      </Grid>
                      )}

                      <Grid item md={12} xs={12}>
                        <MuiPickersUtilsProvider
                          locale="es"
                          utils={MomentUtils}
                        >
                          <DatePicker
                            error={Boolean(
                              touched.FechaCorte && errors.FechaCorte
                            )}
                            helperText={touched.FechaCorte && errors.FechaCorte}
                            className={classes.datePicker}
                            format="DD/MM/YYYY"
                            name="FechaCorte"
                            inputVariant="outlined"
                            variant="inline"
                            label='Fecha de Corte'
                            disableToolbar
                            autoOk
                            fullWidth
                            autoComplete='false'
                            maxDate={new Date()}
                            value={values.FechaCorte}
                            onChange={(date) =>
                              setFieldValue("FechaCorte", date._d)
                            }
                            disabled={prop?.data}
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardHeader title="Detalle" />
                    <Divider />
                    <CardContent>
                      <Paper variant="outlined">
                        <QuillEditor
                          className={classes.editor}
                          value={values.Detalle}
                          onChange={(value) => setFieldValue("Detalle", value)}
                        />
                      </Paper>
                      {touched.Detalle && errors.Detalle && (
                        <Box mt={2}>
                          <FormHelperText error>
                            {errors.Detalle}
                          </FormHelperText>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box mt={2}>
                {prop?.data ? (
                  <Button 
                  style={{color: 'primary'}}
                  color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    <UpdateOutlined />
                    Actualizar
                  </Button>
                ) : (
                  <Button
                 
                    color="primary"
                    disabled={isSubmitting || opcion == ''}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    <AddShoppingCartIcon />
                    Crear
                  </Button>
                )}
              </Box>
            </form>
          )}
        </Fragment>
      )}
    </Formik>
  );
};

ConciliacionCreateForm.propTypes = {
  className: PropTypes.string,
  fechavalidate: PropTypes.string,
};

export default ConciliacionCreateForm;
