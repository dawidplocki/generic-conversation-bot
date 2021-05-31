const { buildBot } = require('../botBuilder');
const fs = require('fs');
const ParserBuild = require('../parserBuilder');
const states = new ParserBuild()
    .addCustomStates(
        require('./exam/states')
    )
    .addPreParsers(
        require('./exam/preParsers')
    )
    .parse(
        JSON.parse(fs.readFileSync('examples/exam/exam.json', 'utf8'))
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
