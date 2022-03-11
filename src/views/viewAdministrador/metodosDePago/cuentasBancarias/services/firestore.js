import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../../Firebase";

const db = firebase.firestore();


export const getImagen = (Banco) => {
  return db.collection("banco").doc(Banco);
};

 
export const newAccountBank  = (Conjunto, AccountBank, Imagen) => {
  return db.collection("conjuntos").doc(Conjunto).collection("cuentas").add({
    NombreCuenta: AccountBank.NombreCuenta,
    NumeroCuenta: AccountBank.NumeroCuenta,
    TipoIdentificacion: AccountBank.TipoIdentificacion,
    TipoCuenta: AccountBank.TipoCuenta,
    Identificacion: AccountBank.Identificacion,
    Correo: AccountBank.Correo,
    Banco: AccountBank.Banco,
    SaldoInicial: AccountBank.SaldoInicial,
    FechaCorte: AccountBank.FechaCorte,
    Logo: Imagen,
    TipoMetodo: "Cuenta Bancaria",
  });  
};

export const getCuentabyConjunto = (observer,Conjunto) => {
  return db
    .collection("conjuntos")
    .doc(Conjunto)
    .collection("cuentas")
    .where("TipoMetodo","==","Cuenta Bancaria")
    .onSnapshot(observer);
};

export const getCajasbyConjunto = (observer,Conjunto) => {
  return db
    .collection("conjuntos")
    .doc(Conjunto)
    .collection("cuentas")
    .where("TipoMetodo","==","Caja")
    .onSnapshot(observer);
};

export const getAllBanks = (observer) => {
  return db.collection("banco").onSnapshot(observer);
};

export const updateCuenta = (Conjunto, AccountBank, documentoId,Imagen) => {

  return db.collection("conjuntos").doc(Conjunto).collection("cuentas").doc(documentoId).update({
    NombreCuenta: AccountBank.NombreCuenta,
    NumeroCuenta: AccountBank.NumeroCuenta,
    TipoIdentificacion: AccountBank.TipoIdentificacion,
    TipoCuenta: AccountBank.TipoCuenta,
    Identificacion: AccountBank.Identificacion,
    TipoMetodo: "Cuenta Bancaria",
    Correo: AccountBank.Correo,
    Banco: AccountBank.Banco,
    Logo: Imagen,   
  });
};

export const deleteCuentabyID = (Conjunto, cuentaId) => {
  return db.collection("conjuntos").doc(Conjunto).collection("cuentas").doc(cuentaId).delete();
};


export const getAllTranferencias = (observer,Conjunto, cuentaId) => {
  return  db.collection("conjuntos").doc(Conjunto).collection("cuentas")
  .doc(cuentaId).collection("transferencias").where("estado", "==", "Pendiente").onSnapshot(observer)
};

export const getUsuario = (usuario) => {
  return db.collection("usuarios").doc(usuario);
};

export const updateTranferencia = (Conjunto ,documentoId, tranferenciaId,cantidad) => {
  return db.collection("conjuntos").doc(Conjunto).collection("cuentas").doc(documentoId).collection("transferencias").doc(tranferenciaId).update({
    estado: "Aprobado",
    cantidadRecibida: cantidad,
  });
};

export const getDetallesPago = (Usuario,Detalles) => {
  return  db.collection("usuarios").doc(Usuario).collection("valoresPendientes").doc(Detalles)
};

export const deleteValoresPendientes = (Usuario,ValorPendiente) => {
  return  db.collection("usuarios").doc(Usuario).collection("valoresPendientes").doc(ValorPendiente).delete();
};

export const newHistorial  = (Usuario, Cuenta, Transferencia) => {
  return db.collection("usuarios").doc(Usuario).collection("HistorialPagos").add({
    Usuario: Usuario,
    Cuenta: Cuenta,
    Tranferencia: Transferencia,
    FechaConfirmacion: new Date(),
  }); 
};

export const getUserByConjunto = (observer, conjuntoID) => {
  return db.collection("usuarios").where('ConjuntoUid', '==', conjuntoID).onSnapshot(observer);
};

export const getConjunto = (conjuntoID) => {
  return db.collection("conjuntos").doc(conjuntoID).get()
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