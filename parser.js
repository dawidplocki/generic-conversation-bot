const actions = require('./actions');

function convertTextIntoAction(actionLabel) {
    const actionName = actionLabel
        .split('_')
        .map((current, index) => (index == 0)
                ? current.toLowerCase()
                : current.charAt(0).toUpperCase() + current.slice(1).toLowerCase())
        .join('');

    return actions[actionName]();
}

function parseParameteres(parameter) {
    if (parameter instanceof Array) {
        return parameter.map(currentAction => convertTextIntoAction(currentAction));
    } else if (parameter instanceof Object) {
        const result = {};

        for (let key in parameter) {
            if (!parameter.hasOwnProperty(key)) {
                continue;
            }

            result[key] = parseParameteres(parameter[key]);
        }

        return result;
    }

    return parameter;
}

module.exports = function(statesArray) {
    return statesArray.reduce((previous, current) => {
            const stateFileName = current.type.split('_')
                .map(x => x.charAt(0).toUpperCase() + x.slice(1))
                .join('') + 'State';

            const state = require(`./states/${stateFileName}`)

            previous[current.name] = new state(parseParameteres(current));

            return previous;
        }, {});
}
