const Bot = require('../../Bot');
const WaitForActivationState = require('../../states/WaitForActivationState');
const { response } = require('../../actions');
const { assertBotResponse } = require('../utils');
const { INIT_STATE } = require('../../Bot.Consts');

describe('Wait For Activation State', function() {

    function buildGreetingsBot() {
        return new Bot({
            [INIT_STATE]: new WaitForActivationState('hi', [response("Hello")])
        });
    }


    it('should ignore everything but activation message', function() {
        assertBotResponse(buildGreetingsBot(), "no-Hi", null);
    });

    it('should response to activation message', function() {
        assertBotResponse(buildGreetingsBot(), "hi", null, true);
        assertBotResponse(buildGreetingsBot(), "Hi", null, true);
    });
});