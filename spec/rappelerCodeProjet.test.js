require('jasmine');
var index = require('../src/index.js');


describe('Rappeler code projet', function(){
    it('repond ', function(){
        var bot = {
            reply: function(message, texte) {}
        };
        spyOn(bot, 'reply').and.stub();
        var message = {};
        index.rappelerCodeProjet(bot, message);
        expect(bot.reply).toHaveBeenCalledWith(message, 'Proxilabs-affaire 1700643');
    })
});