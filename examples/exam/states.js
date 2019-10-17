const { response, jumpToState, remember, endConversation } = require('../../actions');


function checkMemoryForAnswers(memory) {
    return Object.keys(memory)
        .filter(m => m[0] === 'q')
        .map(m => m.substr(1))
        .filter(m => !isNaN(m));
}


function buildScoreResponse(memory) {
    let correct = 0;
    let incorrect = 0;
    let responseMessage = '';

    for(const question of checkMemoryForAnswers(memory)) {
        (memory['q' + question])
            ? correct++
            : incorrect++;
    }

    if (incorrect === 0) {
        responseMessage = 'You achive 100% score, congratulation!';
    } else if (correct === 0) {
        responseMessage = 'Unfortunately, your score is 0%. Maybe next time?';
    } else {
        const percentage = (correct / (correct + incorrect) * 100).toFixed(2);
        responseMessage = `You score: ${percentage}% (${correct} correct out of ${correct + incorrect} all). `;
    }

    return response(responseMessage + ' Bot will restarted now');
}


class QuestionState {

    constructor(text, answer, current, last) {
        this.text = text;
        this.answer = answer;
        this.current = current;
        this.last = last;
        this.memoryLabel = `q${this.current}`;
    }

    *beforeMessage() {
        yield response(this.text);
    }

    *analyse(message) {
        const text = message.text;

        if (text === 'next') {
            yield* this.goToNext(message.memory);
        } else if (text === 'prev') {
            yield this.goToPrev(message.memory);
        } else {
            yield remember(this.memoryLabel, text === this.answer);             
            yield* this.goToNext(message.memory);
        }
    }

    *goToNext(memory) {
        for(var i = this.current + 1; i <= this.last; i++) {
            if (!memory.hasOwnProperty('q' + i)) {
                yield jumpToState('question_' + i);
                return;
            }
        }
        
        if (this.allQuestionsAreFilled(memory)) {
            yield buildScoreResponse(memory);
            yield jumpToState('finish_exam');
            return;
        }

        for(var i = 1; i <= this.current; i++) {
            if (!memory.hasOwnProperty('q' + i)) {
                yield jumpToState('question_' + i);
                return;
            }
        }

        throw new Error('Something is wrong, all question should are filled!');
    }

    goToPrev(memory) {
        for(var i = this.current - 1; i > 0; i--) {
            if (!memory.hasOwnProperty('q' + i)) {
                return jumpToState('question_' + i);
            }
        }

        return response('This is the first question, no previous is available');
    }

    allQuestionsAreFilled(memory) {
        return checkMemoryForAnswers(memory).length === this.last;
    }
}

class FinishExam {
    *beforeMessage() {
    }

    *analyse(message) {
        yield endConversation();
    }
}

module.exports.question = ({ text, answer, current, last }) => new QuestionState(text, answer, current, last);
module.exports.finishExam = ({}) => new FinishExam();
