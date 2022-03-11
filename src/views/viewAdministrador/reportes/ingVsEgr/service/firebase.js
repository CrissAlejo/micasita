import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../../Firebase";

const db = firebase.firestore();

export const getRubros = (observer, conjuntoUid, tipo) => {
    return db.collection("conjuntos").doc(conjuntoUid).collection("rubros").where("Tipo","==",tipo).onSnapshot(observer);
};

export const getSubRubros = (conjuntoUid,rubroId) => {
    return db.collection("conjuntos").doc(conjuntoUid).collection("rubros").doc(rubroId).get();
};
export const getValoresByRubro = (conjuntoUid, tipo, campo, rubro) => {
    return db.collection("conjuntos").doc(conjuntoUid).collection(tipo).where(campo, '==', rubro).get();
}