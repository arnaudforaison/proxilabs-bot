var firebase = require("firebase");

var config = {
  apiKey: process.env.FIREBASE_TOKEN,
  authDomain: process.env.FIREBASE_APP,
  databaseURL: process.env.FIREBASE_STORAGE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};
firebase.initializeApp(config);
firebase.auth().signInAnonymously();

function Spi() {
	
}
Spi.prototype.database = firebase.database().ref('secretary');
module.exports.Spi = Spi;
