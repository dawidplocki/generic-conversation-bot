const Assert = require('assert');
const WaitForActivationState = require('../states/WaitForActivationState');
const ChooseState = require('../states/ChooseState');
const ParserBuilder = require('../parser');
const { INIT_STATE } = require('../Bot.Consts');


function assertStateMapCount(result, expectedStateCount) {
    Assert.ok(!!result, "Result is undefined");
    Assert.strictEqual(result.constructor, Object, "Result is not proper type");
    Assert.strictEqual(Object.keys(result).length, expectedStateCount, "Result haven't return correct number of states");
}


describe('State Parser', function() {
    it('should return correct waitForActivation', function () {
        // Assign
        const activation = 'hi';
        const name = "Test";

        // Act
        const result = new ParserBuilder().parse([{
            name: name,
            type: 'wait_for_activation',
            activation: activation,
            actions: []
        }]);

        // Assert
        assertStateMapCount(result, 1);
        Assert.ok(result[name] instanceof WaitForActivationState, "Parser should return correct class");
        Assert.strictEqual(result[name].activation, activation, "Parser should return class with correct parameters");
    });

    it('should return correct ChooseState', function () {
        // Assign
        const initText = 'Choose your pain';
        const name = "Test";

        // Act
        const result = new ParserBuilder().parse([{
            name: name,
            type: 'choose',
            initText: initText,
            replays: []
        }]);

        // Assert
        assertStateMapCount(result, 1);
        Assert.ok(result[name] instanceof ChooseState, "Parser should return correct class");
        Assert.strictEqual(result[name].initText, initText, "Parser should return class with correct parameters");
    });

    it('should return map of name to state', function () {
        // Assign
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
            replays: {}
        };
        const expected = {
            [firstStateName]: new WaitForActivationState('hi', []),
            [secondStateName]: new ChooseState('', {})
        };

        // Act
        const result = new ParserBuilder().parse([paramForFirstState, paramForSecondState]);

        // Assert
        assertStateMapCount(result, 2);
        Assert.deepStrictEqual(result, expected, "Parser should map the input into states map");
    });
});

describe('Action Parser', function() {
    it('should parse action string into the action function', function () {
        // Assign and Act
        const spy = { hasBeenCalled: false, reset: function () { this.hasBeenCalled = true; } };
        const result = new ParserBuilder().parse([{
                name: INIT_STATE,
                type: 'move_next',
                text: "Hello",
                actions: [
                    "end_conversation"
                ]
            }]);

        // Assert
        assertStateMapCount(result, 1);

        const state = result[INIT_STATE];
        const actions = state.actions;

        Assert.ok(actions instanceof Array, "Actions of State should the stored in array");
        Assert.strictEqual(actions.length, 1, "Parser should find only one action");

        const action = actions[0];

        Assert.ok(action instanceof Function, "Actions should be translate into function");

        action(spy, { message: { memory: {} } });

        Assert.ok(spy.hasBeenCalled, "Converted action is not endConversation");
    });

    it('should parse action string with parameters into the action function', function () {
        // Assign and Act
        class Spy {
            constructor() {
                this.__response = null;
            }

            set response(value) {
                this.__response = value;
            }

            get response() {
                return this.__response;
            }
        }

        const spy = new Spy();
        const response = "Hi!";
        const result = new ParserBuilder().parse([{
            name: INIT_STATE,
            type: 'move_next',
            text: "Hello",
            actions: [
                ["response", response]
            ]
        }]);

        // Assert
        assertStateMapCount(result, 1);

        const state = result[INIT_STATE];
        const actions = state.actions;

        Assert.ok(actions instanceof Array, "Actions of State should the stored in array");
        Assert.strictEqual(actions.length, 1, "Parser should find only one action");

        const action = actions[0];

        Assert.ok(action instanceof Function, "Actions should be translate into function");

        action(spy);

        Assert.strictEqual(spy.response, response, "Converted action is not setResponse");
    });
});

describe('Parser Extension', function() {

    it('should use states extension', function() {
        let spyCheck = false;
        const testStateName = 'test';
        const result = new ParserBuilder()
            .addCustomStates({
                [testStateName]: function() {
                    spyCheck = true;
                    return {};
                }
            })
            .parse([
                {
                    name: INIT_STATE,
                    type: 'move_next',
                    text: "Hello",
                    actions: []
                },
                {
                    name: 'first',
                    type: testStateName,
                    actions: []
                }
            ]);

        // Assert
        assertStateMapCount(result, 2);
        Assert.ok(spyCheck, "Additional state builder function hasn't been called by parser");
    });

    it('should use actions extension', function() {
        let spyCheck = false;
        const testActionName = 'test';
        const result = new ParserBuilder()
            .addCustomActions({
                    [testActionName]: function() {
                        spyCheck = true;
                    }
            })
            .parse([
                {
                    name: INIT_STATE,
                    type: 'move_next',
                    text: "Hello",
                    actions: [
                        testActionName
                    ]
                }
            ])

        // Assert
        assertStateMapCount(result, 1);
        Assert.ok(spyCheck, "Additional action builder function hasn't been called by parser");
    });

    it('should use preparsers', function() {
        // Assign
        const preParserName = 'test';
        // Act
        const result = new ParserBuilder()
            .addPreParsers({
                test: function(state) {
                    state['type'] = 'wait_for_activation';
                    state['activation'] = 'hi';

                    return state;
                }
            })
            .parse([{
                    pre_parser: 'test',
                    pre_states: [
                        { name: "1" },
                        { name: "2" }
                    ]
                }
            ]);

        // Assert
        Assert.strictEqual(Object.keys(result).length, 2, "Should be two states");
        Assert.ok(result["1"] instanceof WaitForActivationState, "State 1 should have property given by preparser");
        Assert.ok(result["2"] instanceof WaitForActivationState, "State 2 should have property given by preparser");
    });
});
