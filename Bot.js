const { INIT_STATE } = require('./Bot.Consts');


class Bot {
    constructor(statesMap) {
        this.actionsSource = [];
        this.statesMap = statesMap;
        this.reset();
    }

    setState(state) {
        this.state = state;
        this.actionsSource.push(state.beforeMessage());
    }

    jumpToState(stateLabel) {
        this.setState(this.statesMap[stateLabel]);
    }

    setResponse(response) {
        this.response = response;
    }

    reset() {
        this.jumpToState(INIT_STATE);
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
