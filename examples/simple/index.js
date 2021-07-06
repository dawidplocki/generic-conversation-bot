const { buildBot, ParserBuilder } = require('@dplocki/generic-conversation-bot');

const bot = buildBot(new ParserBuilder().parse(require('./conversation.json')));
const client = require('../BotClient');

console.log('This bot will be waiting for "hi"!');

client(bot);
