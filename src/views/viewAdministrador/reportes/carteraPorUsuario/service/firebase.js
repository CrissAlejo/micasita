import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../../Firebase";

const db = firebase.firestore();

export const getDeudas = (conjuntoUid) => {
  var fecha = new Date(new Date().getFullYear(), 12,31);
  return db.collection("conjuntos").doc(conjuntoUid).collection("cuentasPorCobrar").where("FechaLimite", "<=", fecha).get();
};
export const getUsuariosByConjunto = (conjuntoUid) => {
    return db.collection('usuarios').where("ConjuntoUidResidencia", "==", conjuntoUid).get();
}