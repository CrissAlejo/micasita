import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();

export const getUserByConjunto2 = (observer, idConjunto) => {
  var fecha = new Date();
  var fecha = new Date();
  var dia = fecha.getDate();
  var mes = fecha.getMonth()+1;
  var anio = fecha.getFullYear();
  var fecha1 = anio+"-"+mes+"-"+dia;
  return db.collection('conjuntos')
  .doc(idConjunto).collection("mantenimientos").where("ManFuturo", ">", fecha1).orderBy("ManFuturo", "asc").onSnapshot(observer);
};




export const getUserByConjunto = (observer, idConjunto) => {
  var fecha = new Date();
  var fecha = new Date();
  var dia = fecha.getDate();
  var mes = fecha.getMonth()+1;
  var anio = fecha.getFullYear();
  var fecha1 = anio+"-"+mes+"-"+dia;
  return db.collection('conjuntos')
  .doc(idConjunto).collection("mantenimientos").where("ManFuturo", "<=", fecha1).orderBy("ManFuturo", "asc").onSnapshot(observer);
};


export const getUserByConjunto3 = (idConjunto, observer) => {
  var fecha = new Date();
  var fecha = new Date();
  var dia = fecha.getDate();
  var mes = fecha.getMonth()+1;
  var anio = fecha.getFullYear();
  var fecha1 = anio+"-"+mes+"-"+dia;
  return db.collection('conjuntos')
  .doc(idConjunto).collection("mantenimientos").where("ManFuturo", "<=", fecha1).orderBy("ManFuturo", "asc").onSnapshot(observer);
};

export const getUserByConjunto1 = (observer, idConjunto) => {
  return db.collection('conjuntos')
  .doc(idConjunto).collection("mantenimientos").orderBy("ManFuturo").onSnapshot(observer);
};

export const newConjunto = (idConjunto,userName) => {
  return db.collection('conjuntos')
    .doc(idConjunto)
    .collection("mantenimientos").add({
    Fechainicio: userName.Fechaini,
    Responsable: userName.Responsable,
    Mantenimiento: userName.Descripcion,
    ManFuturo: userName.Fechafut,   
   Observaciones: userName.Observacion,
  });
};


export const updateMantenimiento = (idConjunto,userName, documentoId) => {
  return db.collection('conjuntos')
  .doc(idConjunto).collection("mantenimientos")
  .doc(documentoId)
  .update({
    Fechainicio: userName.Fechaini,
    Responsable: userName.Responsable,
    Mantenimiento: userName.Descripcion,
    ManFuturo: userName.Fechafut,   
   Observaciones: userName.Observacion,
  });
};

export const getSplash = (observer) => {
  return db.collection("splash").onSnapshot(observer);
};

export const deleteSplashId = (id,idConjunto) => {
  return db.collection('conjuntos')
  .doc(idConjunto).collection("mantenimientos").doc(id).delete();
};


