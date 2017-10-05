var Botkit = require('botkit');
var dotenv = require('dotenv');
var firebase = require("firebase");

dotenv.load();

var config = {
  apiKey: process.env.FIREBASE_TOKEN,
  authDomain: process.env.FIREBASE_APP,
  databaseURL: process.env.FIREBASE_STORAGE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};
firebase.initializeApp(config);
firebase.auth().signInAnonymously();

var ref = firebase.database().ref('secretary');
/*var initialDaysRef = ref.child('initialDays');
initialDaysRef.set(100);*/

var controller = Botkit.slackbot({
  interactive_replies: true
});

var bot = controller.spawn({
  token: process.env.SLACK_BOT_TOKEN
}).startRTM();

controller.hears(['budget initial'], ['direct_message', 'direct_mention'], function (bot, message) {
  ref.child('initialDays').once('value').then(function (days) {
    var response = `ProxiLabs Nord possède initalement ${days.val()} jours`;
    return bot.reply(message, response);
  }).catch(function (error) {
    var response = `Désolé, il semblerait que je n'arrive pas a échanger avec ma mémoire (${error.message})`;
    return bot.reply(message, response);
  });
});

function rappelerCodeProjet(bot, message) {
  bot.reply(message, "Proxilabs-affaire 1700643");
}
rappelerCodeProjet.prototype.pattern = ['code projet'];
rappelerCodeProjet.prototype.channels = ['direct_message', 'direct_mention'];

function register(controlleur, comportement){
  var toto = comportement.prototype;
  controller.hears(toto.pattern, toto.channels, comportement);    
}

register(controller, rappelerCodeProjet);

controller.hears(['(.*)\s*(jours|jour|j)', 'nouveau budget'], ['direct_message', 'direct_mention'], function (bot, message) {
  var days = message.match[1] ? +(message.match[1].match(/\d+/g)) : 0;

  return bot.startConversation(message, function (err, convo) {

    convo.ask(`Est ce que vous voulez mettre à jour le budget initial de ProxiLabs a ${days} jours, pour cette année ?`, [
      {
        pattern: '(oui|ouai|yes|si)',
        callback: function (response, convo) {
          ref.child('initialDays').set(days).then(function () {
            convo.say(`Parfait j'ai mis à jour le budget!`);
            convo.next();
          });
        }
      },
      {
        pattern: bot.utterances.no,
        default: true,
        callback: function (response, convo) {
          convo.say(`Ok j'ai annulé ta demande.`);
          convo.next();
        }
      }
    ]);
  });
});



exports.rappelerCodeProjet = rappelerCodeProjet;