import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB2PCOc8O6HYAL7vYCcxpfV8ui2LVbxGrE",
    authDomain: "cse-316-final-project.firebaseapp.com",
    databaseURL: "https://cse-316-final-project.firebaseio.com",
    projectId: "cse-316-final-project",
    storageBucket: "cse-316-final-project.appspot.com",
    messagingSenderId: "962383110164",
    appId: "1:962383110164:web:5a2b415110b55379180701",
    measurementId: "G-DX8YW7TZ7D"
  };
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;