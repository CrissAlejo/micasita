import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();

export const getUserByConjunto = (observer, conjuntoID) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("proveedores")
    .onSnapshot(observer);
};

export const getPedidos = (observer, conjuntoID, proveedorId) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("proveedores")
    .doc(proveedorId)
    .collection("pedido")
    .onSnapshot(observer);
};
export const getCuentasPagar = (idConjunto) => {
  let data=[];
  let fecha = new Date()
  fecha = new Date(fecha.getFullYear(),fecha.getMonth()+1, fecha.getDate());
  db
    .collection('conjuntos')
    .doc(idConjunto)
    .collection('cuentasPagar')
    .where('Plazo', '<=', fecha)
    .orderBy('Plazo', 'desc')
    .limit(5)
    .get().then(res => {
      data = res.docs.forEach( doc => {
        data.push({
          Proveedor: doc.data().ProveedorNombre,
          Articulo: doc.data().Nombre,
          Costo: doc.data().Costo
        })
      })
    });
    return data;
}

export const getReportes = (idConjunto) => {
  let data = [];
  db
    .collection('conjuntos')
    .doc(idConjunto)
    .collection('issuesReport')
    .where('Estado', '==', 1)
    .limit(5)
    .get().then( res => {
      res.docs.forEach( snap => {
        data.push({
          Usuario: snap.data().DetalleUsuario,
          Observaciones: snap.data().Observaciones,
        })
      })
    })
    return data;
}
export const getTransfPendientes = (idConjunto) => {
  let data = [];
  let cuentasRef = db.collection('conjuntos').doc(idConjunto).collection('cuentas');

  cuentasRef.get().then((res) =>{
    if(res.empty) return data;
    res.docs.every( cuenta => {
      if(data.length == 5) return false;
      cuentasRef.doc(cuenta.id)
        .collection('transferencias')
        .where('Estado', '==', 'Pendiente')
        .get().then( transf => {
          if(transf.empty) return true;
          transf.forEach(doc => {
            let Deudas = [...doc.data().Deuda].length;
            data.push({
              Valor: doc.data().Valor,
              Detalle: doc.data().Detalle,
              Deudas,
            })
          })
        })
      return true;
    })
  })
  .catch((error) => {
    console.log("Error getting documents: ", error);
  });
  return data;
}
