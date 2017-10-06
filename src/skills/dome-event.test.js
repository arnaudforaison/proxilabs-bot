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
            var messageAttendu = {
                text: 'OMG look at this thing',
                channel: '#general'
            };
            

            spyOn(bot, 'say').and.stub();
            spyOn(domeEventService, 'getNextDomeEvent').and.returnValue(domeEvent);

            domeEventService.yieldNextDomeEvent();

            expect(bot.say).toHaveBeenCalledWith(messageAttendu);
        });
    });
});