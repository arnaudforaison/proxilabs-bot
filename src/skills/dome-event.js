
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

    this.getNextDomeEvent = function() {
        return undefined;
    }

    this.formatMessage7DaysBeforeEvent = function(domeEvent) {
        var message = {
            text: 'OMG look at this thing',
            channel: '#general'
        };

        return message;
    }

    this.resetReminders = function() {
        this.reminders = [
            new Reminder(spi, 7 * dayMs, "notified7daysBefore", this.formatMessage7DaysBeforeEvent)
        ];
    }

    this.resetReminders();
}

module.exports = DomeEventService;