import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "src/Firebase";

const db = firebase.firestore();


export const getCuentabyConjunto = (observer,Conjunto) => {
  return db
    .collection("conjuntos")
    .doc(Conjunto)
    .collection("areascomunales")
  
    .onSnapshot(observer);
};
export const getAllReservas = (observer, conjuntoUid, cuentaUid) => {
  return db
  .collection("conjuntos")
  .doc(conjuntoUid)
  .collection("areascomunales")
  .doc(cuentaUid)
  .collection("reservaciones")
  
  .onSnapshot(observer);
};

export const get_info = (observer) => {
  try {
  return db.collection("usuarios").onSnapshot(observer);
  }catch (error) {
      console.log('One failed:', error.message);
  }
};
export const getAllIngresos = (conjuntoUid, observer) => {
  return db.collection('conjuntos').doc(conjuntoUid).collection('ingresos').onSnapshot(observer);
}

export const getAreasByConjunto = (conjuntoID, observer) => {
  return db
      .collection("conjuntos")
      .doc(conjuntoID)
      .collection("areascomunales")
      .orderBy('Habilitado', 'desc')
      .onSnapshot(observer);
};
export const getAreaById = (conjuntoID, areaID, observer) => {
  return db
      .collection("conjuntos")
      .doc(conjuntoID)
      .collection("areascomunales")
      .doc(areaID)
      .onSnapshot(observer);
};

export const getUserByConjunto = (conjuntoID, observer) => {
  return db
      .collection("usuarios")
      .where('ConjuntoUidResidencia', '==', conjuntoID)
      .onSnapshot(observer);
};
export const getUserByMail = (mail, observer) => {
  return db
      .collection("usuarios")
      .where('Correo', '==', mail)
      .onSnapshot(observer);
};

export const getHoras = (conjuntoID, idarea, observer) => {
  return db
    .collection('conjuntos')
    .doc(conjuntoID)
    .collection('areascomunales')
    .doc(idarea)
    .collection('reservaciones')
    .onSnapshot(observer);
};
export const newresv = (conjuntoID, idArea, reserva) => {
  return db
      .collection('conjuntos')
      .doc(conjuntoID)
      .collection('areascomunales')
      .doc(idArea)
      .collection('reservaciones')
      .add(reserva);
};
export const updateresv = (conjuntoID, idArea, idDoc, reserva) => {
  return db
      .collection('conjuntos')
      .doc(conjuntoID)
      .collection('areascomunales')
      .doc(idArea)
      .collection('reservaciones')
      .doc(idDoc)
      .update(reserva);
};

 
export const getIngresos = (observer, conjuntoUid, cuentaUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("ingresos").where("CuentaUid", "==", cuentaUid).onSnapshot(observer);
};


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