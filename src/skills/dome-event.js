var moment = require('moment');

var Reminder = function(spi, anticipationDelayMs, alreadyNotifiedAttributeName, messageFormat) {
    
    this.mustDisplayEvent = function(nextDomeEvent) {
        var scheduledEventDate = nextDomeEvent.date.getTime();
        var now = spi.calendar.now().getTime();
        var currentDelay = scheduledEventDate - now;
        return currentDelay >= 0
            && currentDelay <= anticipationDelayMs
            && !(nextDomeEvent[alreadyNotifiedAttributeName]);
    }

    this.formatMessageForEvent = messageFormat;
}

var DomeEventService = function(spi) {
    var dayMs = 24 * 60 * 60 * 1000;

    this.reminders = [];

    this.getNextDomeEvent = function() {
        return {
            date: new Date(2017, 9, 9),
            title: 'Présentation du ProxiBot',
            author: 'Jane Done'
        };
    }

    this.yieldNextDomeEvent = function() {
        var anticipationDelayMs = 7 * dayMs;
        var nextDomeEvent = this.getNextDomeEvent();
        if (nextDomeEvent) {
            for (var i in this.reminders) {
                var reminder = this.reminders[i];

                if(reminder.mustDisplayEvent(nextDomeEvent)) {
                    var message = reminder.formatMessageForEvent(nextDomeEvent);
                    spi.bot.say(message);    
                }
            }
        }
    }

    this.formatMessage7DaysBeforeEvent = function(domeEvent) {
        var momentedDate = moment(domeEvent.date);
        var dateString = momentedDate.format('DD/MM/YYYY');

        var message = {
            text: `Le prochain Dome Event aura lieu le ${dateString} à 12h30, au CDS.\nIl sera animé par ${domeEvent.author}.\nSujet du jour : ${domeEvent.title}.`,
            channel: '#testbot'
        };

        return message;
    }

    this.resetReminders = function() {
        this.reminders = [
            new Reminder(spi, 7 * dayMs, "notified7daysBefore", this.formatMessage7DaysBeforeEvent)
        ];
    }

    this.listDomeEvents = function (bot, message) {
        
        spi.database('dome-events').once('value').then(function(allEvents) {
            var arr = allEvents.val();
            var txt = '';
            for(var i in arr) {
                var evt = arr[i];
                var date = moment(evt.date).format('DD/MM/YYYY');
                txt += `${evt.id} : ${date} ${evt.author} ${evt.title}\n`;
            }
            bot.reply(message, txt);            
        });
    }

    var endPattern = {
        pattern: 'laisse tomber',
        callback: function (response, convo) {
          convo.say('OK j\'ai annulé ta demande.');
          convo.next();
        }
    };

    this.addDomeEvent = function (bot, message) {
        var eventId = message.match[1] ? message.match[1] : '0';
        
        return bot.startConversation(message, function (err, convo) {
      
          convo.ask(`De quoi parle le dome event ${eventId} ?`, [
            endPattern,
            {
              default: true,
              pattern: '.*',
              callback: function (response, convo) {
                  var subject = response.text;

                  convo.ask('Quand aura lieu ce dome event ?', [
                    endPattern,
                    {
                        default: true,
                        pattern: '.*',
                        callback: function(response, convo) {
                            var eventDate = moment(response.text);

                            convo.ask('Qui animera ce dome event ?', [
                                endPattern,
                                {
                                    default: true,
                                    pattern: '.*',
                                    callback: function(response, convo) {
                                        var author = response.text;
                                        var domeEvent = {
                                            id: eventId,
                                            date: eventDate.toDate(),
                                            title: subject,
                                            author: author
                                        };
                                        spi.database('dome-events').child(eventId).set(domeEvent).then(function () {
                                            convo.say(`Parfait c'est noté pour le dome event ${eventId} !`);
                                            convo.next();
                                          });
    
                                    }                                
                                }]);
                            convo.next();                                        
                        }
                    }]);
                    convo.next();
                }
            }]);  
        });
    }
    
    this.resetReminders();
}

module.exports = DomeEventService;