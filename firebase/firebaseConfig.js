const firebaseConfig = {
    apiKey: "AIzaSyAcL_a8tS4bvMXFAr6oHJcWHkyjVFiYzb4",
    authDomain: "nwen304-groupproject-9db15.firebaseapp.com",
    databaseURL: "https://nwen304-groupproject-9db15-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nwen304-groupproject-9db15",
    storageBucket: "nwen304-groupproject-9db15.appspot.com",
    messagingSenderId: "780741013383",
    appId: "1:780741013383:web:d216a031f2cccbddc22d22",
    measurementId: "G-TCLDG0Y66G"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  const db = firebase.firestore();