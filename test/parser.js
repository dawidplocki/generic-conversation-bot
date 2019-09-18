const Assert = require('assert');
const WaitForActivationState = require('../states/WaitForActivationState');
const ChooseState = require('../states/ChooseState');


function parser(statesArray) {
    return statesArray.reduce((previous, current) => {
            const stateFileName = current.type.split('_')
                .map(x => x.charAt(0).toUpperCase() + x.slice(1))
                .join('') + 'State';

            const state = require(`../states/${stateFileName}`)

            previous[current.name] = new state(current);

            return previous;
        }, {});
}


it('should return correct waitForActivation', function() {
    const activation = 'hi';
    const name = "Test";
    const result = parser([{
        name: name,
        type: 'wait_for_activation',
        activation: activation,
        actions: []
    }]);

    Assert.strictEqual(Object.keys(result).length, 1, "Parser should return map with one element array");
    Assert.ok(result[name] instanceof WaitForActivationState, "Parser should return correct class");
    Assert.strictEqual(result[name].activation, activation, "Parser should return class with correct paramaters");
});

it('should return correct ChooseState', function() {
    const initText = 'Choose your pain';
    const name = "Test";
    const result = parser([{
        name: name,
        type: 'choose',
        initText: initText,
        replays: []
    }]);

    Assert.strictEqual(Object.keys(result).length, 1, "Parser should return map with one element array");
    Assert.ok(result[name] instanceof ChooseState, "Parser should return correct class");
    Assert.strictEqual(result[name].initText, initText, "Parser should return class with correct paramaters");
});

it('should return map of name to state', function() {
    const firstStateName = 'first';
    const secondStateName = 'second';
    const paramForFirstState = {
        name: firstStateName,
        type: 'wait_for_activation',
        activation: 'hi',
        actions: []
    };
    const paramForSecondState = {
        name: secondStateName,
        type: 'choose',
        initText: '',
        replays: []
    };
    const expected = {
        [firstStateName]: new WaitForActivationState(paramForFirstState),
        [secondStateName]: new ChooseState(paramForSecondState)
    };

    const result = parser([paramForFirstState, paramForSecondState]);

    Assert.deepStrictEqual(result, expected, "Parser should map the input into states map");
});
