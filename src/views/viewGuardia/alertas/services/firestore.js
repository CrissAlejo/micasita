import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();

//adminconjuntos


export const getImagen = (id, observer) => {
  return db
    .collection('conjuntos')
    .doc(id)
    .onSnapshot(observer)
}

export const getNumero = (id,observer) => {
  return db
    .collection("usuarios")

    .where("ConjuntoUidResidencia", "==", id)

    .onSnapshot(observer);
}

export const getAlertas = (observer,conjuntoUid) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoUid)
    .collection("panico")
    .where("Estado","==",1)
    .orderBy("Fecha", "desc")
    .onSnapshot(observer);
};
export const getAlertasAll = (observer,conjuntoUid) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoUid)
    .collection("panico")
    .orderBy("Estado",'desc')
    .orderBy("Fecha", "desc")
    .onSnapshot(observer);
};
export const updateestado = (idconjuntos,  form) => {
  let batch = db.batch()
  for (const e of form) {
    let id = JSON.parse(e).id
    const docRef = db.collection("conjuntos").doc(idconjuntos).collection("panico").doc(id)
    batch.update(docRef, {Estado: 0});
  }
  return batch.commit();
};
export const deleteAlerta = (idconjuntos,  form) => {
  let batch = db.batch();
  for (const e of form) {
    let id = JSON.parse(e).id
    const docRef = db.collection("conjuntos").doc(idconjuntos).collection("panico").doc(id)
    batch.delete(docRef);
  }
  return batch.commit();
};
//

