import firebase from "../../../../Firebase";

const db = firebase.firestore();

export const getEventos = (idConjunto) => {
    return db
      .collection('conjuntos')
      .doc(idConjunto)
      .collection('guardiaEventos')
      .orderBy('Fecha', 'desc')
      .get();
};
export const getUsuario = (usuarioId) => {
  return db.collection("usuarios").doc(usuarioId).get()
};