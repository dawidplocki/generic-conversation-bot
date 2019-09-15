const Assert = require('assert');
const WaitForActivationState = require('../states/WaitForActivationState');
const ChooseState = require('../states/ChooseState');


function parser(description) {
    const stateFileName = description.type.split('_')
        .map(x => x.charAt(0).toUpperCase() + x.slice(1))
        .join('') + 'State';

    const state = require(`../states/${stateFileName}`)

    return new state(description);
}


it('should return correct waitForActivation', function() {
    const activation = 'hi';
    const result = parser({
        name: 'Test',
        type: 'wait_for_activation',
        activation: activation,
        actions: []
    });

    Assert.ok(result instanceof WaitForActivationState, "Parser should return correct class");
    Assert.strictEqual(result.activation, activation, "Parser should return class with correct paramaters");
});

it('should return correct ChooseState', function() {
    const initText = 'Choose your pain';
    const result = parser({
        name: 'Test',
        type: 'choose',
        initText: initText,
        replays: []
    });

    Assert.ok(result instanceof ChooseState, "Parser should return correct class");
    Assert.strictEqual(result.initText, initText, "Parser should return class with correct paramaters");
});
