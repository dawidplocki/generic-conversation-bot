const { assertBotResponse } = require('../utils');
const { buildBot } = require('../../BotBuilder');
const ChooseState = require('../../states/ChooseState');
const { response } = require('../../actions');
const { INIT_STATE } = require('../../Bot.Consts');

describe('Choose State', function() {
    function buildMorpheusBot() {
        return buildBot({
            [INIT_STATE]: new ChooseState(
                    "Choose the pill: red or blue",
                    {
                        'BLUE': [
                            response("The story ends, you wake up in your bed and believe whatever you want to believe")
                        ],
                        'red': [
                            response("You stay in Wonderland, and I show you how deep the rabbit hole goes")
                        ]
                    }
                )
        });
    }

    it('should offer choice, then response to first option', function() {
        const bot = buildMorpheusBot();

        assertBotResponse(bot, "hi", "Choose the pill: red or blue");
        assertBotResponse(bot, "blue", "The story ends, you wake up in your bed and believe whatever you want to believe");
    });

    it('should offer choice, then response to second option', function() {
        const bot = buildMorpheusBot();

        assertBotResponse(bot, "hi", "Choose the pill: red or blue");
        assertBotResponse(bot, "red", "You stay in Wonderland, and I show you how deep the rabbit hole goes");
    });

    it('should repeat question if answer was incorrect', function() {
        const bot = buildMorpheusBot();

        bot.message("hi");

        assertBotResponse(bot, "no idea", "Choose the pill: red or blue");
    });
});