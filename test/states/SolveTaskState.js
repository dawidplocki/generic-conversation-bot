const Bot = require('../../Bot');
const MoveNextState = require('../../states/MoveNextState');
const SolveTaskState = require('../../states/SolveTaskState');
const { jumpToState, response } = require('../../actions');
const { assertBotResponse } = require('../utils');

const question = 'What is 2 + 3?';
const answer = '5';
const correct = "Correct";
const incorrect = "Incorrect";

function buildMathBot() {
    return new Bot({
        start: new MoveNextState({
                text: 'pass on',
                actions: [jumpToState('first')]
            }),
        first: new SolveTaskState({
                text: question,
                answer: answer,
                correct: [response(correct)],
                incorrect: [response(incorrect)]
            })
    });
}

it('should give the question on beginning', function() {
    const bot = buildMathBot();

    assertBotResponse(bot, '', question);
});

it('should give replay on correct', function() {
    const bot = buildMathBot();

    bot.message('');

    assertBotResponse(bot, answer, correct);
});

it('should give replay on incorrect', function() {
    const bot = buildMathBot();

    bot.message('');

    assertBotResponse(bot, '23', incorrect);
});
