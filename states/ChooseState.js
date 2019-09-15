const { response } = require('../actions');

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

module.exports = ChooseState;
