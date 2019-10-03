function labelToFunctionName(actionLabel) {
    return actionLabel
        .split('_')
        .map((current, index) => (index == 0)
                ? current.toLowerCase()
                : current.charAt(0).toUpperCase() + current.slice(1).toLowerCase())
        .join('');
}

function convertTextIntoAction(rawAction, actions) {
    const [actionName, actionParameters] = (rawAction instanceof Array) 
        ? [labelToFunctionName(rawAction[0]), rawAction.slice(1)]
        : [labelToFunctionName(rawAction), []];

    return actions[actionName].apply(null, actionParameters);
}

function parseParameters(parameter, actions) {
    if (parameter instanceof Array) {
        return parameter.map(currentAction => convertTextIntoAction(currentAction, actions));
    } else if (parameter instanceof Object) {
        const result = {};

        for (let key in parameter) {
            if (!parameter.hasOwnProperty(key)) {
                continue;
            }

            result[key] = parseParameters(parameter[key], actions);
        }

        return result;
    }

    return parameter;
}

function parser(statesArray, states, actions) {
    return statesArray.reduce((previous, current) => {
            const stateName = labelToFunctionName(current.type);

            if (!states.hasOwnProperty(stateName)) {
                throw new Error(`Unknown state: '${stateName}'`);
            }

            previous[current.name] = states[stateName].call(null, parseParameters(current, actions));

            return previous;
        }, {});
}

module.exports = function(statesArray, additionalStates, additionalActions) {
    const originalActions = require('./actions');
    const originalStates = require('./states');

    return (function(statesArray) {
        return parser(
                statesArray,
                { ...originalStates, ...(additionalStates || {}) },
                { ...originalActions, ...(additionalActions || {}) }
            );
    })(statesArray);
}
