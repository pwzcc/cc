var DB = DB || {}




var config = {
    apiKey: "AIzaSyCOBQOiCrpBJ0U1ZNC5FCs97csRMHqyTDc",
    authDomain: "coc-pwz.firebaseapp.com",
    databaseURL: "https://coc-pwz.firebaseio.com",
    projectId: "coc-pwz",
    storageBucket: "coc-pwz.appspot.com",
    messagingSenderId: "8411413586",
    appId: "1:8411413586:web:deabc5e5bf63091568738b"
  };



var firebaseApp = firebase.initializeApp(config);
var db = firebaseApp.database()

// Initialize Firebase




DB.syncData = function(data,path,cb){
    db.ref(path).set(data).then(() => {

        if(cb)
        cb()
    });
}

DB.getData = function(path,cb){
    db.ref(path).once('value').then(function(snapshot) {
        if(cb)
        cb(snapshot.val())
    });
}

