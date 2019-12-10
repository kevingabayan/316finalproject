import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAajMNNDg8yKrRYN7sm5q4DwHHSTAxKnMg",
    authDomain: "todohw3-7d87e.firebaseapp.com",
    databaseURL: "https://todohw3-7d87e.firebaseio.com",
    projectId: "todohw3-7d87e",
    storageBucket: "todohw3-7d87e.appspot.com",
    messagingSenderId: "582497173541",
    appId: "1:582497173541:web:a2ec47fa501f4aff87ffcc",
    measurementId: "G-3YZ3F913XT"
};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;