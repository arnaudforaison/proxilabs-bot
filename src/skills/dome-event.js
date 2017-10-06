var DomeEventService = function(spi) {
    var dayMs = 24 * 60 * 60 * 1000;
    
    this.yieldNextDomeEvent = function() {
        var nextDomeEvent = this.getNextDomeEvent();
        if (nextDomeEvent && this.mustDisplayEvent(nextDomeEvent)) {
            var message = this.formatMessageForEvent(nextDomeEvent);
            spi.bot.say(message);    
        }
    }

    this.getNextDomeEvent = function() {
        return undefined;
    }

    this.mustDisplayEvent = function(nextDomeEvent) {
        var scheduledEventDate = nextDomeEvent.date.getTime();
        var now = spi.calendar.now().getTime();
        var currentDelay = scheduledEventDate - now;
        var anticipationDelayMs = 7 * dayMs;
        return currentDelay >= 0
            && currentDelay <= anticipationDelayMs
            && !(nextDomeEvent.notified7daysBefore);
    }

    this.formatMessageForEvent = function(domeEvent) {
        var message = {
            text: 'OMG look at this thing',
            channel: '#general'
        };

        return message;
    }
}

module.exports = DomeEventService;