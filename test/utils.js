const assert = require('assert');

exports.assertBotResponse = function(bot, message, exceptedResponse, notEqual = false) {
    const response = bot.message(message);
    const [assertion, should] = (notEqual !== true)
        ? [assert.strictEqual, "should"]
        : [assert.notStrictEqual, "shouldn't"];

    assertion(response, exceptedResponse, `Bot ${should} response with '${exceptedResponse}', received '${response}'`);
}
