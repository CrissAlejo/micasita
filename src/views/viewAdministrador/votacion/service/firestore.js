import firebase from "src/Firebase";
const storage = firebase.storage();
const db = firebase.firestore();

export const saveFiles = async (file, conjunto) => {
    // the return value will be a Promise
    try {
        const snapshot = await storage.ref(`${conjunto}/archivosVotaciones/${file.name}`).put(file);
        const url = await snapshot.ref.getDownloadURL();
        return url;
    } catch (error) {
        console.log('One failed:', file, error.message);
    }
}
export const sendVotation = (conjunto, data) => {
    return db.collection('conjuntos').doc(conjunto).collection('votacion').add(data);
}
export const getVotation = (conjunto, observer) => {
    const exp = new Date()
    const ref = db.collection('conjuntos').doc(conjunto).collection('votacion')
    ref.where('Finalizada', '==', false).get().then(snap => {
        snap.docs.map(async(doc) => {
            if(doc.data().Fin.toDate()<= exp){
                await ref.doc(doc.id).update({Finalizada: true})
            }
        })
    })
    return ref.onSnapshot(observer)
}
export const deleteVotation = (conjunto, id) => {
    return db.collection('conjuntos').doc(conjunto).collection('votacion').doc(id).delete();
}
export const getUsuario = (usuarioId) => {
    return db.collection("usuarios").doc(usuarioId).get()
};
export const get_token = (observer) => {
    try {
    return db.collection("usuarios").onSnapshot(observer);
    }catch (error) {
        console.log('One failed:', error.message);
    }
};