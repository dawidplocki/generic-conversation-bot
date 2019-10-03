const ChooseState = require('./states/ChooseState');
const MoveNextState = require('./states/MoveNextState');
const WaitForActivationState = require('./states/WaitForActivationState');
const SolveTaskState = require('./states/SolveTaskState');


module.exports.choose = function({ initText, replays }) {
    return new ChooseState(initText, replays);
};

module.exports.moveNext = function({ text, actions }) {
    return new MoveNextState(text, actions);
};

module.exports.waitForActivation = function({ activation, actions }) {
    return new WaitForActivationState(activation, actions);
};

module.exports.solveTask = function({ text, answer, correct, incorrect }) {
    return new SolveTaskState(text, answer, correct, incorrect);
};
