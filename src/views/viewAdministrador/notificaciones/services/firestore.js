import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";
const db = firebase.firestore();
export const getMensaje = (observer, idConjunto) => {
  return db.collection('conjuntos')
  .doc(idConjunto).collection("mensajes").onSnapshot(observer);
};
export const get_token = (observer) => {
  try {
  return db.collection("usuarios").onSnapshot(observer);
  }catch (error) {
      console.log('One failed:', error.message);
  }
};
export const newMensaje = (idConjunto,userName) => {
  var fecha = new Date();
  var dia = fecha.getDate();
  var mes = fecha.getMonth()+1;
  var anio = fecha.getFullYear();
  var fecha1 = anio+"-"+mes+"-"+dia;
  return db.collection('conjuntos')
    .doc(idConjunto)
    .collection("mensajes").add({
    Fecha: fecha1,
    Titulo: userName.Titulo,
    Mensaje: userName.Mensaje,
  });
};
export const updateMensaje = (idConjunto,userName, documentoId) => {
  var fecha = new Date();
  var dia = fecha.getDate();
  var mes = fecha.getMonth()+1;
  var anio = fecha.getFullYear();
  var fecha1 = anio+"-"+mes+"-"+dia;
  return db.collection('conjuntos')
  .doc(idConjunto).collection("mensajes")
  .doc(documentoId)
  .update({
    Fecha: fecha1,
    Titulo: userName.Titulo,
    Mensaje: userName.Mensaje,
  });
};
export const deleteMensaje = (id,idConjunto) => {
  return db.collection('conjuntos')
  .doc(idConjunto).collection("mensajes").doc(id).delete();
};
export const reenviarMensaje = (id,idConjunto) => {
  return db.collection('conjuntos')
  .doc(idConjunto).collection("mensajes").doc(id).get();
};
