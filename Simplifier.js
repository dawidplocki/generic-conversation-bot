class Simplifier {

    constructor(bot) {
        this.__bot = bot;
        this.__message = {
                memory: {}
            };
    }

    get state() {
        return this.__bot.state;
    }

    message(message) {
        this.__message['text'] = message;

        this.__message = this.__bot.message(this.__message);

        return this.__message['response'];
    }
}

module.exports = Simplifier;
