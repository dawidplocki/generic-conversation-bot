const Assert = require('assert');
const Bot = require('../Bot');
const WaitForActivationState = require('../states/WaitForActivationState');
const ChooseState = require('../states/ChooseState');
const { jumpToState } = require('../actions');
const { assertBotResponse } = require('./utils');


function buildChoose(initText, replays) {
    return new ChooseState({
            initText: initText,
            replays: replays
        });
}


const AStateText = 'Your are in A: Choose B or C';
const BStateText = 'Your are in B: Return to begining?';
const CStateText = 'Your are in C: Proceed?';
const DStateText = 'Your are in D: This is ending state';


function buildBot() {
    return new Bot({
        'start': new WaitForActivationState({ activation: 'hi', actions: jumpToState('A') }),
        'A': buildChoose(
            AStateText,
            {
                'B': [jumpToState('B')],
                'C': [jumpToState('C')]
            }),
        'B': buildChoose(
            BStateText,
            {
                'yes': [jumpToState('start')],
                'no': [jumpToState('D')]
            }),
        'C': buildChoose(
            CStateText,
            {
                'yes': [jumpToState('D')],
                'no': [jumpToState('start')]
            }),
        'D': buildChoose(
            DStateText,
            {
                'ok': [jumpToState('start')]
            }
        )
    });
}

it('should start from "start" state', function() {
    const bot = buildBot();

    Assert.ok(bot.state instanceof WaitForActivationState);
});

it('should allow jump to next state', function() {
    const bot = buildBot();

    assertBotResponse(bot, 'hi', AStateText);
});

it('should allow multiple jumps', function() {
    const bot = buildBot();

    assertBotResponse(bot, 'hi', AStateText);
    assertBotResponse(bot, 'B', BStateText);
    assertBotResponse(bot, 'no', DStateText);
});
