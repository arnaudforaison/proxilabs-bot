var Botkit = require('botkit');
var Spi = require('./skills-spi');
var BudgetService = require('./skills/budget.js');

/*var initialDaysRef = ref.child('initialDays');
initialDaysRef.set(100);*/

var controller = Botkit.slackbot({
  interactive_replies: true,
  debug: false
}).configureSlackApp({
  clientId: process.env.SLACK_BOT_CLIENT_ID,
  clientSecret: process.env.SLACK_BOT_CLIENT_SECRET,
  redirectUri: 'http://1f3f5d7b.ngrok.io/oauth',
  scopes: ['bot', 'incoming-webhook', 'team:read', 'users:read', 'channels:read', 'im:read', 'im:write', 'groups:read', 'emoji:read', 'chat:write:bot']
});

var bot = controller.spawn({
  token: process.env.SLACK_BOT_TOKEN
}).startRTM();

// Initialisation slash command
bot.api.team.info({}, function (err, res) {
  if (err) {
    return console.error(err)
  }
  controller.storage.teams.save({ id: res.team.id }, (err) => {
    if (err) {
      console.error(err)
    }
  })
});

controller.setupWebserver('9090', function (err, webserver) {
  controller.createOauthEndpoints(controller.webserver, function(err, req, res){
    console.log('createOauthEndpoints', err, req, res);
  })
    .createWebhookEndpoints(controller.webserver, controller.token);
});

var spi = new Spi();

var message_events = ['direct_message', 'direct_mention'];

var budgetService = new BudgetService(spi);

controller.hears(['budget initial'], message_events, budgetService.donnerBudgetInitial);

controller.hears(['code projet'], message_events, budgetService.rappelerCodeProjet);

controller.hears(['(.*)\s*(jours|jour|j)', 'nouveau budget'], message_events, budgetService.initialiserBudget);

controller.on('slash_command', function (bot, message) {
  switch (message.command) {
    case '/consommation':
      budgetService.enregistrerConsommation(controller, bot, message);
      break;

    default:
      bot.replyPublic(message, `Je vous ai compris !!!`);
      break;
  }
});

controller.on('dialog_submission', function(bot, message) {
  //bot.reply(message, 'debrouille toi');
  bot.dialogOk();
});
