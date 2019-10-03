const { buildBot } = require('./BotBuilder');
const fs = require('fs');
const parser = require('./parser');
const contents = JSON.parse(fs.readFileSync('example/quiz/quiz.json', 'utf8'));
const SummaryState = require('./example/quiz/SummaryState');
const bot = buildBot(parser(contents, { summary: () => new SummaryState() }));


function sayToBot(message) {
    console.log('User:', message);
    console.log('Bot:', bot.message(message));
}


sayToBot('hi');
sayToBot('one');
sayToBot('two');
sayToBot('tree');
sayToBot('four');
sayToBot('ok');
sayToBot('hi');
sayToBot('one');
sayToBot('two');
sayToBot('three');
sayToBot('four');
