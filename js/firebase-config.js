// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnD4g7ep8-4pNOYjNFWOqoi6-vfjctjTA",
  authDomain: "podsluhano18school.firebaseapp.com",
  databaseURL: "https://podsluhano18school-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "podsluhano18school",
  storageBucket: "podsluhano18school.firebasestorage.app",
  messagingSenderId: "378677284237",
  appId: "1:378677284237:web:d27dd65ebfed84f0e001c4",
  measurementId: "G-126YV6E98N"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();
