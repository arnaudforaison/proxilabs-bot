var firebase = require('firebase');
var dotenv = require('dotenv');
dotenv.load();

var config = {
  apiKey: process.env.FIREBASE_TOKEN,
  authDomain: process.env.FIREBASE_APP,
  databaseURL: process.env.FIREBASE_STORAGE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};
firebase.initializeApp(config);
firebase.auth().signInAnonymously();

var Spi = function (bot) { 
  this.database = firebase.database().ref('secretary');
  this.bot = bot;
};

module.exports = Spi;
