const { assertBotResponse } = require('./utils');
const Bot = require('../Bot');
const ChooseState = require('../states/ChooseState');
const WaitForActivationState = require('../states/WaitForActivationState');
const { response, setState, endOfConversation } = require('../actions');


function buildMorpheusBot() {
    const choosePillState = new ChooseState(
        "Choose the pill: red or blue",
        {
            'blue': [
                response("The story ends, you wake up in your bed and believe whatever you want to believe"),
                endOfConversation()
            ],
            'red': [
                response("You stay in Wonderland, and I show you how deep the rabbit hole goes"),
                endOfConversation()
            ]
        });

    return new Bot(new WaitForActivationState('hi', [setState(choosePillState)]));
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

it('should reset after the choice', function() {
    const bot = buildMorpheusBot();

    bot.message("hi");
    bot.message("red");

    assertBotResponse(bot, "no-Hi", null);
    assertBotResponse(bot, "hi", "Choose the pill: red or blue");
});

it('should repeat question if anserw was incorrect', function() {
    const bot = buildMorpheusBot();

    bot.message("hi");

    assertBotResponse(bot, "no idea", "Choose the pill: red or blue");
});
