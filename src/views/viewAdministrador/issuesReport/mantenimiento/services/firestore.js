import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();

export const getUserByConjunto = (observer, conjuntoID) => {
  return db.collection("mantenimientos").orderBy("ManFuturo", "asc").onSnapshot(observer);
};




export const newConjunto = (userName) => {
  return db.collection("mantenimientos").add({
    Fechainicio: userName.Fechaini,
    Responsable: userName.Responsable,
    Mantenimiento: userName.Descripcion,
    ManFuturo: userName.Fechafut,   
   Observaciones: userName.Observacion,
  });
};

export const getSplash = (observer) => {
  return db.collection("splash").onSnapshot(observer);
};

export const deleteSplashId = (id) => {
  return db.collection("mantenimientos").doc(id).delete();
};



export const newPagoPendiente = (conjuntoId, data) => {
  return db.collection("conjuntos")
    .doc(conjuntoId)
    .collection("cuentasPorCobrar")
    .doc()
    .set({
      Nombre: data.Nombre,
      Valor: data.Valor,
      FechaLimite: data.FechaLimite,
      FechaRegistro: new Date(),
      Descripcion: data.Descripcion,
      UsuarioId: data.UsuarioId,
      NombreUsuario: data.NombreUsuario,
      CasaUsuario: data.CasaUsuario,
      Rubro: data.Rubro,
      SubRubro: data.SubRubro
    })
};

export const newUser = (values) => {
  return db.collection("usuarios").doc(values.Correo).set({
    Nombre: values.Nombre,
    Apellido: values.Apellido,
    Cedula: values.Cedula,
    Correo: values.Correo,
    Telefono: values.Telefono,
    Alicuota: values.Alicuota,
    Casa: values.Casa1 + values.Casa,
    Rol: values.Rol,
    ConjuntoUidResidencia: values.ConjuntoUidResidencia,
  })
};

export const updateUser = (values) => {
  return db.collection("usuarios").doc(values.Correo).update({
    Nombre: values.Nombre,
    Apellido: values.Apellido,
    Cedula: values.Cedula,
    Correo: values.Correo,
    Telefono: values.Telefono,
    Alicuota: values.Alicuota,
    Casa: values.Casa,
    ConjuntoUidResidencia: values.ConjuntoUidResidencia,
  })
};

export const getBitacora = (observer, conjuntoID) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("bitacoraDigital")
    .onSnapshot(observer);
};

export const updateUltimaExpensaConjunto = (idConjunto,UltimoMesAlicuota) => {
  return db.collection("conjuntos").doc(idConjunto).update({
    UltimoMesAlicuota: UltimoMesAlicuota,
  })
};

export const getConjunto = (conjuntoId) => {
  return db.collection("conjuntos").doc(conjuntoId).get()
}

export const getUser = (userId) => { 
  return db.collection("usuarios").doc(userId).get()
};

export const getUsuariosMorosos = (conjuntoUid, userId) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("cuentasPorCobrar").where("UsuarioId", "==", userId).get();
};
export const getRubros = (observer, conjuntoUid, tipo) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("rubros").where("Tipo","==",tipo).onSnapshot(observer);
};

export const getSubRubros = (conjuntoUid,Rubroid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("rubros").doc(Rubroid).get();
};