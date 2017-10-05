require('jasmine');
var BudgetService = require('./budget.js');

describe('Rappeler code projet', function(){
    it('repond ', function(){
        var budgetService = new BudgetService(undefined);
        var bot = {
            reply: function(message, texte) {}
        };
        spyOn(bot, 'reply').and.stub();
        var message = {};
        budgetService.rappelerCodeProjet(bot, message);
        expect(bot.reply).toHaveBeenCalledWith(message, 'Proxilabs-affaire 1700643');
    })
});