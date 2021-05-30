const { buildBot } = require('../../BotBuilder');
const MoveNextState = require('../../states/MoveNextState');
const { jumpToState, endConversation } = require('../../actions');
const { assertBotResponse } = require('../utils');
const { INIT_STATE } = require('../../constants');

describe('Move Next State', function() {
    it('should move to next state no matter the message', function() {
        const textA = 'Hello, you are on beginning';
        const textB = 'You are on B';
        const textC = 'You are on C';

        const bot = buildBot({
            [INIT_STATE]: new MoveNextState(textA, [jumpToState('first')]),
            first: new MoveNextState(textB, [jumpToState('second')]),
            second: new MoveNextState(textC, [endConversation()])
        });

        assertBotResponse(bot, 'ok', textB);
        assertBotResponse(bot, 'not-ok', textC);
    });
});