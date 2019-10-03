const { buildBot } = require('./BotBuilder');
const fs = require('fs');
const parser = require('./parser');
const contents = JSON.parse(fs.readFileSync('example/simple/conversation.json', 'utf8'));
const bot = buildBot(parser(contents));

function sayToBot(message) {
    console.log('User:', message);
    console.log('Bot: ', bot.message(message));
}

sayToBot('hi');
sayToBot('Mr. User');
sayToBot('');
sayToBot('');
sayToBot('');
sayToBot('Hi');
