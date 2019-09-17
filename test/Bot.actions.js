const Assert = require('assert');
const Bot = require('../Bot');
const { setState } = require('../actions');

it('should run all analyse actions', function() {
    let yieldCounter = 0;
    const expectedYieldCount = 10;
    const bot = new Bot({
        'start': {
            *beforeMessage() {
            },

            *analyse() {
                yield () => yieldCounter += 2;
                yield () => yieldCounter += 3;
                yield () => yieldCounter += 5;
            }
        }
    });

    bot.message('');

    Assert.strictEqual(yieldCounter, expectedYieldCount, `All actions after message should be called (result: ${yieldCounter}/${expectedYieldCount})`);
});

it('should run all analyse actions and beforeMessage actions', function() {
    let correctYieldCounter = 0;
    let incorrectYieldCounter = 0;

    const expectedYieldCount = 15;
    const bot = new Bot({
        'start': {
            *beforeMessage() {
                yield () => correctYieldCounter += 1;
            },

            *analyse() {
                yield () => correctYieldCounter += 2;
                yield () => correctYieldCounter += 4;
                yield setState({
                    *beforeMessage() {
                        yield () => correctYieldCounter += 8;
                    },

                    *analyse() {
                        yield () => incorrectYieldCounter++;
                    }
                });
            }
        }
    });

    bot.message('');

    Assert.strictEqual(incorrectYieldCounter, 0, `Some action has been called, but they should not (number: ${incorrectYieldCounter})`);
    Assert.strictEqual(correctYieldCounter, expectedYieldCount, `All actions after message should be called (result: ${correctYieldCounter}/${expectedYieldCount})`);
});
