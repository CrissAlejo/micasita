import firebase from "../../../../Firebase";

const db = firebase.firestore();

export const getReportes = (idConjunto, observer) => {
    return db
      .collection('conjuntos')
      .doc(idConjunto)
      .collection('issuesReport')
      .orderBy('Fecha', 'desc')
      .onSnapshot(observer);
};



export const getAlertareporte = (idConjunto, observer) => {
  return db
    .collection('conjuntos')
    .doc(idConjunto)
    .collection('issuesReport')
    .where('Estado', '>', 0)
    .onSnapshot(observer);
};


export const updateReporte = (idConjunto, id) =>{
  return db
    .collection('conjuntos')
    .doc(idConjunto)
    .collection('issuesReport')
    .doc(id)
    .update({'Estado': 0})
}
export const deleteReporte = (idConjunto, id) => {
  return db
    .collection('conjuntos')
    .doc(idConjunto)
    .collection('issuesReport')
    .doc(id)
    .delete()
}