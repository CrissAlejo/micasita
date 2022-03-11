import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../Firebase";

const db = firebase.firestore();



export const getUsuariosMorosos = (conjuntoUid) => {
  var fechaHoy = new Date();
  return db.collection("conjuntos").doc(conjuntoUid).collection("cuentasPorCobrar").where("FechaLimite", "<=", fechaHoy).get();
};


export const getTotInEg = async (conjuntoUid) => {
  return {
    totalEg: await db.collection("conjuntos").doc(conjuntoUid).collection("egresos").get().then((res) => {
        var totalEg = 0; 
        res.forEach(element => {
          totalEg+=element.data().Valor*1;
        });
        return totalEg;
      }),
    totalIn: await db.collection("conjuntos").doc(conjuntoUid).collection("ingresos").get().then((res) => {
        var totalIn = 0; 
        res.forEach(element => {
          totalIn+=element.data().Valor*1;
        });
        return totalIn;
      }),   
  }  
};

