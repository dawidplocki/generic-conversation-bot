const { buildBot } = require('../../BotBuilder');
const fs = require('fs');
const parser = require('../../parser');
const contents = JSON.parse(fs.readFileSync('conversation.json', 'utf8'));
const bot = buildBot(parser(contents));
const client = require('../BotClient');

console.log('This bot will be waiting for "hi"!');

client(bot);
