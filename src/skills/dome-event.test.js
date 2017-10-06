require('jasmine');
var DomeEventService = require('./dome-event');

describe('DomeEventService', function(){
    describe('yieldNextDomeEvent', function(){
        var bot = undefined;
        var spi = undefined;
        // On imagine que yieldNextDomeEvent est appelée vers 1h du matin
        var now = new Date(2017, 12, 1, 1, 0, 27, 0);
        var domeEventService = undefined;

        beforeEach(function() {
            bot = {
                say: function(message) {}
            };
            calendar = {
                now: function() {
                    return now;
                }
            };
            spi = {
                bot: bot,
                calendar: calendar
            };
            domeEventService = new DomeEventService(spi);            
        });

        it('n\'annonce pas de prochain Dome Event s\'il n\'y a pas de prochain Dome Event', function(){
            spyOn(bot, 'say').and.stub();
            spyOn(domeEventService, 'getNextDomeEvent').and.returnValue(undefined);
            spyOn(domeEventService, 'formatMessage7DaysBeforeEvent').and.stub();

            domeEventService.yieldNextDomeEvent();

            expect(domeEventService.formatMessage7DaysBeforeEvent).not.toHaveBeenCalled();
            expect(bot.say).not.toHaveBeenCalled();
        });

        it('n\'annonce pas de prochain Dome Event s\'il est dans 8 jours', function(){
            var domeEvent = {
                date: new Date(2017, 12, 9, 12, 30, 0, 0),
                notified7daysBefore: false
            };
            spyOn(bot, 'say').and.stub();
            spyOn(domeEventService, 'getNextDomeEvent').and.returnValue(domeEvent);
            spyOn(domeEventService, 'formatMessage7DaysBeforeEvent').and.stub();

            domeEventService.yieldNextDomeEvent();

            expect(domeEventService.formatMessage7DaysBeforeEvent).not.toHaveBeenCalled();
            expect(bot.say).not.toHaveBeenCalled();
        });

        it('n\'annonce pas de prochain Dome Event s\'il est dans 7 jours mais qu\'il a déjà été annoncé', function(){
            var domeEvent = {
                date: new Date(2017, 12, 8, 12, 30, 0, 0),
                notified7daysBefore: true
            };
            spyOn(bot, 'say').and.stub();
            spyOn(domeEventService, 'getNextDomeEvent').and.returnValue(domeEvent);
            spyOn(domeEventService, 'formatMessage7DaysBeforeEvent').and.stub();

            domeEventService.yieldNextDomeEvent();

            expect(domeEventService.formatMessage7DaysBeforeEvent).not.toHaveBeenCalled();
            expect(bot.say).not.toHaveBeenCalled();
        });

        
        it('annonce le prochain Dome Event 7 jours à l\'avance', function(){
            var domeEvent = {
                date: new Date(2017, 12, 8, 12, 30, 0, 0),
                notified7daysBefore: false
            };
            now = new Date(2017, 12, 1, 12, 31, 0, 0);
            var formattedMessage = {
                text: 'Le prochain Dome Event aura lieu le xx/xx/xx sur le thème 42.',
                channel: '#general'
            };            

            spyOn(bot, 'say').and.stub();
            spyOn(domeEventService, 'getNextDomeEvent').and.returnValue(domeEvent);
            spyOn(domeEventService, 'formatMessage7DaysBeforeEvent').and.returnValue(formattedMessage);

            domeEventService.resetReminders();
            
            domeEventService.yieldNextDomeEvent();

            expect(bot.say).toHaveBeenCalledWith(formattedMessage);
        });
    });
});