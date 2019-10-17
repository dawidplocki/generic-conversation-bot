# Generic conversation bot

## Project description

A simple conversation bot with ability of reading the dialogue scripts from  [JSON](https://en.wikipedia.org/wiki/JSON) files.

## Internal architecture

The bot (class `Bot`) is a state machine. The state contain the logic of reaction on received `message` (from user). The reaction is collection of `actions`. User input, provide also `memory` cache.

### State

State is an object. Each state need to implements two methods: `*beforeMessage()` and `*analyse(message)`.

Both return collection of actions (as [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Generator_functions)).
The `beforeMessage` is called when bot is change its internal state. The `analyse` method is called when Bot receive the new message.

```js
class State {
    *beforeMessage() {
    }

    *analyse(message) {
    }
}
```

#### States available by default

* ChooseState - Similar in work as `switch` code
* IfElse - Similar in work as `if else` code
* MoveNextState - Displays the given text, no matter the input will call all prived actions
* WaitForActivationState - The starting state, bot will ignore all input until given phrase (like: "hi") will be given

### Actions

Each action is function. The action is taking two parameters:

* `bot` - the Bot object
* `message` - the whole message object received by the Bot

The return value of action is ignored.

```js
function action(bot, message) {
}
```

For simplicity the the action builders are store in the `actions.js` file. Those are functions returning actions functions.

#### Actions available by default

* `response(text)` - Sets the response of Bot
* `staySilence()` - Removes all response
* `setState(state)` - Sets the given state as next one
* `endConversation()` - Resets the Bot
* `jumpToState(stateName)` - Sets the state from states list by its name
* `remember(key, value)` - Saves the value in `memory` on priveded `key`
* `rememberInputAs(key)` - Saves the input (user message, only text) in `memory` on priveded `key`
* `increaseRemembered(key)` - Increase the value from `memory` on `key` by one (if value is not numeric, will be replace by 1)
* `decreaseRemembered(key)` - Decrease the value from `memory` on `key` by one (if value is not numeric, will be replace by -1)

## Parser

The Bot state machine can be loaded from [JSON](https://en.wikipedia.org/wiki/JSON) file. The file needs to be parsed first.

The parser is provided by `ParserBuilder` object. You can create parser containing addintional states, actions or preparser actions.

```js
const states = new ParserBuilder()
    .addCustomActions(require('./actions'))
    .addCustomStates(require('./states'))
    .addPreParsers(require('./preParsers'));
    .parse(
        JSON.parse(fs.readFileSync('input.json', 'utf8'))
    );
```

### The input file

The json file containe an array of objects. Each of it need to have two atributes: `type` and `name`.

```json
[
    {
        "type": "type_of_state",
        "name": "name_of_state"
    }
]
```

The parsing proces transform the file into the object, where key is name of state.

### Preparser

The preparser are called before the parsing process, for given **pre-states**. To call them you need provide two atribute: `pre_parser` and `pre_states`.

```json
[
    {
        "pre_parser": "pre_parser_name",
        "pre_states": [
            { },
            { }
        ]
    }
]
```

The `pre_parser` value indicate which preparser needs to be called on given `pre_states`. The result: the collection of ready-to-parsing-states, will be input for parsing.

#### Example of preprocessor

```js
function preprocessor(state, index, allStates) {
    return state;
};
```

## Examples

Both example bot can use `BitClient`. The function use the Node `readline` module for terminal usage.

### Simple

A linear conversation. The bot will ask about name and use it back.

The example demonstrate the memory usage.

### Quiz

A linear conversation. The bot will ask few simple question and save the results showing the summary on the end.

The example demonstrate own additional (the `SummaryState` class) state.

### Exam

A nonlinear exam conversation. The bot will ask few simple question but user can skip and returning to them letter. Bot will summaries the result on end.

The example domestrate preparser.

## Tests

The unit test are based on [Mocha](https://mochajs.org/).

### Running

```bash
npm test
```
