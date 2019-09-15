const assert = require('assert');

module.exports.assertBotResponse = function(bot, message, exceptedRespose, notEqual = false) {
    const response = bot.message(message);
    const [assertion, should] = (notEqual !== true)
        ? [assert.strictEqual, "should"]
        : [assert.notStrictEqual, "shouldn't"];

    assertion(response, exceptedRespose, `Bot ${should} response with '${exceptedRespose}', recived '${response}'`);
}
