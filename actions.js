function response(message) {
    return bot => bot.response = message;
}

module.exports.response = response;

module.exports.staySilence = function() {
    return response(null);
}

module.exports.setState = function(state) {
    return bot => bot.state = state;
}

module.exports.endOfConversation = function() {
    return bot => bot.state = bot.initialState;
}

module.exports.jumpToState = function(stateName) {
    return bot => bot.jumpToState(stateName);
}
