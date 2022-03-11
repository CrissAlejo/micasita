import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();

export const getRondas = (idConjunto,observer) => {
    return db
      .collection('conjuntos')
      .doc(idConjunto)
      .collection('guardiaRondas')
      .orderBy('Fecha', 'desc')
      .onSnapshot(observer);
};
export const getUsuario = (usuarioId) => {
  return db.collection("usuarios").doc(usuarioId).get()
};
export const getUsuario1 = (usuario,observer) => {
  return db.collection("usuarios").where("ConjuntoUidResidencia", "==", usuario).onSnapshot(observer);
};
export const getPuntos = (idConjunto, observer) =>{
  return db.collection('conjuntos').doc(idConjunto).collection('guardiaConfig').doc('detallesPuntos').onSnapshot(observer);
}
export const setPuntos = (idConjunto, data) =>{
  console.log(data.points);
  return db.collection('conjuntos').doc(idConjunto).collection('guardiaConfig').doc('detallesPuntos').set({
    registroPuntos: data.points,
  });
}

