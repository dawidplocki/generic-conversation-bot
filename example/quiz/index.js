const { buildBot } = require('../../BotBuilder');
const fs = require('fs');
const parser = require('../../parser');
const contents = JSON.parse(fs.readFileSync('quiz.json', 'utf8'));
const SummaryState = require('./SummaryState');
const bot = buildBot(parser(contents, { summary: () => new SummaryState() }));
const client = require('../BotClient');

console.log('This bot will be waiting for "hi"!');

client(bot);
