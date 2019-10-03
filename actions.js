function response(response) {
    return (bot, message) => {
        let result = response;

        if (message && message.memory) {
            result = Object
                .keys(message.memory)
                .reduce((whole, key) => whole.split('{' + key + '}').join(message.memory[key]), result);
        }

        bot.response = result;
    }
}


function rememberInteralMechanism(message, key, value) {
    if (!message.memory) {
        message.memory = {};
    }

    message.memory[key] = value;
}


module.exports.response = response;

module.exports.staySilence = function() {
    return response(null);
};

module.exports.setState = function(state) {
    return bot => bot.state = state;
};

module.exports.endConversation = function() {
    return bot => bot.reset();
};

module.exports.jumpToState = function(stateName) {
    return bot => bot.jumpToState(stateName);
};

module.exports.remember = function(key, value) {
    return (_, message) => rememberInteralMechanism(message, key, value);
};

module.exports.rememberInputAs = function(key, transformFunction = null) {
    const transform = transformFunction ? transformFunction : (m => m.text);
    
    return (_, message) => rememberInteralMechanism(message, key, transform(message));
};
