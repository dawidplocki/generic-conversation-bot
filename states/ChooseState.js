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
        const replay = message.text.toLowerCase();
        if (this.replays.hasOwnProperty(replay)) {
            yield* this.replays[replay];
            return
        }

        yield* this.beforeMessage();
    }
}

module.exports = ChooseState;
