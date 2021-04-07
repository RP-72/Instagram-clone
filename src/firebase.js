
import firebase from 'firebase'
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDXuyM2jLEF5l-hCRctYxOdIZP-HkFWoBo",
    authDomain: "instagram-clone-72.firebaseapp.com",
    databaseURL: "https://instagram-clone-72-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-72",
    storageBucket: "instagram-clone-72.appspot.com",
    messagingSenderId: "644428835100",
    appId: "1:644428835100:web:47d6c053a00636763772d9",
    measurementId: "G-LFTRJ78LGW"
})
const db = firebaseApp.firestore();
const auth =  firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};