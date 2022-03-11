import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../../Firebase";

const db = firebase.firestore();


export const getCuentasbyConjunto = (Conjunto) => {
  return db
    .collection("conjuntos")
    .doc(Conjunto)
    .collection("cuentas")
    .where("TipoMetodo","==","Cuenta Bancaria")
    .get();
};

export const getTransferencias = (conjuntoUid, cuentaUid, desde, hasta) => {
  return db
  .collection("conjuntos")
  .doc(conjuntoUid)
  .collection("cuentas")
  .doc(cuentaUid)
  .collection("transferencias")
  .where("Fecha", ">", desde)
  .where("Fecha", "<", hasta)
  .get();
};

export const getRubros = (conjuntoUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("rubros").get();
};

export const getValores = (conjunto, tipo, desde, hasta) => {
  return db
    .collection('conjuntos')
    .doc(conjunto)
    .collection(tipo)
    .where("Fecha", ">", desde)
    .where("Fecha", "<", hasta)
    .get();
}
export const getValoresIniciales = (conjunto, tipo, desde) => {
  return db
    .collection('conjuntos')
    .doc(conjunto)
    .collection(tipo)
    .where('Fecha', '<=', desde)
    .get();
}
export const cuentasCobrar = (conjunto, desde, hasta)=>{
  return db
    .collection('conjuntos')
    .doc(conjunto)
    .collection('cuentasPorCobrar')
    .where('FechaLimite', '>', desde)
    .where('FechaLimite', '<', hasta)
    .get();
}
export const cuentasPagar = (conjunto, desde, hasta)=>{
  return db
    .collection('conjuntos')
    .doc(conjunto)
    .collection('cuentasPagar')
    .where('FechaLimite', '>', desde)
    .where('FechaLimite', '<', hasta)
    .get();
}