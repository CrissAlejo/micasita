import React, { Fragment } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import * as Yup from "yup";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  makeStyles,
  InputAdornment,
} from "@material-ui/core";
import * as FirestoreService from "../services/firestore";
import AddShoppingCartIcon from "@material-ui/icons/Add";
import useSettings from "../../../../contextapi/hooks/useSettings";

const useStyles = makeStyles(() => ({
  root: {},
  editor: {
    "& .ql-editor": {
      height: 160,
    },
  },
}));

const CreateForm = ({ className, send, ...rest }) => {
  const classes = useStyles();
  const { settings } = useSettings();
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [cuentas, setCuentas] = React.useState([]);
  const [cajas, setCajas] = React.useState([]);
  const [rubros, setRubros] = React.useState([]);
  const [proveedores, setProveedores] = React.useState([]);
  const [subRubros, setSubRubros] = React.useState([]);

  const getSubRubros = (Rubro) => {
    if(Rubro!==""){
      FirestoreService.getSubRubros(settings.idConjunto,Rubro).then((doc)=>{
        if(doc){
            setSubRubros(doc.data().SubRubros);
        }
      }); 
    }         
  }

  React.useEffect(() => {
    try {
      FirestoreService.getCuentabyConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            const cB = Items.filter(item => item.data().TipoMetodo == 'Cuenta Bancaria')
            const cC = Items.filter(item => item.data().TipoMetodo == 'Caja')
            setCuentas(cB);
            setCajas(cC);
          },
        },
        settings.idConjunto
      );
    } catch (e) {}
  }, [settings.idConjunto]);

  React.useEffect(() => {
    try {
      FirestoreService.getRubros(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setRubros(Items);
          },
        },
        settings.idConjunto,"Egreso"
      );
    } catch (e) {}
  }, [settings.idConjunto]);

  React.useEffect(() => {
    try {
      FirestoreService.getProveedoresByConjunto(
        {
          next: (querySnapshot) => {
            const Items = querySnapshot.docs.map((docSnapshot) => docSnapshot);
            setProveedores(Items);
          },
        },
        settings.idConjunto
      );
    } catch (e) {}
  }, [settings.idConjunto]);

  return (
    <Formik
      initialValues={{
        CuentaUid: "",
        Descripcion: "",
        Proveedor: "",
        Rubro: "",
        SubRubro: "",
        Valor: "",
        Comprobante: '',
      }}
      validationSchema={Yup.object().shape({
        CuentaUid: Yup.string().required("¡Se requiere rellenar este campo!"),
        Descripcion: Yup.string().required("¡Se requiere rellenar este campo!")
        .test('','Campo se encuentra vacio',function vespacio (espacio){ if (typeof espacio === 'undefined' ){return false;}else{espacio = espacio.trim();if(espacio == ''){return false;}else{return true;}}}),
       
        Proveedor: Yup.string().required("¡Se requiere rellenar este campo!"),
        Rubro: Yup.string().required("¡Se requiere rellenar este campo!"),
        SubRubro: Yup.string()
          .required("¡Se requiere rellenar este campo!"),
        Comprobante: Yup.string()
          .required("¡Se requiere rellenar este campo!")
          .test('','Campo se encuentra vacio',function vespacio (espacio){ if (typeof espacio === 'undefined' ){return false;}else{espacio = espacio.trim();if(espacio == ''){return false;}else{return true;}}}),
       
        Valor: Yup.string()
          .required("¡Se requiere rellenar este campo!")
          .matches(/^(?!0\.00)[1-9]\d{0,3}(\.\d{1,2})?$/gm, "¡Solo se admiten números Ej: (9999,99)!"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        setLoading(true);
        values.Valor = Number(values.Valor);
        try {
          FirestoreService.newEgreso(settings.idConjunto, values).then(() => {
            setSubmitting(false);
            enqueueSnackbar("Egreso añadido correctamente", {
              variant: "success",
            });
          });
          send();
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
          setLoading(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <Fragment>
          {loading ? (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          ) : (
            <form
              onSubmit={handleSubmit}
              className={clsx(classes.root, className)}
              {...rest}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={errors.CuentaUid && touched.CuentaUid}
                    label="Cuenta"
                    name="CuentaUid"
                    placeholder="Selecciona la cuenta"
                    variant="outlined"
                    fullWidth="true"
                    select
                    SelectProps={{ native: true }}
                    value={values.CuentaOrigen}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      errors.CuentaUid && touched.CuentaUid && errors.CuentaUid
                    }
                  >
                    <option key={null} value={""}>
                    </option>
                    <optgroup label="Cuentas Bancarias">
                    {cuentas.map((Cuenta) => (
                        <option key={Cuenta.id} value={Cuenta.id}>
                          {Cuenta.data().Banco}-{Cuenta.data().NombreCuenta}
                        </option>
                    ))}
                    </optgroup>
                    <optgroup label="Cajas">
                    {cajas.map((caja) => (
                        <option key={caja.id} value={caja.id}>
                            {caja.data().NombreCaja}
                        </option>
                    ))}
                    </optgroup>
                  </TextField>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={errors.Rubro && touched.Rubro}
                    label="Rubro"
                    name="Rubro"
                    placeholder="Selecciona el Rubro del Egreso"
                    variant="outlined"
                    fullWidth="true"
                    select
                    SelectProps={{ native: true }}
                    value={values.Rubro}
                    onChange={handleChange}
                    onBlur={() => {getSubRubros(values.Rubro)}}
                    helperText={
                      errors.CuentaDestino &&
                      touched.CuentaDestino &&
                      errors.CuentaDestino
                    }
                  >
                    <option key={null} value={""}>
                    </option>
                    {rubros.map((Rubro) => (
                      <option key={Rubro.id} value={Rubro.data().Nombre}>
                        {Rubro.data().Nombre}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                  error={errors.SubRubro && touched.SubRubro}
                  label="SubRubro"
                  name="SubRubro"
                  placeholder="Selecciona el SubRubro del ingreso"
                  variant="outlined"
                  fullWidth="true"
                  select
                  SelectProps={{ native: true }}
                  value={values.SubRubro}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={errors.SubRubro && touched.SubRubro && errors.SubRubro}
                >
                  <option key={null} value={""}>     
                  </option>
                  {subRubros.map((subRubro) => (
                    <option key={subRubro} value={subRubro}>
                      {subRubro}
                    </option>
                  ))}
                </TextField>
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={errors.Proveedor && touched.Proveedor}
                    label="Proveedor"
                    name="Proveedor"
                    placeholder="Selecciona el Proveedor"
                    variant="outlined"
                    fullWidth="true"
                    select
                    SelectProps={{ native: true }}
                    value={values.Proveedor}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      errors.Proveedor && touched.Proveedor && errors.Proveedor
                    }
                  >
                    <option value={""}>
                    </option>
                    <option value={'Sin proveedor'}>
                      Sin proveedor
                    </option>
                    {proveedores.map((proveedor) => (
                      <option key={proveedor.id} value={proveedor.id}>
                        {proveedor.data().NombreRepresentante+' '+proveedor.data().ApellidoRepresentante}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6} lg={6}>
                  <TextField
                    error={errors.Valor && touched.Valor}
                    label="Valor"
                    name="Valor"
                    type="number"
                    variant="outlined"
                    className={classes.margin}
                    value={values.Valor}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.Valor && touched.Valor && errors.Valor}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <TextField
                    error={errors.Comprobante && touched.Comprobante}
                    label="# de Comprobante"
                    name="Comprobante"
                    variant="outlined"
                    fullWidth
                    className={classes.margin}
                    value={values.Comprobante}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={errors.Comprobante && touched.Comprobante && errors.Comprobante}
                  />
                </Grid>
                <Grid item xs={12} lg={12}>
                  <TextField
                    error={errors.Descripcion && touched.Descripcion}
                    label="Descripción del pago"
                    name="Descripcion"
                    placeholder="Agrega una descripción para la transacción"
                    variant="outlined"
                    fullWidth="true"
                    className={classes.margin}
                    value={values.Descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      errors.Descripcion &&
                      touched.Descripcion &&
                      errors.Descripcion
                    }
                  />
                </Grid>
              </Grid>
              <Box mt={2}>
                <Button
                  color="primary"
                  disabled={loading}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  <AddShoppingCartIcon /> Agregar
                </Button>
              </Box>
            </form>
          )}
        </Fragment>
      )}
    </Formik>
  );
};

CreateForm.propTypes = {
  className: PropTypes.string,
};

export default CreateForm;
