const ChooseState = require('./states/chooseState');
const MoveNextState = require('./states/moveNextState');
const WaitForActivationState = require('./states/waitForActivationState');
const IfElseState = require('./states/ifElseState');


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
