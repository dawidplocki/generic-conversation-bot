const { staySilence } = require('../actions');

class WaitForActivationState {

    constructor(activationMessage, actions) {
        this.activationMessage = activationMessage;
        this.actions = (typeof actions === 'function')
            ? [actions]
            : actions;
    }

    *beforeMessage() {
    }

    *analise(message) {
        if (message !== this.activationMessage) {
            yield staySilence();
            return;
        }

        yield* this.actions;
    }
}

module.exports = WaitForActivationState;
