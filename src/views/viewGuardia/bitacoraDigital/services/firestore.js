import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";



const db = firebase.firestore();



export const nuevaEntradaBitacora = (idconjunto, fecha,form) => {
  console.log("entro")
  return db
    .collection("conjuntos")
    .doc(idconjunto)
    .collection("bitacoraDigital")
    .doc()
    .set({
      Nombre: form.Nombre,
      Apellido: form.Apellido,
      Cedula: form.Cedula,
      DestinoId: form.DestinoId,
      CasaDestino: form.CasaDestino,
      NombreDestino: form.NombreDestino,
      ApellidoDestino: form.ApellidoDestino,
      EstadoSalida: false,
      HoraEstimadaLlegada: fecha,
      PlacaVehiculo: form.PlacaVehiculo,
      ColorVehiculo: form.ColorVehiculo,
      TipoVisita: form.TipoVisita,
      TiempoEstimadoSalida: form.TiempoEstimadoSalida,
      ImagenCedula: form.ImagenCedula,
      ImagenRostro: form.ImagenRostro,
      ImagenVehiculo: form.ImagenVehiculo
    });
};

export const actualizarSalidaBitacora = (idconjunto, registro) => {
  return db
    .collection("conjuntos")
    .doc(idconjunto)
    .collection("bitacoraDigital")
    .doc(registro)
    .update({
      EstadoSalida: true,
      FechaSalida: new Date(),
    });
};

export const getEntradasBitacora = (observer, conjuntoID) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("bitacoraDigital")
    .where("EstadoSalida","==",false)
    
.orderBy("HoraEstimadaLlegada", "desc")
    .onSnapshot(observer);
};

export const getDatosCamaras = (conjuntoID) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("camaras")
    .doc("camarasRegistroEntradas")
    .get()
};


export const getBitacora = (observer, conjuntoID) => {
  return db
    .collection("conjuntos")
    .doc(conjuntoID)
    .collection("bitacoraDigital")
   
.orderBy("HoraEstimadaLlegada", "desc")
    .onSnapshot(observer);
};

export const getUsuariosByConjunto = (observer, conjuntoID) => {
  return db.collection("usuarios").where('ConjuntoUidResidencia', '==', conjuntoID).onSnapshot(observer);
};

export const getVisitaAnticipada = (observer,conjuntoID,Cedula) => {
  var horamas = new Date(new Date().setHours(new Date().getHours()+2))
  var horamenos = new Date(new Date().setHours(new Date().getHours()-2))
  return db.collection("conjuntos").doc(conjuntoID).collection("visitasAnticipadas")
  .where('Cedula', '==', Cedula)
  .where('HoraEstimadaLlegada', '<=',horamas)
  .where('HoraEstimadaLlegada', '>=',horamenos)
  .onSnapshot(observer);
};

export const getUser = (usuario) => {
  return db.collection("usuarios").doc(usuario).get();
};


