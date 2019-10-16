function labelToFunctionName(actionLabel) {
    return actionLabel
        .split('_')
        .map((current, index) => (index == 0)
                ? current.toLowerCase()
                : current.charAt(0).toUpperCase() + current.slice(1).toLowerCase())
        .join('');
}

function convertTextIntoAction(rawAction, actions) {
    const [actionName, rawActionName, actionParameters] = (rawAction instanceof Array)
        ? [labelToFunctionName(rawAction[0]), rawAction[0], rawAction.slice(1)]
        : [labelToFunctionName(rawAction), rawAction, []];

    if (!actions.hasOwnProperty(actionName)) {
        throw new Error(`Unknown action: '${actionName}' (raw: ${rawActionName})`);
    }

    return actions[actionName].apply(null, actionParameters);
}

function parseParameters(parameter, actions) {
    if (parameter instanceof Array) {
        return parameter.map(currentAction => convertTextIntoAction(currentAction, actions));
    } else if (parameter instanceof Object) {
        const result = {};

        for (const key in parameter) {
            if (!parameter.hasOwnProperty(key)) {
                continue;
            }

            result[key] = parseParameters(parameter[key], actions);
        }

        return result;
    }

    return parameter;
}

function *preProcessing(states, preParsers) {
    for(const state of states) {
        if (state.hasOwnProperty('pre_parser')) {
            const preParserName = labelToFunctionName(state['pre_parser']);

            if (!preParsers.hasOwnProperty(preParserName)) {
                throw new Error(`Unknown preParsers: '${preParserName}' (raw: '${state['pre_parser']}')`);
            }

            yield* state['pre_states'].map(preParsers[preParserName]);
        } else {
            yield state;
        }
    }
}

function parser(statesArray, states, actions, preParsers) {
    return Array.from(preProcessing(statesArray, preParsers))
        .reduce((previous, current) => {
            if (!current.hasOwnProperty('type')) {
                throw new Error(`Missing type attribute! (raw: ${JSON.stringify(current)})`);
            }

            if (!current.hasOwnProperty('name')) {
                throw new Error(`Missing name attribute! (raw: ${JSON.stringify(current)})`);
            }

            const stateName = labelToFunctionName(current.type);

            if (!states.hasOwnProperty(stateName)) {
                throw new Error(`Unknown state: '${stateName}' (raw: '${current.type}')`);
            }

            previous[current.name] = states[stateName].call(null, parseParameters(current, actions));

            return previous;
        }, {});
}


class ParserBuilder {

    constructor() {
        this.additionalStates = null;
        this.additionalActions = null;
        this.preParsers = null;
    }

    addCustomStates(states) {
        this.additionalStates = states;

        return this;
    }

    addCustomActions(states) {
        this.additionalActions = states;

        return this;
    }

    addPreParsers(preParsers) {
        this.preParsers = preParsers;

        return this;
    }

    parse(jsonStatesArray) {
        const originalActions = require('./actions');
        const originalStates = require('./states');

        return parser(
            jsonStatesArray,
                { ...originalStates, ...(this.additionalStates || {}) },
                { ...originalActions, ...(this.additionalActions || {}) },
                this.preParsers || {}
            );
    }
}

module.exports = ParserBuilder;
