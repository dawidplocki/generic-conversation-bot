const { buildBot } = require('./BotBuilder');
const fs = require('fs');
const parser = require('./parser');
const contents = JSON.parse(fs.readFileSync('conversation.json', 'utf8'));
const bot = buildBot(parser(contents));
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Bot has been loaded. Ctrl+C to quit');

rl.on('line', function (line) {
    var botReplay = bot.message(line);

    console.log(botReplay);
});
