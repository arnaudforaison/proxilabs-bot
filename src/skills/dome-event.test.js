require('jasmine');
var DomeEventService = require('./dome-event');

describe('DomeEventService', function(){
    describe('yieldNextDomeEvent', function(){
        it('annonce le prochain Dome Event 7 jours à l\'avance', function(){
            var bot = {
                say: function(message) {}
            };
            var spi = {
                bot : bot
            };
            var domeEventService = new DomeEventService(spi);
            var domeEvent = {};
            var formattedMessage = {
                text: 'Le prochain Dome Event aura lieu le xx/xx/xx sur le thème 42.',
                channel: '#general'
            };
            

            spyOn(bot, 'say').and.stub();
            spyOn(domeEventService, 'getNextDomeEvent').and.returnValue(domeEvent);
            spyOn(domeEventService, 'formatMessageForEvent').and.returnValue(formattedMessage);

            domeEventService.yieldNextDomeEvent();

            expect(bot.say).toHaveBeenCalledWith(formattedMessage);
        });
    });
});