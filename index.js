const { buildBot } = require('./BotBuilder');
const fs = require('fs');
const ParserBuild = require('./parser');
const states = new ParserBuild()
    .addCustomStates(
        require('./example/exam/states')
    )
    .addPreParsers(
        require('./example/exam/preParsers')
    )
    .parse(
        JSON.parse(fs.readFileSync('example/exam/exam.json', 'utf8'))
    );
const bot = buildBot(states);


function sayToBot(message) {
    console.log('User:', message);
    console.log('Bot:', bot.message(message));
}


sayToBot('hi');
sayToBot('one');

sayToBot('hi');
sayToBot('yes');
sayToBot('Native');
sayToBot('any');
sayToBot('next');
sayToBot('two');
sayToBot('three');
sayToBot('prev');
sayToBot('one');
sayToBot('four');
sayToBot('any');
