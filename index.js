const assert = require('assert');


function waitForActivation(activationMessage, param) {
    const actions = (typeof param === 'function')
        ? [param]
        : param;

    return function* (message) {
        if (message == activationMessage) {
            yield* actions;
        }

        return;
    }
}


function selectOption(replays) {

    return function* (message) {
        if (replays.hasOwnProperty(message)) {
            yield *replays[message];
        }

        return;
    }
}


function response(message) {
    return bot => bot.setResponse(message);
}


class Bot {
    constructor(initialState) {
        this.state = initialState;
        this.response = null;
    }

    setState(state) {
        this.state = state;
    }

    setResponse(response) {
        this.response = response;
    }

    message(message) {
        for (let action of this.state(message.toLowerCase())) {
            action(this);
        }

        return this.response;
    }
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
            'blue': [response("The story ends, you wake up in your bed and believe whatever you want to believe")],
            'red': [response("You stay in Wonderland, and I show you how deep the rabbit hole goes")]
        }))
    ]));
}


let bot;

// Waiting for "hi"
bot = buildGreetingsBot();
assert.strictEqual(bot.message("no-Hi"), null, "Bot should ignore everything except 'hi'");

bot = buildGreetingsBot();
assert.notStrictEqual(bot.message("hi"), null, "Bot should response with 'hi' (no matter the way of write)");

bot = buildGreetingsBot();
assert.notStrictEqual(bot.message("Hi"), null, "Bot should response with 'hi' (no matter the way of write)");

// Simple dialogue tree
bot = buildMorpheusBot();
assert.strictEqual(bot.message("hi"), "Choose the pill: red or blue", "Bot should ask about pill");
assert.strictEqual(bot.message("blue"), "The story ends, you wake up in your bed and believe whatever you want to believe", "Bot should acknowledge the choice of blue pill");

bot = buildMorpheusBot();
assert.strictEqual(bot.message("hi"), "Choose the pill: red or blue", "Bot should ask about pill");
assert.strictEqual(bot.message("red"), "You stay in Wonderland, and I show you how deep the rabbit hole goes", "Bot should acknowledge the choice of red pill");

console.log("everything ok");
