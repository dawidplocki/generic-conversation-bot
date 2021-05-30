const ChooseState = require('./states/ChooseState');
const MoveNextState = require('./states/MoveNextState');
const WaitForActivationState = require('./states/WaitForActivationState');
const IfElseState = require('./states/IfElseState');


exports.choose = function({ initText, replays }) {
    return new ChooseState(initText, replays);
};

exports.moveNext = function({ text, actions }) {
    return new MoveNextState(text, actions);
};

exports.waitForActivation = function({ activation, actions }) {
    return new WaitForActivationState(activation, actions);
};

exports.ifElse = function({ text, answer, then, otherwise }) {
    return new IfElseState(text, answer, then, otherwise);
};
