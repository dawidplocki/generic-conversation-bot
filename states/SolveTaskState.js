const { response } = require('../actions');

class SolveTaskState {
    constructor(text, answer, correct, incorrect) {
        this.text = text;
        this.answer = answer;
        this.correct = correct;
        this.incorrect = incorrect;
    }

    *beforeMessage() {
        yield response(this.text);
    }

    *analyse(message) {
        if (this.answer === message) {
            yield* this.correct;
            return
        }

        yield* this.incorrect;
    }
}

module.exports = SolveTaskState;
