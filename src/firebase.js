import firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyA6Y8D3pRVWYy5AUCBOR8wfXiIj01rwJn4",
  authDomain: "ck-mobiles.firebaseapp.com",
  databaseURL: "https://ck-mobiles.firebaseio.com",
  projectId: "ck-mobiles",
  storageBucket: "ck-mobiles.appspot.com",
  messagingSenderId: "204846129905",
  appId: "1:204846129905:web:935602ab06d2638fdf7f50",
  measurementId: "G-K4KV4XVXSN"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default db;