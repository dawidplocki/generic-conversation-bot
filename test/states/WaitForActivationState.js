const Bot = require('../../Bot');
const WaitForActivationState = require('../../states/WaitForActivationState');
const { response } = require('../../actions');
const { assertBotResponse } = require('../utils');


function buildGreetingsBot() {
    return new Bot(new WaitForActivationState('hi', [response("Hello")]));
}


it('should ignore everything but activation message', function() {
    assertBotResponse(buildGreetingsBot(), "no-Hi", null);
});

it('should response to activation message', function() {
    assertBotResponse(buildGreetingsBot(), "hi", null, true);
    assertBotResponse(buildGreetingsBot(), "Hi", null, true);
});
