var Botkit = require('botkit');
var Spi = require('./skills-spi');
var BudgetService = require('./skills/budget.js');

/*var initialDaysRef = ref.child('initialDays');
initialDaysRef.set(100);*/

var controller = Botkit.slackbot({
  interactive_replies: true
});

var bot = controller.spawn({
  token: process.env.SLACK_BOT_TOKEN
}).startRTM();

var spi = new Spi();

var message_events = ['direct_message', 'direct_mention'];

var budgetService = new BudgetService(spi);

controller.hears(['budget initial'], message_events, budgetService.donnerBudgetInitial);

controller.hears(['code projet'], message_events, budgetService.rappelerCodeProjet);

controller.hears(['(.*)\s*(jours|jour|j)', 'nouveau budget'], message_events, budgetService.initialiserBudget);