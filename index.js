const assert = require('assert');

function staySilence() {
    return response(null);
}


function waitForActivation(activationMessage, param) {
    const actions = (typeof param === 'function')
        ? [param]
        : param;

    return function *(message) {
        if (message !== activationMessage) {
            yield staySilence();
            return;
        }

        yield* actions;
    }
}


function selectOption(replays) {

    return function* (message) {
        if (replays.hasOwnProperty(message)) {
            yield* replays[message];
        }

        return;
    }
}


function response(message) {
    return bot => bot.setResponse(message);
}


class Bot {
    constructor(initialState) {
        this.initialState = initialState;
        this.reset();
    }

    setState(state) {
        this.state = state;
    }

    setResponse(response) {
        this.response = response;
    }

    reset() {
        this.state = this.initialState;
        this.response = null;
    }

    message(message) {
        for (let action of this.state(message.toLowerCase())) {
            action(this);
        }

        return this.response;
    }
}


function endOfConversation() {
    return bot => bot.setState(bot.initialState);
}


function buildGreetingsBot() {
    return new Bot(waitForActivation('hi', [
        response("Hello"),
        bot => bot.setState(null)
    ]));
}


function buildMorpheusBot() {
    return new Bot(waitForActivation('hi', [
        response("Choose the pill: red or blue"),
        bot => bot.setState(selectOption({
            'blue': [
                response("The story ends, you wake up in your bed and believe whatever you want to believe"),
                endOfConversation()
            ],
            'red': [
                response("You stay in Wonderland, and I show you how deep the rabbit hole goes"),
                endOfConversation()
            ]
        }))
    ]));
}


function assertBotResponse(bot, message, exceptedRespose, notEqual = false) {
    const response = bot.message(message);
    const [assertion, should] = (notEqual !== true)
        ? [assert.strictEqual, 'should']
        : [assert.notStrictEqual, 'shouldn\'t'];

    assertion(response, exceptedRespose, `Bot ${should} response with '${exceptedRespose}', recived '${response}'`);
}

// Waiting for "hi"
assertBotResponse(buildGreetingsBot(), "no-Hi", null);
assertBotResponse(buildGreetingsBot(), "hi", null, true);
assertBotResponse(buildGreetingsBot(), "Hi", null, true);

// Simple dialogue tree
let bot;
bot = buildMorpheusBot();
assertBotResponse(bot, "hi", "Choose the pill: red or blue");
assertBotResponse(bot, "blue", "The story ends, you wake up in your bed and believe whatever you want to believe");

bot = buildMorpheusBot();
assertBotResponse(bot, "hi", "Choose the pill: red or blue");
assertBotResponse(bot, "red", "You stay in Wonderland, and I show you how deep the rabbit hole goes");

bot = buildMorpheusBot();
bot.message("hi");
bot.message("red");

assertBotResponse(bot, "no-Hi", null);
assertBotResponse(bot, "hi", "Choose the pill: red or blue");

console.log("everything ok");
