const Simplifier = require('./simplifier');
const Bot = require('./bot');


exports.buildBot = function(stateMap) {
    return new Simplifier(new Bot(stateMap));
}
