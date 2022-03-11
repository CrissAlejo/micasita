import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();


export const getCuentabyConjunto = (observer,Conjunto) => {
  return db
    .collection("conjuntos")
    .doc(Conjunto)
    .collection("cuentas")
    .orderBy('TipoMetodo', 'desc')
    .onSnapshot(observer);
};

export const getEgresos = (observer, conjuntoUid, cuentaUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("egresos").where("CuentaUid", "==", cuentaUid).onSnapshot(observer);
};

export const getAllEgresos = (conjuntoUid, observer) => {
  return db.collection('conjuntos').doc(conjuntoUid).collection('egresos').onSnapshot(observer);
}

export const getRubros = (observer, conjuntoUid,tipo) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("rubros").where("Tipo","==",tipo).onSnapshot(observer);
};

export const getSubRubros = (conjuntoUid,Rubroid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("rubros").doc(Rubroid).get();
};


export const getProveedoresByConjunto = (observer, conjuntoUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("proveedores").onSnapshot(observer);
};

export const newEgreso = (conjuntoID,data) => {
  return db.collection("conjuntos").doc(conjuntoID).collection("egresos").add({
    Valor: data.Valor,
    Descripcion: data.Descripcion,
    Fecha: new Date(),
    CuentaUid: data.CuentaUid,
    Rubro: data.Rubro,
    SubRubro: data.SubRubro,
    Proveedor: data.Proveedor == 'Sin proveedor' ? null: data.Proveedor,
    Comprobante: data.Comprobante,
  })
}

export const deleteEgresoByConjunto = (idconjunto, idEgreso) => {
  return db
    .collection("conjuntos")
    .doc(idconjunto)
    .collection("egresos")
    .doc(idEgreso)
    .delete();
};
//endconjuntos
