var Botkit = require('botkit');
var Spi = require('./skills-spi');
var BudgetService = require('./skills/budget.js');

/*var initialDaysRef = ref.child('initialDays');
initialDaysRef.set(100);*/

var controller = Botkit.slackbot({
  interactive_replies: true,
  debug: true
}).configureSlackApp({
  clientId: process.env.SLACK_BOT_CLIENT_ID,
  clientSecret: process.env.SLACK_BOT_CLIENT_SECRET,
  redirectUri: 'http://localhost:9090',
  scopes: ['incoming-webhook', 'team:read', 'users:read', 'channels:read', 'im:read', 'im:write', 'groups:read', 'emoji:read', 'chat:write:bot']
});

var bot = controller.spawn({
  token: process.env.SLACK_BOT_TOKEN
});

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
  controller.createOauthEndpoints(controller.webserver, function (err, req, resp) {
    console.log('Error createOauthEndpoints: ', err);
    console.log('Req createOauthEndpoints: ', req);
    console.log('Resp createOauthEndpoints: ', resp);
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
      var dialog = bot.createDialog(
        'Title of dialog',
        'callback_id',
        'Ok'
      ).addText('Text','text','some text')
      .addSelect('Select','select',null,[{label:'Foo',value:'foo'},{label:'Bar',value:'bar'}],{placeholder: 'Select One'})
      .addTextarea('Textarea','textarea','some longer text',{placeholder: 'Put words here'})
      .addUrl('Website','url','http://botkit.ai');
      var dialogObject = dialog.asObject();
      var messageInteraction = {
        'dialog': JSON.stringify(dialogObject),
        'trigger_id': message.trigger_id,
        'token': process.env.SLACK_BOT_TOKEN
      };
      
      bot.api.dialog.open(messageInteraction);
      
      break;

    default:
      bot.replyPublic(message, `Je vous ai compris !!!`);
      break;
  }
});