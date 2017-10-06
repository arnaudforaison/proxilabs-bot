
var BudgetService = function (spi) {
  this.callback = 'enregistrerConsommation_callback_id';
  this.donnerBudgetInitial = function (bot, message) {
    spi.database.child('initialDays').once('value').then(function (days) {
      var response = `ProxiLabs Nord possède initalement ${days.val()} jours`;
      return bot.reply(message, response);
    }).catch(function (error) {
      var response = `Désolé, il semblerait que je n'arrive pas a échanger avec ma mémoire (${error.message})`;
      return bot.reply(message, response);
    });
  }

  this.initialiserBudget = function (bot, message) {
    var days = message.match[1] ? +(message.match[1].match(/\d+/g)) : 0;

    return bot.startConversation(message, function (err, convo) {

      convo.ask(`Est ce que vous voulez mettre à jour le budget initial de ProxiLabs a ${days} jours, pour cette année ?`, [
        {
          pattern: '(oui|ouai|yes|si)',
          callback: function (response, convo) {
            spi.database.child('initialDays').set(days).then(function () {
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
  }

  this.rappelerCodeProjet = function (bot, message) {
    bot.reply(message, "Proxilabs-affaire 1700643");
  }

  this.enregistrerConsommation = function (controller, bot, message) {
    var dialog = bot.createDialog(
      'Ajouter un consommé',
      this.callback,
      'Ok'
    ).addText('Tâche', 'tache', undefined, { placeholder: 'libellé du sujet' })
      .addText('Date', 'date', undefined, { placeholder: 'la date au format "YYYY-MM-JJ"' })
      .addNumber('Total des jours', 'jours', undefined, {placeholder: 'le total des jours pour tous les participants'})
      .addText('Liste des participants', 'participants', undefined, {placeholder: 'les participants séparés par des virgules'});

    var messageInteraction = {
      'dialog': JSON.stringify(dialog.asObject()),
      'trigger_id': message.trigger_id,
      'token': process.env.SLACK_BOT_TOKEN
    };
    controller.middleware.send.run(bot, messageInteraction, function(err, bot, msg){
      bot.api.dialog.open(msg);
    });
    //bot.replyPublic(message, 'A toi de jouer!');
  }
}

module.exports = BudgetService;