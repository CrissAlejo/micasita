import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();
export const getCuentasById = (observer, conjuntoID) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("cuentas")
    .onSnapshot(observer);
};

export const getProveedorById = (idconjunto, uid) => {
  return db
    .collection("conjuntos")
    .doc(idconjunto)
    .collection("proveedores")
    .doc(uid.toString())
    .get();
};
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
export const deleteProveedorByConjunto = (idconjunto, idproveedor) => {
  return db
    .collection("conjuntos")
    .doc(idconjunto)
    .collection("proveedores")
    .doc(idproveedor)
    .delete();
};
export const newProveedor = (idconjuntos, form) => {
  return db
    .collection("conjuntos")
    .doc(idconjuntos)
    .collection("proveedores")
    .doc(form.Ruc.toString())
    .set({
      RazonSocial: form.RazonSocial,
      Correo: form.Correo,
      TelefonoOficina: form.TelefonoOficina,
      NombreRepresentante: form.NombreRepresentante,
      ApellidoRepresentante: form.ApellidoRepresentante,
      Ruc: form.Ruc,
      CorreoRepresentante: form.CorreoRepresentante,
      TelefonoRepresentante: form.TelefonoRepresentante,
      Direccion: form.Direccion,
      Detalle: form.Detalle,
    });
};
export const updateProveedor = (idconjuntos, idproveedor, form) => {
  return db
    .collection("conjuntos")
    .doc(idconjuntos)
    .collection("proveedores")
    .doc(idproveedor)
    .update({
      RazonSocial: form.RazonSocial,
      Correo: form.Correo,
      TelefonoOficina: form.TelefonoOficina,
      NombreRepresentante: form.NombreRepresentante,
      ApellidoRepresentante: form.ApellidoRepresentante,
      Ruc: form.Ruc,
      CorreoRepresentante: form.CorreoRepresentante,
      TelefonoRepresentante: form.TelefonoRepresentante,
      Direccion: form.Direccion,
      Detalle: form.Detalle,
    });
};
export const getPedidos = (observer, conjuntoID, proveedorId) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("cuentasPagar")
    .where('Pagado', '==', false)
    .orderBy("Fecha", "desc")
    .onSnapshot(observer);
};
export const newPedido = (idconjuntos, proveedor, form) => {

  return db
    .collection("conjuntos")
    .doc(idconjuntos)
    .collection("cuentasPagar")
    .doc()
    .set({
      ProveedorId: proveedor?.id,
      ProveedorRuc: proveedor?.Ruc,
      ProveedorNombre: `${proveedor?.NombreRepresentante} ${proveedor?.ApellidoRepresentante}`,
      ProveedorCelular: proveedor?.TelefonoRepresentante,
      Nombre: form.Nombre,
      Detalle: form.Detalle,
      Cantidad: form.Cantidad,
      Rubro: form.Rubro,
      SubRubro: form?.SubRubro,
      Costo: form.Costo,
      Plazo: new Date(form.Plazo),
      NumeroFactura: form.NumeroFactura,
      CuentaUid: JSON.parse(form?.Cuenta)?.id || "noproveedor",
      CuentaNombre: JSON.parse(form?.Cuenta)?.nombre || "noproveedor",
      CuentaBanco: JSON.parse(form?.Cuenta)?.Banco || "noproveedor",
      Pagado: false,
      Fecha: new Date(),
      FechaFactura: form.FechaFactura,
    });
};
export const updatePedido = (idconjuntos, idcuenta, form,proveedor) => {
  return db
    .collection("conjuntos")
    .doc(idconjuntos)
    .collection("cuentasPagar")
    .doc(idcuenta)
    .update({
      ProveedorId: proveedor.ProveedorId,
      ProveedorRuc: proveedor.ProveedorRuc,
      ProveedorNombre: proveedor.ProveedorNombre,
      ProveedorCelular:proveedor.ProveedorCelular,
      Nombre: form.Nombre,
      Detalle: form.Detalle,
      Cantidad: form.Cantidad,
      Rubro: form.Rubro,
      SubRubro: form?.SubRubro,
      Costo: form.Costo,
      Plazo: new Date(form.Plazo),
      NumeroFactura: form.NumeroFactura,
      CuentaUid: JSON.parse(form?.Cuenta)?.id || "noproveedor",
      CuentaNombre: JSON.parse(form?.Cuenta)?.nombre || "noproveedor",
      CuentaBanco: JSON.parse(form?.Cuenta)?.Banco || "noproveedor",
      Pagado: false,
      Fecha: new Date(),
      FechaFactura: form.FechaFactura,
    });
};
export const getRubros = (observer, conjuntoUid, tipo) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoUid)
    .collection("rubros")
    .where("Tipo", "==", tipo)
    .onSnapshot(observer);
};

export const getSubRubros = (conjuntoUid, Rubroid) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoUid)
    .collection("rubros")
    .doc(Rubroid)
    .get();
};
export const getSubRubross = (conjuntoUid, Rubroid) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoUid)
    .collection("rubros")
    .doc(Rubroid)
    .get();
};

export const newEgreso = (idconjuntos, form) => {
  return db
    .collection("conjuntos")
    .doc(idconjuntos)
    .collection("egresos")
    .add({
      CuentaUid: form.CuentaUid,
      Descripcion: form.Nombre,
      Proveedor: form.ProveedorId,
      Rubro: form.Rubro,
      SubRubro: form.SubRubro,
      Valor: form.Costo*1,
      Fecha: new Date(),
    });
};
export const deletepago = (idconjunto, idpedido) => {
  return db
    .collection("conjuntos")
    .doc(idconjunto)
    .collection("cuentasPagar")
    .doc(idpedido)
    .delete();
};
export const finPagoPendiente = (idconjunto, idpedido) => {
  return db
    .collection("conjuntos")
    .doc(idconjunto)
    .collection("cuentasPagar")
    .doc(idpedido)
    .update({
      Pagado: true,
    });
};
