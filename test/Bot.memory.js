const Assert = require('assert');
const MoveNextState = require('../states/MoveNextState');
const { INIT_STATE } = require('../Bot.Consts');
const { jumpToState, endConversation, remember } = require('../actions');
const Bot = require('../Bot');

describe('Bot memory', function() {
    it('should be accessible in the message', function() {
        const testKey = 'test_key';
        const testValue = 'test_value';
        const bot = new Bot({
            [INIT_STATE]: new MoveNextState('hi', [remember('test_key', 'test_value'), jumpToState('first')]),
            'first': new MoveNextState('hi', [endConversation()])
        });

        const response = bot.message({ text: '1' });

        Assert.ok(response instanceof Object, "Incorrect response type");
        Assert.ok(response.memory instanceof Object, "Missing memory in the response");
        Assert.ok(response.memory.hasOwnProperty(testKey), "Memory has no requested key");
        Assert.strictEqual(response.memory[testKey], testValue, "Memorised value is incorrect");
    });
});
