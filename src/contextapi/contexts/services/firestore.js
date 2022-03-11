import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../Firebase";

const db = firebase.firestore();
export const getUserById = (observer, conjuntoID) => {
  return db
    .collection("usuarios")
    .doc(conjuntoID)
    .onSnapshot(observer);
};
