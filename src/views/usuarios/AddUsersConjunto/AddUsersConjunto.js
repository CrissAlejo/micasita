import React, { useState } from "react";
import { useParams } from "react-router-dom";
import firebase from '../../../Firebase';
import * as XLSX from "xlsx";

import * as FirestoreService from "../services/firestore";
import AddUser from "../../usuarios/NewUsuario/NewUser"
import Usuarios from "../../usuarios/usuarios"

import Button from "../../../components/CustomButtons/Button";
import { Grid } from "@material-ui/core";


function AddUsersConjunto(props) {
  const [Items, setItems] = useState([]);
  const { threadKey,nameConjunto } = useParams();

  //============================LEER EXCEL=====================
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
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
  //============================GENERAR CONTRASEÑA ALEATORIA=====================
  function randomPassword() {
    let chars = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnPpQqReSsTtUuVvWwXxYyZz';
    let password = '';
    for (let i = 0; i < 18; i++) {
      password += chars[Math.floor((Math.random() * chars.length))];
    }
    return password;
  };

  //============================CREAR USUARIOS AUTH=====================

  const submit = async () => {
    let conjunto = threadKey;
    Items.forEach(function (newUser) {
      let password = randomPassword();
      let registro = {
        Rol: JSON.stringify({administrador:false,residente:true,guardia:false}),
        Alicuota: Number(newUser.Alicuota) || 0,
        Apellido: newUser.Apellido,
        Casa: newUser.Unidad_Habitacional,
        Cedula: newUser.Cedula,
        Correo: newUser.Correo,
        Nombre: newUser.Nombre,
        Telefono: newUser.Telefono,
        Comprobantes: Array(12).fill({Year: '', NumeroComprobante: 0}),
        ConjuntoUidResidencia: conjunto
  }

   FirestoreService.getUser(registro.Correo).then((doc) => {
          if (!doc.exists) {
            FirestoreService.newUser(registro).then(() =>{
                firebase.auth().createUserWithEmailAndPassword(registro.Correo, password).then((doc) =>{
                  firebase.auth().sendPasswordResetEmail(registro.Correo).then(function () {
                    })
                    .catch(function (error) {
                    });
                });
            })
            .catch((error) => {
            });
          } else{
          }
        }).catch((error) => {
        });      
    });
  }

  function nuevaFoto() {
    document.getElementById('file').click();
  };

  return (
    <div style={{padding: 12}}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <p>Cargar usuarios</p>
          <div id="foto" onClick={nuevaFoto}>
            <img src="/assets/img/excel.png" alt="imagen descriptiva de carga de archivos excel" width="50px;"></img>
            <p>Seleccione el ícono para subir un archivo (.xlsx , .xls)</p>
          </div>
          <input type="file" id="file" hidden accept=".xlsx, .xls" onChange={(e) => {
            const file = e.target.files[0];
            readExcel(file);}}
          >
          </input>
        </Grid>
        <Grid item xs={12} sm={6} style={{textAlign: 'end', alignSelf: 'center'}}>
          <Button color="warning" onClick={submit}>Crear desde archivo</Button>
          <AddUser info={threadKey} nameConjunto = {nameConjunto}/>
        </Grid>
      </Grid>
      <br/>
      <Usuarios info={threadKey} />
    </div>

  );
}

export default AddUsersConjunto;
