import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from '@material-ui/core';
import * as FirestoreService from './services/firestore'
import { useSnackbar } from "notistack";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
  },

}));


export default function DatosIniciales() {
  const classes = useStyles();
  const { threadKey } = useParams();
  const [items, setItems] = React.useState([]);
  const [disabledIngresos, setDisabledIngresos] = React.useState(true);
  const [disabledEgresos, setDisabledEgresos] = React.useState(true);
  const [disabledCuentasPorCobrar, setDisabledCuentasPorCobrar] = React.useState(true);
  const [disabledCuentasPorPagar, setDisabledCuentasPorPagar] = React.useState(true);
  const {enqueueSnackbar} = useSnackbar();
  
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
      setItems(d);
    });
  };

  function nuevoArchivo(tipo) {
    if(tipo == "Ingresos"){
      setItems([]);
      document.getElementById('file').click();
      setDisabledIngresos(false);
      setDisabledEgresos(true);
      setDisabledCuentasPorCobrar(true);
      setDisabledCuentasPorPagar(true);
    }
    if(tipo == "Egresos"){
      setItems([]);
      document.getElementById('file').click();
      setDisabledEgresos(false);
      setDisabledIngresos(true);
      setDisabledCuentasPorCobrar(true);
      setDisabledCuentasPorPagar(true);
    }
    if(tipo == "CuentasPorCobrar"){
      setItems([]);
      document.getElementById('file').click();
      setDisabledCuentasPorCobrar(false);
      setDisabledIngresos(true);
      setDisabledEgresos(true);
      setDisabledCuentasPorPagar(true);
    }
    if(tipo == "CuentasPorPagar"){
      setItems([]);
      document.getElementById('file').click();
      setDisabledCuentasPorPagar(false);
      setDisabledCuentasPorCobrar(true);
      setDisabledIngresos(true);
      setDisabledEgresos(true);
    }
   
  };

  const confir = (tipo) => {
    let conjuntoId = threadKey;
    if(items.length > 0 && tipo == "Ingresos"){
      items.forEach(function (newIngreso) {
        let data = {          
          CuentaUid: newIngreso.Cuenta,
          Rubro: newIngreso.Rubro,
          SubRubro: newIngreso.SubRubro,
          Usuario: newIngreso.CorreoResidente,
          Fecha: newIngreso.Fecha,
          Descripcion: newIngreso.Descripción,
          Valor: newIngreso.Valor,
          Comprobante: newIngreso.Comprobante,
        }
        FirestoreService.newIngreso(conjuntoId,data).then(()=>{
          enqueueSnackbar("Ingresos añadidos correctamente", {
            variant: "success",
          });
        });
      },
    )}
    else if(items.length > 0 && tipo == "Egresos"){
      items.forEach(function (newEgreso) {
        let data = {          
          CuentaUid: newEgreso.Cuenta,
          Rubro: newEgreso.Rubro,
          SubRubro: newEgreso.SubRubro,
          Proveedor: newEgreso.CorreoProveedor,
          Fecha: newEgreso.Fecha,
          Descripcion: newEgreso.Descripción,
          Valor: newEgreso.Valor,
          Comprobante: newEgreso.Comprobante,
        }
        FirestoreService.newEgreso(conjuntoId,data).then(()=>{
          enqueueSnackbar("Egresos añadidos correctamente", {
            variant: "success",
          });
        });

      },
    )}
    else if(items.length > 0 && tipo == "CuentasPorCobrar"){
      items.forEach(function (newIngreso) {
        let data = {          
          CasaUsuario: newIngreso.Unidad_Habitacional,
          Descripcion: newIngreso.Descripción_del_pago_por_cobrar,
          FechaLimite: newIngreso.Fecha_límite_de_pago,
          FechaRegistro: newIngreso.Fecha_de_registro,
          Nombre: newIngreso.Detalle_del_pago_por_cobrar,
          NombreUsuario: newIngreso.Nombre_del_residente,
          UsuarioId: newIngreso.Correo_electrónico_del_residente,
          Rubro: newIngreso.Rubro,
          SubRubro: newIngreso.SubRubro,
          Valor: newIngreso.Valor
        }
        FirestoreService.newPagoPendiente(conjuntoId,data).then(()=>{
          enqueueSnackbar("Cuentas por cobrar añadidas correctamente", {
            variant: "success",
          });
        });
      },
    )}
    else if(items.length>0 && tipo == "CuentasPorPagar"){
      items.forEach((rs) => {
        rs.Categoria = JSON.stringify({ id: "Caja chica", nombre: "Caja chica" });
        try {
          FirestoreService.getProveedorById(
            conjuntoId,
            rs.ProveedorCedula
          ).then((respond) => {
            if (respond.data()) {
              rs.id = respond.id;
              rs.NombreRepresentante = respond.data().NombreRepresentante;
              rs.TelefonoRepresentante = respond.data().TelefonoRepresentante;
              FirestoreService.newPedido(conjuntoId, rs, rs).then(
                enqueueSnackbar("Cuentas por cobrar añadidas correctamente", {
                  variant: "success",
                })
              );
            } else {
              rs.id = "noproveedor";
              rs.NombreRepresentante = "noproveedor";
              rs.TelefonoRepresentante = "noproveedor";
              FirestoreService.newPedido(conjuntoId, rs, rs).then(
                enqueueSnackbar("Cuentas por cobrar añadidas correctamente", {
                  variant: "success",
                })
              );
            }
          });
        } catch (err) {
          console.error(err);
        }
      });
    }
    else{
      enqueueSnackbar("No se ha seleccionado ningun archivo", {
        variant: "error",
      });      
    }
    
  };

  return (
    <div>
      <center>
        <h1>Cargar datos iniciales desde un archivo excel</h1>
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
      </center>
      <List className={classes.root}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <img
                src="/assets/img/excel.png"
                alt="imagen descriptiva de carga de archivos excel"
                width="50px;"
              />

            </Avatar>
          </ListItemAvatar>
          <ListItem button onClick={() => {nuevoArchivo("Ingresos")}} >
          <ListItemText primary="Cargar datos de Ingresos" secondary="Subir un archivo (.xlsx , .xls)" />
          </ListItem>
          <Button variant="outlined" disabled = {disabledIngresos} onClick={() => {confir("Ingresos")}}>
          Crear
          </Button>
        </ListItem>
        <ListItem>

          <ListItemAvatar>
            <Avatar>
              <img
                src="/assets/img/excel.png"
                alt="imagen descriptiva de carga de archivos excel"
                width="50px;"
              />
            </Avatar>
          </ListItemAvatar>
          <ListItem button onClick={() => {nuevoArchivo("Egresos")}} >
            <ListItemText  primary="Cargar datos de Egresos" secondary="Subir un archivo (.xlsx , .xls)" />
          </ListItem>
        <Button variant="outlined" disabled = {disabledEgresos} onClick={() => {confir("Egresos")}} >
          Crear
        </Button>
        </ListItem>
        <ListItem >
          <ListItemAvatar>
            <Avatar>
              <img
                src="/assets/img/excel.png"
                alt="imagen descriptiva de carga de archivos excel"
                width="50px;"
              />
            </Avatar>
          </ListItemAvatar>
          <ListItem button onClick={() => {nuevoArchivo("CuentasPorCobrar")}} >
            <ListItemText primary="Cargar datos de Cuentas por Cobrar" secondary="Subir un archivo (.xlsx , .xls)" />
          </ListItem>
          <Button variant="outlined" disabled = {disabledCuentasPorCobrar} onClick={() => {confir("CuentasPorCobrar")}}>
            Crear
          </Button>
        </ListItem>
        <ListItem >
          <ListItemAvatar>
            <Avatar>
              <img
                src="/assets/img/excel.png"
                alt="imagen descriptiva de carga de archivos excel"
                width="50px;"
              />
            </Avatar>
          </ListItemAvatar>
          <ListItem button onClick={() => {nuevoArchivo("CuentasPorPagar")}} >
            <ListItemText primary="Cargar datos de Cuentas por Pagar" secondary="Subir un archivo (.xlsx , .xls)" />
          </ListItem>
          <Button variant="outlined" disabled = {disabledCuentasPorPagar} onClick={() => {confir("CuentasPorPagar")}}>
            Crear
          </Button>
        </ListItem>
      </List>
    </div>

  );
}