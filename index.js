const assert = require('assert');

class Bot
{
    message(message) {
        message = message.toLowerCase();
        if (message !== 'hi') {
            return null;
        }

        return "Hello";
    }
}


let bot;

// Waiting for "hi"
bot = new Bot();
assert.strictEqual(bot.message("hi"), "Hello", "Bot should response with 'Hello'");
assert.strictEqual(bot.message("Hi"), "Hello", "Bot should response with 'Hello'");

bot = new Bot();
assert.strictEqual(bot.message("no-Hi"), null, "Bot should ignore everything except 'hi'");
