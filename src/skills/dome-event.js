var DomeEventService = function(spi) {
    this.getNextDomeEvent = function() {
        return undefined;
    }

    this.yieldNextDomeEvent = function() {
        var nextDomeEvent = this.getNextDomeEvent();
        spi.bot.say({
            text: 'OMG look at this thing',
            channel: '#general'
        });
    }
}

module.exports = DomeEventService;