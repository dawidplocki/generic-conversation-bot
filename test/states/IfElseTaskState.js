const { buildBot } = require('../../BotBuilder');
const MoveNextState = require('../../states/MoveNextState');
const IfElseTaskState = require('../../states/IfElseTaskState');
const { jumpToState, response } = require('../../actions');
const { assertBotResponse } = require('../utils');

describe('If-else Task State', function() {
    const question = 'What is 2 + 3?';
    const answer = '5';
    const then = "Correct";
    const otherwise = "Incorrect";


    function buildMathBot() {
        return buildBot({
            start: new MoveNextState('pass on', [jumpToState('first')]),
            first: new IfElseTaskState(question, answer, [response(then)], [response(otherwise)])
        });
    }
    

    it('should give the question on beginning', function() {
        const bot = buildMathBot();

        assertBotResponse(bot, '', question);
    });

    it('should give replay on "then"', function() {
        const bot = buildMathBot();

        bot.message('');

        assertBotResponse(bot, answer, then);
    });

    it('should give replay on "otherwise"', function() {
        const bot = buildMathBot();

        bot.message('');

        assertBotResponse(bot, '23', otherwise);
    });
});