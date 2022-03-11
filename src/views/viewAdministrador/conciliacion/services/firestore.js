import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";
import moment from "moment";

const db = firebase.firestore();

export const getUserByConjunto = (observer, conjuntoID) => {
  return db
    .collection("usuarios")
    .where("ConjuntoUid", "==", conjuntoID)
    .onSnapshot(observer);
};
export const getProveedoresByConjunto = (observer, conjuntoID) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("proveedores")
    .onSnapshot(observer);
};

export const getCuentasById = (observer, conjuntoID) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("cuentas")
    .onSnapshot(observer);
};
export const getConciliacionByCategoria = (observer, conjuntoID, IdCuenta) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("conciliaciones")
    .where("IdCuenta", "==", IdCuenta)
    .orderBy("FechaCorte", "desc")

    .onSnapshot(observer);
};
export const getIngresos = (observer, conjuntoID, IdCuenta, Fecha, FechaD) => {

  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("ingresos")
    .where("CuentaUid", "==", IdCuenta)
    .where("Fecha", ">=", new Date(FechaD))
    .where("Fecha", "<=", new Date(Fecha))
    .orderBy("Fecha", "desc")
    .onSnapshot(observer);
};

export const getEgresos = (observer, conjuntoID, IdCuenta, Fecha, FechaD) => {

  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("egresos")
    .where("CuentaUid", "==", IdCuenta)
    .where("Fecha", ">=", new Date(FechaD))
    .where("Fecha", "<=", new Date(Fecha))
    .orderBy("Fecha", "desc")
    .onSnapshot(observer);
};
export const getConciliacionById = (observer, conjuntoId, conciliacionId) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoId)
    .collection("conciliaciones")
    .doc(conciliacionId)
    .onSnapshot(observer);
};
export const getConciliacionesByConjunto = (observer, conjuntoID) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("conciliaciones")
    .orderBy("FechaCorte", "desc")
    .onSnapshot(observer);
};
export const deleteConciliacionByConjunto = (idconjunto, idCConciliacion) => {
  return db
    .collection("conjuntos")
    .doc(idconjunto)
    .collection("conciliaciones")
    .doc(idCConciliacion)
    .delete();
};
export const newConciliacion = (idconjuntos, form) => {
  return db
    .collection("conjuntos")
    .doc(idconjuntos)
    .collection("conciliaciones")
    .add({
      Cuenta: form.Cuenta,
      IdCuenta: form.IdCuenta,
      Detalle: form.Detalle,
      FechaCorte: form.FechaCorte,
      FechaDesde: form.FechaDesde,
      Saldo: form.Saldo,
      Ingreso: form.Ingreso,
      Egreso: form.Egreso,
      Conciliado: form.Conciliado,
      Metodo: form.Metodo
    });
};
export const updateConciliacion = (idconjuntos, idCConciliacion, form) => {
  return db
    .collection("conjuntos")
    .doc(idconjuntos)
    .collection("conciliaciones")
    .doc(idCConciliacion)
    .update({
      Cuenta: form.Cuenta,
      IdCuenta: form.IdCuenta,
      Detalle: form.Detalle,
      FechaCorte: form.FechaCorte.toString(),
      FechaDesde: form.FechaDesde,
      Saldo: form.Saldo,
      Ingreso: form.Ingreso,
      Egreso: form.Egreso,
      Conciliado: form.Conciliado,
    });
};
export const updateIngreso = (idConjunto, idIngreso, conciliado) => {
  return db
    .collection('conjuntos')
    .doc(idConjunto)
    .collection("ingresos")
    .doc(idIngreso)
    .update({Conciliado: conciliado})
}
export const updateEgreso = (idConjunto, idEgreso, conciliado) => {
  return db
    .collection('conjuntos')
    .doc(idConjunto)
    .collection("egresos")
    .doc(idEgreso)
    .update({Conciliado: conciliado})
}
export const noConciliados = (idConjunto, idConciliacion, tipo, data)=>{
  return db
    .collection('conjuntos')
    .doc(idConjunto)
    .collection('conciliaciones')
    .doc(idConciliacion)
    .collection(`${tipo}NoConciliados`)
    .add(data)
}
export const deleteNoConciliados = (idConjunto, idConciliacion)=>{
    db
    .collection('conjuntos')
    .doc(idConjunto)
    .collection('conciliaciones')
    .doc(idConciliacion)
    .collection(`ingresosNoConciliados`)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
    db
    .collection('conjuntos')
    .doc(idConjunto)
    .collection('conciliaciones')
    .doc(idConciliacion)
    .collection(`egresosNoConciliados`)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
}
export const getNoCon = (idConjunto, idConciliacion, tipo,observer) => {
  return db
    .collection('conjuntos')
    .doc(idConjunto)
    .collection('conciliaciones')
    .doc(idConciliacion)
    .collection(`${tipo}NoConciliados`)
    .orderBy("Fecha", "desc")
    .onSnapshot(observer)
} 