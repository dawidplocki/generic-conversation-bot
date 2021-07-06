const { buildBot, ParserBuilder } = require('@dplocki/generic-conversation-bot');

const contents = require('./quiz.json');
const client = require('../BotClient');

const states = new ParserBuilder()
    .addCustomStates(require('./states'))
    .parse(contents);

const bot = buildBot(states);

console.log('This bot will be waiting for "hi"!');
client(bot);
