
var firebaseConfig = {
    apiKey: "AIzaSyCwCT-_8Y7rdF7piANHc6QpNgGrXpugCbE",
    authDomain: "proyeccion-social-9defa.firebaseapp.com",
    projectId: "proyeccion-social-9defa",
    storageBucket: "proyeccion-social-9defa.appspot.com",
    messagingSenderId: "1019345334328",
    appId: "1:1019345334328:web:d4c95946de4eb18ed0b6cd",
    measurementId: "G-H2MY3PN9SH"
  };

  firebase.initializeApp(firebaseConfig);

  var db = firebase.firestore()

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //var uid = user.uid;
      localStorage.setItem("session",true)
    } else {
      localStorage.setItem("currentUser","")
      localStorage.setItem("session",false)
    }
  });