module.exports.addQuestionCount = function(state, index, allStates) {
    state.current = index + 1;
    state.name = 'question_' + state.current;
    state.last = Object.keys(allStates).length;

    return state;
};