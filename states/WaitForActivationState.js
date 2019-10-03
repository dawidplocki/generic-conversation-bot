const { staySilence } = require('../actions');

class WaitForActivationState {

    constructor(activation, actions) {
        this.activation = activation.toLowerCase();
        this.actions = (typeof actions === 'function')
            ? [actions]
            : actions;
    }

    *beforeMessage() {
    }

    *analyse(message) {
        if (message.text.toLowerCase() !== this.activation) {
            yield staySilence();
            return;
        }

        yield* this.actions;
    }
}

module.exports = WaitForActivationState;
