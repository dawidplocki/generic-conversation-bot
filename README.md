# Generic conversation bot

## Project description

A simple conversation bot with ability of reading the dialogue scripts from file.

## Examples

Both example bot can use `BitClient`. The function use the Node `readline` module for terminal usage.

### Simple

A linear conversation. The bot will ask about name and use it back. The example demonstrate the memory usage.

### Quiz

A linear conversation. The bot will ask few simple question and save the results showing the summary on the end.
The example demonstrate own additional (the `SummaryState` class) state.

## Tests

The unit test are based on [Mocha](https://mochajs.org/).

### Running

```bash
npm test
```
