const Simplifier = require('./simplifier');
const Bot = require('./bot');

module.exports = {
    Bot: require('./bot'),
    buildBot: (stateMap) => new Simplifier(new Bot(stateMap)),
    ParserBuilder: require('./parserBuilder'),
    Simplifier: require('./simplifier')
}