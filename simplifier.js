function clearMessage() {
    return {
        memory: {}
    };
}

class Simplifier {

    constructor(bot) {
        this.__bot = bot;
        this.__message = clearMessage();
    }

    get state() {
        return this.__bot.state;
    }

    reset() {
        this.__message = clearMessage();
        this.__bot.reset();
    }

    message(message) {
        this.__message['text'] = message;

        this.__message = this.__bot.message(this.__message);

        return this.__message['response'];
    }

    get isReset() {
        return this.__bot.isReset;
    }
}

module.exports = Simplifier;
