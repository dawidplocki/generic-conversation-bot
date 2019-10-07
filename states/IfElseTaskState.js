const { response } = require('../actions');

class IfElseTaskState {
    constructor(text, answer, then, otherwise) {
        this.text = text;
        this.answer = answer.toLowerCase();
        this.then = then;
        this.otherwise = otherwise;
    }

    *beforeMessage() {
        yield response(this.text);
    }

    *analyse(message) {
        if (this.answer === message.text.toLowerCase()) {
            yield* this.then;
            return
        }

        yield* this.otherwise;
    }
}

module.exports = IfElseTaskState;
