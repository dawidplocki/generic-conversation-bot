const { buildBot } = require('../../BotBuilder');
const fs = require('fs');
const ParserBuild = require('../../parser');
const contents = JSON.parse(fs.readFileSync('quiz.json', 'utf8'));
const client = require('../BotClient');
const states = new ParserBuild()
    .addCustomStates(require('./states'))
    .parse(contents);
const bot = buildBot(states);

console.log('This bot will be waiting for "hi"!');

client(bot);
