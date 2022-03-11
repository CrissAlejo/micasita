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
    .where("TipoMetodo","==","Cuenta Bancaria")
    .onSnapshot(observer);
};

export const getAllTranferencias = (observer, conjuntoUid, cuentaUid) => {
  return db
  .collection("conjuntos")
  .doc(conjuntoUid)
  .collection("cuentas")
  .doc(cuentaUid)
  .collection("transferencias")
  .where("Estado","==","Pendiente")
  .onSnapshot(observer);
};



export const newIngreso = (conjuntoID,data) => {
  return db.collection("conjuntos").doc(conjuntoID).collection("ingresos").add({
    Valor: data.Valor,
    Descripcion: data.Descripcion,
    Fecha: new Date(),
    FechaLimite: data.FechaLimite,
    CuentaUid: data.CuentaUid,
    Rubro: data.Rubro,
    SubRubro: data.SubRubro,
    Usuario: data.Usuario,
    Comprobante: data.Comprobante
  })
};

export const getUsuario = (usuarioId) => {
  return db.collection("usuarios").doc(usuarioId).get()
};

export const newPagoPendiente = (conjuntoID,data) => {
  return db.collection("conjuntos")
  .doc(conjuntoID)
  .collection("cuentasPorCobrar")
  .doc()
  .set({
    Nombre: data.Nombre,
    Valor: data.Valor,
    FechaLimite: new Date(new Date().setDate(new Date().getDate() + 1)),
    FechaRegistro: new Date(),
    Descripcion: data.Descripcion,
    UsuarioId: data.UsuarioId,
    NombreUsuario: data.NombreUsuario,
    CasaUsuario: data.CasaUsuario,
    Rubro: data.Rubro,
    SubRubro: data.SubRubro,
  })
};

export const deletePagoPendiente = (conjuntoId,pagoId) => {
  return db.collection("conjuntos")
  .doc(conjuntoId)
  .collection("cuentasPorCobrar")
  .doc(pagoId)
  .delete()
};

export const updateTranferencia = (conjuntoId ,cuentaID, tranferenciaId) => {
  return db.collection("conjuntos")
  .doc(conjuntoId)
  .collection("cuentas")
  .doc(cuentaID)
  .collection("transferencias")
  .doc(tranferenciaId).update({
    Estado: "Aprobado",
  });
};

