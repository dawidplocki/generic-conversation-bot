const assert = require('assert');


function staySilence() {
    return response(null);
}


function response(message) {
    return bot => bot.setResponse(message);
}


function setState(state) {
    return bot => bot.setState(state);
}


class WaitForActivationState {

    constructor(activationMessage, actions) {
        this.activationMessage = activationMessage;
        this.actions = (typeof actions === 'function')
            ? [actions]
            : actions;
    }

    *beforeMessage() {}

    *analise(message) {
        if (message !== this.activationMessage) {
            yield staySilence();
            return;
        }

        yield* this.actions;
    }
}


class ChooseState {

    constructor(chooseMessage, replays) {
        this.chooseMessage = chooseMessage;
        this.replays = replays;
    }

    *beforeMessage() {
        yield response(this.chooseMessage);
    }

    *analise(message) {
        if (this.replays.hasOwnProperty(message)) {
            yield* this.replays[message];
        }

        return;
    }
}


class Bot {

    constructor(initialState) {
        this.initialState = initialState;
        this.reset();
        this.actionsSource = [];
    }

    setState(state) {
        this.state = state;
        this.actionsSource.push(state.beforeMessage());
    }

    setResponse(response) {
        this.response = response;
    }

    reset() {
        this.state = this.initialState;
        this.response = null;
    }

    *nextAction() {
        while(this.actionsSource.length > 0) {
            yield *(this.actionsSource.shift());
        }
    }

    message(message) {
        this.actionsSource.push(this.state.analise(message.toLowerCase()));
        for (let action of this.nextAction()) {
            action(this);
        }

        return this.response;
    }
}


function endOfConversation() {
    return bot => bot.setState(bot.initialState);
}


function buildGreetingsBot() {
    return new Bot(new WaitForActivationState('hi', [response("Hello")]));
}


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
