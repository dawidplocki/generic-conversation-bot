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


class Bot {
    constructor(initialState) {
        this.state = initialState;
        this.respose = null;
    }

    setState(state) {
        this.state = state;
    }

    setResponse(response) {
        this.respose = response;
    }

    message(message) {
        for (let action of this.state(message.toLowerCase())) {
            action(this);
        }

        return this.respose;
    }
}


function buildBot() {
    return new Bot(waitForActivation('hi', [
        bot => bot.setResponse("Hello"),
        bot => bot.setState(null)
    ]));
}


let bot;

// Waiting for "hi"
bot = buildBot();
assert.strictEqual(bot.message("no-Hi"), null, "Bot should ignore everything except 'hi'");

bot = buildBot();
assert.notStrictEqual(bot.message("hi"), null, "Bot should response with 'hi' (no matter the way of write)");

bot = buildBot();
assert.notStrictEqual(bot.message("Hi"), null, "Bot should response with 'hi' (no matter the way of write)");


console.log("everything ok");
