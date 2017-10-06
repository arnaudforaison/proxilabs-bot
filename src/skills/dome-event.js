var DomeEventService = function(spi) {

    this.yieldNextDomeEvent = function() {
        var nextDomeEvent = this.getNextDomeEvent();
        var message = this.formatMessageForEvent(nextDomeEvent);
        spi.bot.say(message);
    }

    this.getNextDomeEvent = function() {
        return undefined;
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