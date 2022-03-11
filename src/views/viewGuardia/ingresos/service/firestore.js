import firebase from "../../../../Firebase";

const db = firebase.firestore();

export const getIngresos = (idConjunto) => {
    return db
      .collection('conjuntos')
      .doc(idConjunto)
      .collection('guardiaIngresos')
      .orderBy('Fecha', 'desc')
      .get();
};
export const getUsuario = (usuarioId) => {
  return db.collection("usuarios").doc(usuarioId).get()
};