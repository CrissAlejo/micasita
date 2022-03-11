import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();



export const newConjunto = (userName) => {
  return db.collection("splash").add({
    Detalle: userName.Detalle,
    url: userName.Imagen,
   
  });
};

export const getSplash = (observer) => {
  return db.collection("splash").onSnapshot(observer);
};

export const deleteSplashId = (id) => {
  return db.collection("splash").doc(id).delete();
};


