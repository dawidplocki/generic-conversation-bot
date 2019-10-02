const Assert = require('assert');
const MoveNextState = require('../states/MoveNextState');
const { INIT_STATE } = require('../Bot.Consts');
const { jumpToState, endConversation, remember, rememberInputAs } = require('../actions');
const Bot = require('../Bot');

describe('Bot memory', function() {

    function assertMemoryResponse(response, key, expectedValue) {
        Assert.ok(response instanceof Object, "Incorrect response type");
        Assert.ok(response.memory instanceof Object, "Missing memory in the response");
        Assert.ok(response.memory.hasOwnProperty(key), "Memory has no requested key");
        Assert.strictEqual(response.memory[key], expectedValue, "Memorised value is incorrect");
    }

    it('should be accessible in the message', function() {
        const testKey = 'test_key';
        const testValue = 'test_value';
        const bot = new Bot({
            [INIT_STATE]: new MoveNextState('hi', [
                remember(testKey, testValue),
                jumpToState('first')
            ]),
            'first': new MoveNextState('hi', [endConversation()])
        });

        const response = bot.message({ text: '1' });

        assertMemoryResponse(response, testKey, testValue);
    });

    it('should remember the input', function() {
        const testKey = 'test_key';
        const testValue = 'test_value';
        const bot = new Bot({
            [INIT_STATE]: new MoveNextState('hi', [
                rememberInputAs(testKey),
                jumpToState('first')
            ]),
            'first': new MoveNextState('hi', [endConversation()])
        });

        const response = bot.message({ text: testValue });

        assertMemoryResponse(response, testKey, testValue);
    });
});
