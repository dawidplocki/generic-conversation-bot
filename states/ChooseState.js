const { response } = require('../actions');

class ChooseState {

    constructor(initText, replays) {
        this.initText = initText;
        this.replays = Object.keys(replays).reduce(function(result, key) {
                result[key.toLowerCase()] = replays[key];
                return result;
            }, {});
    }

    *beforeMessage() {
        yield response(this.initText);
    }

    *analyse(message) {
        if (this.replays.hasOwnProperty(message.text)) {
            yield* this.replays[message.text];
            return 
        }

        yield* this.beforeMessage();
    }
}

module.exports = ChooseState;
