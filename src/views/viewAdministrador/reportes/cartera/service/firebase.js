import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../../Firebase";

const db = firebase.firestore();

export const getUsuariosMorosos = (conjuntoUid) => {
  var fechaHoy = new Date();
  return db.collection("conjuntos").doc(conjuntoUid).collection("cuentasPorCobrar").where("FechaLimite", "<=", fechaHoy).get();
};