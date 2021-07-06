const { buildBot, ParserBuilder } = require('@dplocki/generic-conversation-bot');

const states = new ParserBuilder()
    .addCustomStates(
        require('./exam/states')
    )
    .addPreParsers(
        require('./exam/preParsers')
    )
    .parse(
        require('./exam/exam.json')
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
