import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebase from "../../../Firebase";

const db = firebase.firestore();

export const getAllAreas = (threadKey,observer) => {
    return db.collection("conjuntos").doc(threadKey).collection("areascomunales").onSnapshot(observer);
};

export const deleteAreaById = (threadKey,userName) => {
  return db.collection("conjuntos").doc(threadKey).collection("areascomunales").doc(userName).delete();
};

export const newArea = (threadKey, userName, img) => {

  return db.collection("conjuntos").doc(threadKey).collection("areascomunales").doc().set({
    Nombre: userName.Nombre,
    Imagen: img,
    HorasUso: userName.HorasUso,
    HoraInicio: userName.HoraInicio,
    HoraFin: userName.HoraFin,
    Garantia: userName.Garantia,
    Aforo: userName.Aforo,
    ReservaxUsuario: userName.ReservaxUsuario,
    DiasAnticipacion: userName.DiasAnticipacion,
    Periodo: userName.Periodo,
    TerminosCond: userName.TerminosCond,
    Habilitado: userName.habilitado,
    DiasHabiles: userName.DiasHabiles,
    MultiReserva: userName.multiReserva,
  });
};

export const updateArea = (threadKey, userName, documentoId) => {
  return db.collection("conjuntos").doc(threadKey).collection("areascomunales").doc(documentoId).update({
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
    Habilitado: userName.habilitado,
    DiasHabiles: userName.DiasHabiles,
    MultiReserva: userName.multiReserva,
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



