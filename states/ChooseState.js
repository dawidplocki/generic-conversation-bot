const { response } = require('../actions');

class ChooseState {

    constructor({ initText, replays }) {
        this.initText = initText;
        this.replays = replays;
    }

    *beforeMessage() {
        yield response(this.initText);
    }

    *analise(message) {
        if (this.replays.hasOwnProperty(message)) {
            yield* this.replays[message];
            return 
        }

        yield* this.beforeMessage();
    }
}

module.exports = ChooseState;
