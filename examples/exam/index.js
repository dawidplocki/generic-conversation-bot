const { buildBot } = require('../../index');
const fs = require('fs');
const ParserBuild = require('../../parser');
const client = require('../botClient');

const states = new ParserBuild()
    .addCustomStates(
        require('./states')
    )
    .addPreParsers(
        require('./preParsers')
    )
    .parse(
        JSON.parse(fs.readFileSync('exam.json', 'utf8'))
    );

const bot = buildBot(states);

console.log('This bot will be waiting for "hi"!');

client(bot);
