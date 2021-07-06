const { buildBot, ParserBuilder } = require('@dplocki/generic-conversation-bot');
const client = require('../BotClient');

const states = new ParserBuilder()
    .addCustomStates(require('./states'))
    .addPreParsers(require('./preParsers'))
    .parse(require('./exam.json'));

const bot = buildBot(states);

console.log('This bot will be waiting for "hi"!');

client(bot);
