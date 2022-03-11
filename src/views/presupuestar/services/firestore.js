import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../Firebase";

const db = firebase.firestore();

//adminconjuntos

export const getFecha = (date) => {
  return firebase.firestore.Timestamp.fromDate(date);
};

export const newPresupuesto = (conjuntoUid, datos) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("presupuestos").add({
    Nombre: datos.Nombre,
    Anio: datos.Anio,
    Fecha: datos.Fecha,
    Datos: datos.Datos,
  });
};

export const getUsersByConjunto = (conjuntoUid) => {
  return db.collection("usuarios").where("OnlyConjUid", "array-contains", conjuntoUid).get();
};

export const getRubIng = (conjuntoUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("rubros").where("Tipo", "==", "Ingreso").get();
};

export const getRubEgr = (conjuntoUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("rubros").where("Tipo", "==", "Egreso").get();
};

export const getPresupuestoByConjunto = (conjuntoUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("presupuestos").get();
};
export const getDetalleBypresupuesto = (observer, conjuntoUid, presupuestoId) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("presupuestos").doc(presupuestoId).onSnapshot(observer);
};
export const deletePresupuesto = (conjuntoUid, presuUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("presupuestos").doc(presuUid).delete();
};

export const getPresupuesto = (conjuntoUid, presuUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("presupuestos").doc(presuUid).get();
};
export const getIngresos = (observer, conjuntoID, desde, hasta) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("ingresos")
    .where("Fecha", ">=", desde)
    .where("Fecha", "<=", hasta)
    .orderBy("Fecha", "desc")
    .onSnapshot(observer);
};

export const getPresupuestoAnterior = (conjuntoUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("presupuestos").orderBy("Fecha", "desc").limit(1).get();
};

export const getEgresos = (observer, conjuntoID, desde, hasta) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("egresos")
    .where("Fecha", ">=", desde)
    .where("Fecha", "<=", hasta)
    .orderBy("Fecha", "desc")
    .onSnapshot(observer);
};
