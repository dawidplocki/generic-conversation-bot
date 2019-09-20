const { staySilence } = require('../actions');

class WaitForActivationState {

    constructor(activation, actions) {
        this.activation = activation;
        this.actions = (typeof actions === 'function')
            ? [actions]
            : actions;
    }

    *beforeMessage() {
    }

    *analyse(message) {
        if (message.text !== this.activation) {
            yield staySilence();
            return;
        }

        yield* this.actions;
    }
}

module.exports = WaitForActivationState;
