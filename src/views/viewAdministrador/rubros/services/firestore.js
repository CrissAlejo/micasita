import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();


export const getRubros = (observer, conjuntoID,Tipo) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("rubros")
    .where("Tipo","==",Tipo)
    .onSnapshot(observer);
};


export const deleteRubro = (idconjunto, idRubro) => {
  return db
    .collection("conjuntos")
    .doc(idconjunto)
    .collection("rubros")
    .doc(idRubro)
    .delete();
};

export const updateRubro = (idconjuntos, idRubro, data) => {
  return db
    .collection("conjuntos")
    .doc(idconjuntos)
    .collection("rubros")
    .doc(idRubro)
    .update({
      SubRubros: data
    });
};


export const createRubros = (conjuntoID, data) => {
  return db.collection("conjuntos").doc(conjuntoID)
  .collection("rubros")
  .doc(data.Nombre)
  .set({
    Nombre: data.Nombre,
    Tipo: data.Tipo,
    SubRubros: data.SubRubros
  })
}
