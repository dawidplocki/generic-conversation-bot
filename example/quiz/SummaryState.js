const { endConversation } = require('../../actions');

class SummaryState {

    constructor() {
    }

    *beforeMessage() {
        yield (bot, message) => {
            const correctNumber = (message.memory.correct || 0);
            const questionNumber = correctNumber + (message.memory.incorrect || 0);

            bot.response =
                (questionNumber === correctNumber)
                ? 'You answer all question correctly!'
                : `Your score: ${correctNumber}/${questionNumber}.`;

            bot.response += ' I will restart now.';
        };
    }

    *analyse() {
        yield endConversation();
    }
}

module.exports = SummaryState;
