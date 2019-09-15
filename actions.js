function response(message) {
    return bot => bot.setResponse(message);
}

module.exports.response = response;

module.exports.staySilence = function() {
    return response(null);
}

module.exports.setState = function(state) {
    return bot => bot.setState(state);
}

module.exports.endOfConversation = function() {
    return bot => bot.setState(bot.initialState);
}
