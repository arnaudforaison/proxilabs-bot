var Botkit = require('botkit');
var Spi = require('./skills-spi');
var BudgetService = require('./skills/budget.js');

/*var initialDaysRef = ref.child('initialDays');
initialDaysRef.set(100);*/

var controller = Botkit.slackbot({
  interactive_replies: true,
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  scopes: ['incoming-webhook','team:read','users:read','channels:read','im:read','im:write','groups:read','emoji:read','chat:write:bot']
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
  controller.createOauthEndpoints(controller.webserver);
  controller.createWebhookEndpoints(controller.webserver);
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
    var dialog = bot.createDialog(
      'Title of dialog',
      'callback_id',
      'Button Label'
    );
    console.log('dialog created : ',dialog.asObject());

      bot.replyWithDialog(message, dialog.asObject(), function (err, resp) {
        console.log('Error: ', err);
        console.log('Resp: ', resp);
      });
      break;

    default:
      bot.replyPublic(message, `Je vous ai compris !!!`);
      break;
  }
});