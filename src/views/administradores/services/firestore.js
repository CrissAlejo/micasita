import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../Firebase";

const db = firebase.firestore();


export const NewAdmin = (userName) => {
  return db.collection("usuarios").doc(userName.Correo).set({
    Nombre: userName.Nombre,
    Apellido: userName.Apellido,
    Cedula: userName.Cedula,
    Correo: userName.Correo,
    Telefono: userName.Telefono,
    Rol: JSON.stringify({'administrador':true}),
    ConjuntoUid: userName.ConjuntoUid, 
  });
};

export const updateAdmin = (userName, documentoId) => {
  return db.collection("usuarios").doc(documentoId).update({
    Nombre: userName.Nombre,
    Apellido: userName.Apellido,
    Cedula: userName.Cedula,
    Correo: userName.Correo,
    Telefono: userName.Telefono,   
    ConjuntoUid: userName.ConjuntoUid, 
  });
};

export const deleteAdminbyID = (userName) => {
  return db.collection("usuarios").doc(userName).delete();
};

export const getAllAdmins = (observer) => {
  return db.collection("usuarios").orderBy('Rol').startAt('{"administrador":true').onSnapshot(observer);
};
export const getAllConjuntos = (observer) => {
  return db.collection("conjuntos").onSnapshot(observer);
};

//endconjuntos
