import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();

export const updateIngreso = (conjuntoID,ingresoId,data) => {
  return db.collection("conjuntos").doc(conjuntoID).collection("ingresos").doc(ingresoId).update({
    Usuario: data.Usuario
  })
}

export const getIngresosNoAsignados = (observer, conjuntoUid) => {
  return db.collection("conjuntos").doc(conjuntoUid).collection("ingresos").where("Usuario", "==", "Sin usuario").onSnapshot(observer);
};

export const getUsuariosByConjunto = (observer, conjuntoUid) => {
  return db.collection("usuarios").where("ConjuntoUidResidencia","==",conjuntoUid).onSnapshot(observer);
};

