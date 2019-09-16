const Assert = require('assert');
const Bot = require('../Bot');
const WaitForActivationState = require('../states/WaitForActivationState');
const ChooseState = require('../states/ChooseState');
const { jumpToState } = require('../actions');


function buildChoose(initText, replays) {
    return new ChooseState({
            initText: initText,
            replays: replays
        });
}


function buildBot() {
    return new Bot({
        'start': new WaitForActivationState({ activation: 'hi', actions: jumpToState('') }),
        'A': buildChoose(
            'Choose B or C',
            {
                'B': jumpToState('B'),
                'C': jumpToState('D')
            }),
        'B': buildChoose(
            'Your are in A: return to begining?',
            {
                'yes': jumpToState('init'),
                'no': jumpToState('D')
            }),
        'C': buildChoose(
            'Your are in A: proced?',
            {
                'yes': jumpToState('D'),
                'no': jumpToState('init')
            }),
        'D': buildChoose(
            'This is ending state',
            {
                'ok': jumpToState('init')
            }
        )
    });
}

it('should start from "start" state', function() {
    const bot = buildBot();

    Assert.ok(bot.state instanceof WaitForActivationState);
});
