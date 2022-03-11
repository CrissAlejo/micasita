import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../../Firebase";

const db = firebase.firestore();

export const updateHabilitado = (threadKey, userName, documentoId) => {
  return db
    .collection("conjuntos")
    .doc(threadKey)
    .collection("areascomunales")
    .doc(documentoId)
    .update({
      Habilitado: !userName.data().Habilitado,
    });
};

export const getAreasByConjunto = (threadKey, observer) => {
  return db
    .collection("conjuntos")
    .doc(threadKey)
    .collection("areascomunales")
    .onSnapshot(observer);
};

export const deleteAreaById = (threadKey, userName) => {
  return db
    .collection("conjuntos")
    .doc(threadKey)
    .collection("areascomunales")
    .doc(userName)
    .delete();
};

export const newArea = (threadKey, userName) => {
  let hb = userName.Habilitado ? true : false;
  let mr = userName.MultiReserva ? true : false;
  let cp = userName.ConvenioPago ? true : false;

  return db
    .collection("conjuntos")
    .doc(threadKey)
    .collection("areascomunales")
    .doc()
    .set({
      Nombre: userName.Nombre,
      Imagen: userName.Imagen,
      HorasUso: userName.HorasUso,
      HoraInicio: userName.HoraInicio,
      HoraFin: userName.HoraFin,
      Garantia: userName.Garantia,
      Aforo: userName.Aforo,
      ReservaxUsuario: userName.ReservaxUsuario,
      DiasAnticipacion: userName.DiasAnticipacion,
      Periodo: userName.Periodo,
      TerminosCond: userName.TerminosCond,
      Habilitado: hb,
      DiasHabiles: userName.DiasHabiles,
      MultiReserva: mr,
      ConvenioPago: cp,
    });
};

export const updateArea = (threadKey, userName, documentoId) => {
  let hb = userName.Habilitado ? true : false;
  let mr = userName.MultiReserva ? true : false;
  let cp = userName.ConvenioPago ? true : false;
  return db
    .collection("conjuntos")
    .doc(threadKey)
    .collection("areascomunales")
    .doc(documentoId)
    .update({
      Nombre: userName.Nombre,
      Imagen: userName.Imagen,
      HorasUso: userName.HorasUso,
      HoraInicio: userName.HoraInicio,
      HoraFin: userName.HoraFin,
      Garantia: userName.Garantia,
      Aforo: userName.Aforo,
      ReservaxUsuario: userName.ReservaxUsuario,
      DiasAnticipacion: userName.DiasAnticipacion,
      Periodo: userName.Periodo,
      TerminosCond: userName.TerminosCond,
      Habilitado: hb,
      DiasHabiles: userName.DiasHabiles,
      MultiReserva: mr,
      ConvenioPago: cp,
    });
};

export const uploadImage = async (Imagen, name) => {
  const file = Imagen;
  const storageRef = firebase.storage().ref(`/fotoareas/${name}`);
  storageRef.put(file);
  const url = await storageRef.getDownloadURL().then((usm) => {
    return usm;
  });
  return url;
};
