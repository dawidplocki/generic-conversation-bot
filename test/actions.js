const Assert = require('assert');
const actions = require('../actions');
const { response, rememberInputAs } = actions;


function assertMemoryResponse(response, key, expectedValue) {
    Assert.ok(response instanceof Object, "Incorrect response type");
    Assert.ok(response.memory instanceof Object, "Missing memory in the response");
    Assert.ok(response.memory.hasOwnProperty(key), "Memory has no requested key");
    Assert.strictEqual(response.memory[key], expectedValue, "Memorised value is incorrect");
}


describe('Action "Response"', function() {
    it('should be able to use memory', function() {
        // Assign
        const testKey = 'test_key';
        const testValue = 'test_value';
        const expectedValue = 'test_value test_key test_value test_value'
        const message = {
            memory: {
                [testKey]: testValue
            }
        };
        const spyBot = {
            response: null
        };

        // Act
        response(`{${testKey}} test_key {${testKey}} {${testKey}}`)(spyBot, message);

        // Assert
        Assert.strictEqual(spyBot.response, expectedValue, "Message should be filled with memorised value");
    });
});

describe('Action "rememberInputAs"', function() {
    it('should be able to store the input', function() {
        // Assign
        const testKey = 'test_key';
        const testValue = 'test_value';
        const message = {
            text: testValue,
            memory: {
                [testKey]: testValue
            }
        };
        const spyBot = {
            response: null
        };

        // Act
        rememberInputAs(testKey)(spyBot, message);

        // Assert
        assertMemoryResponse(message, testKey, testValue);
    });
});

[
    { action: 'increaseRemembered', expectedValueFrom1234: 1235, expectedValueFromUndefine: 1 },
    { action: 'decreaseRemembered', expectedValueFrom1234: 1233, expectedValueFromUndefine: -1 },
].forEach(function(test) {

    describe(`Action "${test.action}"`, function() {

        it('should change pointed value', function() {
            // Assign
            const testKey = 'test_key';
            const testValue = 1234;
            const message = {
                memory: {
                    [testKey]: testValue
                }
            };
            const spyBot = {
                response: null
            };

            // Act
            actions[test.action](testKey)(spyBot, message);

            // Assert
            assertMemoryResponse(message, testKey, test.expectedValueFrom1234);
        });

        it("should change pointed value even if it haven't exist before", function() {
            // Assign
            const testKey = 'test_key';
            const message = {};
            const spyBot = {
                response: null
            };

            // Act
            actions[test.action](testKey)(spyBot, message);

            // Assert
            assertMemoryResponse(message, testKey, test.expectedValueFromUndefine);
        });
    });
});

