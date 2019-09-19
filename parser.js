const actions = require('./actions');
const states = require('./states');

function labelToFunctionName(actionLabel) {
    return actionLabel
        .split('_')
        .map((current, index) => (index == 0)
                ? current.toLowerCase()
                : current.charAt(0).toUpperCase() + current.slice(1).toLowerCase())
        .join('');
}

function convertTextIntoAction(rawAction) {
    const [actionName, actionParameters] = (rawAction instanceof Array) 
        ? [labelToFunctionName(rawAction[0]), rawAction.slice(1)]
        : [labelToFunctionName(rawAction), []];

    return actions[actionName].apply(null, actionParameters);
}

function parseParameters(parameter) {
    if (parameter instanceof Array) {
        return parameter.map(currentAction => convertTextIntoAction(currentAction));
    } else if (parameter instanceof Object) {
        const result = {};

        for (let key in parameter) {
            if (!parameter.hasOwnProperty(key)) {
                continue;
            }

            result[key] = parseParameters(parameter[key]);
        }

        return result;
    }

    return parameter;
}

module.exports = function(statesArray) {
    return statesArray.reduce((previous, current) => {
            const state = states[labelToFunctionName(current.type)];

            previous[current.name] = state.call(null, parseParameters(current));

            return previous;
        }, {});
}
