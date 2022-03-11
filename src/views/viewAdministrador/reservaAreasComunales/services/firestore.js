import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();

export const getAreasByConjunto = (conjuntoID, observer) => {
    return db
        .collection("conjuntos")
        .doc(conjuntoID)
        .collection("areascomunales")
        .orderBy('Habilitado', 'desc')
        .onSnapshot(observer);
};
export const updateHabilitado = (conjuntoID, areaID, estado) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("areascomunales")
    .doc(areaID)
    .update({
      Habilitado: estado ,
    });
};
export const getAreaComu = (conjuntoID, observer) => {
  return db
      .collection("conjuntos")
      .doc(conjuntoID)
      .collection("areascomunales")
      .orderBy('Habilitado', 'desc')
      .onSnapshot(observer);
};

export const getAllIngresos = (conjuntoUid, observer) => {
    return db.collection('conjuntos').doc(conjuntoUid).collection('ingresos').onSnapshot(observer);
  }
  export const getIngresos = (observer, conjuntoUid, cuentaUid) => {
    return db.collection("conjuntos").doc(conjuntoUid).collection("ingresos").where("CuentaUid", "==", cuentaUid).onSnapshot(observer);
  };
  
export const getAreaById = (conjuntoID, areaID, observer) => {
    return db
        .collection("conjuntos")
        .doc(conjuntoID)
        .collection("areascomunales")
        .doc(areaID)
        .onSnapshot(observer);
};

export const deleteAreaById = (threadKey, userName) => {
  return db
    .collection("conjuntos")
    .doc(threadKey)
    .collection("areascomunales")
    .doc(userName)
    .delete();
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
      .orderBy('time', 'desc')
      .onSnapshot(observer);
  };


  export const getHoras1 = (conjuntoID, idarea, observer) => {
    return db
      .collection('conjuntos')
      .doc(conjuntoID)
      .collection('areascomunales')
      .doc(idarea)
      .collection('reservaciones')
      .onSnapshot(observer);
  };





  export const getAreas1 = (conjuntoID, observer) => {
    return db
      .collection('conjuntos')
      .doc(conjuntoID)
      .collection('areascomunales')
      .doc()
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


export const updateresva = (conjuntoID, idArea, idDoc,datos,aforo) => {
  return db
      .collection('conjuntos')
      .doc(conjuntoID)
      .collection('areascomunales')
      .doc(idArea)
      .collection("reservaciones")
      .doc(idDoc)
      .update({
        aforo: aforo,
        usuario: datos,
      });
};

export const deleteresva = (conjuntoID, idArea, idDoc) => {
  return db.collection('conjuntos')
  .doc(conjuntoID).collection("areascomunales").doc(idArea).collection("reservaciones")
  .doc(idDoc).delete();
};

  export const getAllReservas = (observer, conjuntoUid, cuentaUid) => {
    return db
    .collection("conjuntos")
    .doc(conjuntoUid)
    .collection("areascomunales")
    .doc(cuentaUid)
    .collection("reservaciones")
    .orderBy("time", "asc")
    .onSnapshot(observer);
  };
  

  export const getElimReservas = (observer, conjuntoUid, cuentaUid) => {
    return db
    .collection("conjuntos")
    .doc(conjuntoUid)
    .collection("areascomunales")
    .doc(cuentaUid)
    .collection("reservaciones")
    .onSnapshot(observer);
  };


 



export const getCuentabyConjunto = (observer,Conjunto) => {
    return db
      .collection("conjuntos")
      .doc(Conjunto)
      .collection("areascomunales")
    
      .onSnapshot(observer);
  };
    