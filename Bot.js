const { INIT_STATE } = require('./Bot.Consts');


class Bot {
    constructor(stateMap) {
        this.stateMap = stateMap;
        this.initialState = stateMap[INIT_STATE];
        this.state = stateMap[INIT_STATE];
        this.reset();
        this.actionsSource = [];
    }

    setState(state) {
        this.state = state;
        this.actionsSource.push(state.beforeMessage());
    }

    setResponse(response) {
        this.response = response;
    }

    reset() {
        this.state = this.initialState;
        this.response = null;
    }

    *nextAction() {
        while (this.actionsSource.length > 0) {
            yield* (this.actionsSource.shift());
        }
    }

    message(message) {
        this.actionsSource.push(this.state.analise(message.toLowerCase()));
        for (let action of this.nextAction()) {
            action(this);
        }

        return this.response;
    }
}

module.exports = Bot;
