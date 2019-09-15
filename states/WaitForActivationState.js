const { staySilence } = require('../actions');

class WaitForActivationState {

    constructor({activation, actions}) {
        this.activation = activation;
        this.actions = (typeof actions === 'function')
            ? [actions]
            : actions;
    }

    *beforeMessage() {
    }

    *analise(message) {
        if (message !== this.activation) {
            yield staySilence();
            return;
        }

        yield* this.actions;
    }
}

module.exports = WaitForActivationState;
