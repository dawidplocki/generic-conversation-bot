const { endConversation } = require('../../actions');

class SummaryState {

    constructor() {
    }

    *beforeMessage() {
        yield (bot, message) => {
            const answers = Object.values(message.memory);
            const questionNumber = answers.length;
            const correctNumber = answers
                .filter(x => x == 'yes')
                .length;
                
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
