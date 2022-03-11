import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../Firebase";

const db = firebase.firestore();


export const newUser = (userName) => {
  return db.collection("usuarios").doc(userName.Correo).set({
    Nombre: userName.Nombre,
    Apellido: userName.Apellido,
    Cedula: userName.Cedula,
    Correo: userName.Correo,
    Telefono: userName.Telefono,
    Alicuota: Number(userName.Alicuota) || 0,
    Casa: userName.Casa || "",
    Rol: userName.Rol,
    Comprobantes: userName.Comprobantes,
    ConjuntoUidResidencia: userName.ConjuntoUidResidencia,
  })
};

export const updateUser = (userName, documentoId) => {
  return db.collection("usuarios").doc(documentoId).update({
    Nombre: userName.Nombre,
    Apellido: userName.Apellido,
    Cedula: userName.Cedula,
    Correo: userName.Correo,
    Telefono: userName.Telefono,
    Alicuota: Number(userName.Alicuota) || 0,
    Casa: userName.Casa,
    Rol: userName.Rol,
  });
};

export const deleteUserbyID = (userName) => {
  return db.collection("usuarios").doc(userName).delete();
}; 

export const getUserByConjunto = (observer, conjuntoID) => {
  return db.collection("usuarios").where('ConjuntoUidResidencia', '==', conjuntoID).onSnapshot(observer);
};

export const getAllusers = (observer) => {
  return db
    .collection("usuarios")
    .onSnapshot(observer);
};

export const getUser = (userId) => { 
  return db.collection("usuarios").doc(userId).get()
};

export const getAllConjuntos = (observer) => {
  return db.collection("conjuntos").onSnapshot(observer);
};


