import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../Firebase";

const db = firebase.firestore();


export const newEgreso = (conjuntoID,data) => {
  return db.collection("conjuntos").doc(conjuntoID).collection("egresos").add({
    Valor: data.Valor,
    Descripcion: data.Descripcion,
    Fecha: new Date(Math.round((data.Fecha - (25567 + 1)) * 86400 * 1000)),
    CuentaUid: data.Cuenta,
    Rubro: data.Rubro,
    SubRubro: data.SubRubro,
    Proveedor: data.Proveedor,
    Comprobante: data.Comprobante,
  })
};

export const newIngreso = (conjuntoID,data) => {
  return db.collection("conjuntos").doc(conjuntoID).collection("ingresos").add({
    Valor: data.Valor,
    Descripcion: data.Descripcion,
    Fecha: new Date(Math.round((data.Fecha - (25567 + 1)) * 86400 * 1000)),
    CuentaUid: data.Cuenta,
    Rubro: data.Rubro,
    SubRubro: data.SubRubro,
    Usuario: data.Usuario,
    Comprobante: data.Comprobante,
  })
};

export const newPagoPendiente = (conjuntoID,data) => {
  return db.collection("conjuntos")
  .doc(conjuntoID)
  .collection("cuentasPorCobrar")
  .doc()
  .set({
    Nombre: data.Nombre,
    Valor: data.Valor,
    FechaLimite: new Date(Math.round((data.FechaLimite - (25567 + 1)) * 86400 * 1000)),
    FechaRegistro: new Date(Math.round((data.FechaRegistro - (25567 + 1)) * 86400 * 1000)),
    Descripcion: data.Descripcion,
    UsuarioId: data.UsuarioId,
    NombreUsuario: data.NombreUsuario,
    CasaUsuario: data.CasaUsuario
  })
};

export const getProveedorById = (idconjunto, uid) => {
  return db
    .collection("conjuntos")
    .doc(idconjunto)
    .collection("proveedores")
    .doc(uid.toString())
    .get();
};

export const newPedido = (idconjuntos, proveedor, form) => {
  return db
    .collection("conjuntos")
    .doc(idconjuntos)
    .collection("cuentasPagar")
    .doc()
    .set({
      ProveedorRuc: proveedor?.id,
      ProveedorNombre: proveedor?.NombreRepresentante,
      ProveedorCelular: proveedor?.TelefonoRepresentante,
      Nombre: form.Nombre,
      Detalle: form.Detalle,
      Cantidad: form.Cantidad,
      Rubro: form.Rubro,
      SubRubro: form.SubRubro,
      Costo: form.Costo,
      Plazo: new Date(Math.round((form.Plazo - (25567 + 1)) * 86400 * 1000)),
      NumeroFactura: form.NumeroFactura,
      CuentaUid: JSON.parse(form?.Categoria)?.id || "noproveedor",
      CuentaNombre: JSON.parse(form?.Categoria)?.nombre || "noproveedor",
      CuentaBanco: JSON.parse(form?.Cuenta)?.Banco || "noproveedor",
      Fecha: new Date(),
      Pagado: false,
      FechaFactura:form.FechaFactura,
    });
};

