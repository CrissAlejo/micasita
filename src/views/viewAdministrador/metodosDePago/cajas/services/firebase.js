import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../../Firebase";

const db = firebase.firestore();

export const newCaja  = (Conjunto, values) => {
  return db.collection("conjuntos").doc(Conjunto).collection("cuentas").add({
    ...values,
    TipoMetodo: "Caja",
  });  
};

export const getCajasbyConjunto = (observer,Conjunto) => {
  return db
    .collection("conjuntos")
    .doc(Conjunto)
    .collection("cuentas")
    .where("TipoMetodo","==","Caja")
    .onSnapshot(observer);
};
export const getCuentabyConjunto = (observer,Conjunto) => {
  return db
    .collection("conjuntos")
    .doc(Conjunto)
    .collection("cuentas")
    .where("TipoMetodo","==","Cuenta Bancaria")
    .onSnapshot(observer);
};

export const updateCaja = (Conjunto, documentoId,values) => {

  return db.collection("conjuntos").doc(Conjunto).collection("cuentas").doc(documentoId).update(values);
};

export const deleteCaja = (Conjunto, cajaId) => {
  return db.collection("conjuntos").doc(Conjunto).collection("cuentas").doc(cajaId).delete();
};
export const newSaldo = (conjuntoID,data) => {
  return db.collection("conjuntos").doc(conjuntoID).collection("ingresos").doc().set(data)
}
export const newIngreso = (conjuntoID,data) => {
  return db.collection("conjuntos").doc(conjuntoID).collection("ingresos").doc().set({
    Valor: data.Valor,
    Descripcion: data.Descripcion,
    Fecha: new Date(),
    CuentaUid: data.CuentaUid,
    Rubro: data.Rubro,
    SubRubro: "Transferencia entre cuentas",
    Usuario: data.Usuario,
    Comprobante: data.Comprobante,
  })
}
export const newEgreso = (conjuntoID,data) => {
  return db.collection("conjuntos").doc(conjuntoID).collection("egresos").doc().set({
    Valor: data.Valor,
    Descripcion: data.Descripcion,
    Fecha: new Date(),
    CuentaUid: data.CuentaUid,
    Rubro: data.Rubro,
    SubRubro: "Transferencia entre cuentas",
    Proveedor: data.Proveedor,
    Comprobante: data.Comprobante,
  })
}

export const getIngresos = (observer, conjuntoUid, cuentaUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("ingresos").where("CuentaUid", "==", cuentaUid).onSnapshot(observer);
};

export const getEgresos = (observer, conjuntoUid, cuentaUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("egresos").where("CuentaUid", "==", cuentaUid).onSnapshot(observer);
};