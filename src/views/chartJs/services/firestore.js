import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../Firebase";

const db = firebase.firestore();

export const getFecha = (date) => {
  return firebase.firestore.Timestamp.fromDate(date);
};

export const getTotInEgAll = async (conjuntoUid) => {
  return {
    totalEg: await db
      .collection("conjuntos")
      .doc(conjuntoUid)
      .collection("egresos")
      .get()
      .then((res) => {
        var totalEg = 0;
        res.forEach((element) => {
          totalEg += element.data().Valor * 1;
        });
        return totalEg;
      }),
    totalIn: await db
      .collection("conjuntos")
      .doc(conjuntoUid)
      .collection("ingresos")
      .get()
      .then((res) => {
        var totalIn = 0;
        res.forEach((element) => {
          totalIn += element.data().Valor * 1;
        });
        return totalIn;
      }),
  };
};

export const getTotInEg = async (conjuntoUid, mes) => {
  var date = new Date();
  var inicMes = getFecha(new Date(date.getFullYear(), mes, 1));
  var finMes = getFecha(new Date(date.getFullYear(), mes + 1, 0));
  return {
    totalEg: await db
      .collection("conjuntos")
      .doc(conjuntoUid)
      .collection("egresos")
      .where("Fecha", ">=", inicMes)
      .where("Fecha", "<=", finMes)
      .get()
      .then((res) => {
        res.docs.map((doc) => ({
          id: doc.id,
          Rubro: doc.data().Rubro,
          Descripcion: doc.data().Descripcion,
          Valor: doc.data().Valor,
          Fecha: doc
            .data()
            .Fecha.toDate()
            .toDateString(),
        }));
        var totalEg = 0;
        res.forEach((element) => {
          totalEg += element.data().Valor * 1;
        });
        return totalEg;
      }),

    totalIn: await db
      .collection("conjuntos")
      .doc(conjuntoUid)
      .collection("ingresos")
      .where("Fecha", ">=", inicMes)
      .where("Fecha", "<=", finMes)
      .get()
      .then((res) => {
        res.docs.map((doc) => ({
          id: doc.id,
          Rubro: doc.data().Rubro,
          Descripcion: doc.data().Descripcion,
          Valor: doc.data().Valor,
          Fecha: doc
            .data()
            .Fecha.toDate()
            .toDateString(),
        }));
        var totalIn = 0;
        res.forEach((element) => {
          totalIn += element.data().Valor * 1;
        });
        return totalIn;
      }),
    // .where((Fecha.toDate().toDateString()).split(" ")[2] == "Jul")
    // totalEg: await db.collection("conjuntos").doc(conjuntoUid).collection("egresos").get().then((res) => {
    //   var Fecha = res.Fecha.toDate().toDateString();
    //   var totalEg = 0;
    //   res.forEach(element => {

    //     totalEg += element.data().Valor * 1;
    //   });
    //   return totalEg;
    // })
  };
};

//endconjuntos
