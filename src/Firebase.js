import firebase from "firebase/app";
// import * as firebase from 'firebase/app'
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage"; // <----

let config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORANGE,
};
firebase.initializeApp(config);

export default firebase;