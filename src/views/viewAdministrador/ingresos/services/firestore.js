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

export const getIngresos = (observer, conjuntoUid, cuentaUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("ingresos").where("CuentaUid", "==", cuentaUid).onSnapshot(observer);
};

export const getAllIngresos = (conjuntoUid, observer) => {
  return db.collection('conjuntos').doc(conjuntoUid).collection('ingresos').onSnapshot(observer);
}

export const getRubros = (observer, conjuntoUid, tipo) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("rubros").where("Tipo","==",tipo).onSnapshot(observer);
};

export const getSubRubros = (conjuntoUid,Rubroid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("rubros").doc(Rubroid).get();
};

export const getUsuariosByConjunto = (observer, conjuntoUid) => {
  return db.collection("usuarios").where("ConjuntoUidResidencia","==",conjuntoUid).onSnapshot(observer);
};

export const newIngreso = (conjuntoID,data) => {
  return db.collection("conjuntos").doc(conjuntoID).collection("ingresos").add({
    Valor: data.Valor,
    Descripcion: data.Descripcion,
    Fecha: new Date(),
    CuentaUid: data.CuentaUid,
    Rubro: data.Rubro,
    SubRubro: data.SubRubro,
    Usuario: data.Usuario,
    Comprobante: data.Comprobante
  })
}

export const deleteIngresoByConjunto = (idconjunto, idIngreso) => {
  return db
    .collection("conjuntos")
    .doc(idconjunto)
    .collection("ingresos")
    .doc(idIngreso)
    .delete();
};
//endconjuntos
