const Simplifier = require('./Simplifier');
const Bot = require('./Bot');


module.exports.buildBot = function(stateMap) {
    return new Simplifier(new Bot(stateMap));
}
