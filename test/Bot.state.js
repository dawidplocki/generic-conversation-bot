const Assert = require('assert');
const { buildBot } = require('../botBuilder');
const WaitForActivationState = require('../states/waitForActivationState');
const ChooseState = require('../states/chooseState');
const { jumpToState, endConversation } = require('../actions');
const { assertBotResponse } = require('./utils');
const { INIT_STATE } = require('../constants');

describe('Bot switching states', function() {
    const AStateText = 'Your are in A: Choose B or C';
    const BStateText = 'Your are in B: Return to beginning?';
    const CStateText = 'Your are in C: Proceed?';
    const DStateText = 'Your are in D: This is ending state';


    function buildJumpingBot() {
        return buildBot({
            [INIT_STATE]: new WaitForActivationState('hi', [jumpToState('A')]),
            A: new ChooseState(
                AStateText,
                {
                    'B': [jumpToState('B')],
                    'C': [jumpToState('C')]
                }),
            B: new ChooseState(
                BStateText,
                {
                    'yes': [endConversation()],
                    'no': [jumpToState('D')]
                }),
            C: new ChooseState(
                CStateText,
                {
                    'yes': [jumpToState('D')],
                    'no': [endConversation()]
                }),
            D: new ChooseState(
                DStateText,
                {
                    'ok': [jumpToState(INIT_STATE)]
                }
            )
        });
    }


    it('should start from "start" state', function() {
        const bot = buildJumpingBot();

        Assert.ok(bot.state instanceof WaitForActivationState);
    });

    it('should allow jump to next state', function() {
        const bot = buildJumpingBot();

        assertBotResponse(bot, 'hi', AStateText);
    });

    it('should allow multiple jumps', function() {
        const bot = buildJumpingBot();

        assertBotResponse(bot, 'hi', AStateText);
        assertBotResponse(bot, 'B', BStateText);
        assertBotResponse(bot, 'no', DStateText);
    });

    it('should jump should allow return to init', function() {
        const bot = buildJumpingBot();

        assertBotResponse(bot, 'hi', AStateText);
        assertBotResponse(bot, 'B', BStateText);
        assertBotResponse(bot, 'yes', null);
    });
});
