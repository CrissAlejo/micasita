import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();

//adminconjuntos

export const getAlertas = (observer,conjuntoUid) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoUid)
    .collection("panico")
    .onSnapshot(observer);
};

//endconjuntos
