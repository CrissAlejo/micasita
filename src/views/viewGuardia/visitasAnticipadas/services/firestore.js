import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";


const db = firebase.firestore();


export const getVisitasAnticipadas = (observer, conjuntoID) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("visitasAnticipadas")
    .where("HoraEstimadaLlegada",">=",new Date(new Date().setHours(0,0,0,0)))
    .where("HoraEstimadaLlegada","<=",new Date(new Date().setHours(24,0,0,0)))
    .onSnapshot(observer);
};

