import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../Firebase";

const db = firebase.firestore();

export const checkSuperUser = (uid) => {
  return db.collection("usuarios").doc(uid).get();
};
export const loadWithEmail = (correo) => {
  return db.collection("usuarios").doc(correo).get();
};
export const newUserWithDoc = (nuevito) => {
  return db.collection("usuarios").doc(nuevito.UidNum).set({
    Rol: nuevito.Rol,
    Alicuota: nuevito.Alicuota,
    Apellido: nuevito.Apellido,
    Casa: nuevito.Casa,
    Cedula: nuevito.Cedula,
    Correo: nuevito.Correo,
    Nombre: nuevito.Nombre,
    Telefono: nuevito.Telefono,
    ConjuntoUid: nuevito.ConjuntoUid,
    Uid: nuevito.Uid,
  });
};
export const deleteUserbyID = (userName) => {
  return db.collection("usuarios").doc(userName).delete();
};