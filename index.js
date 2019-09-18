const Bot = require('./Bot');
const fs = require('fs');
const parser = require('./parser');

const contents = JSON.parse(fs.readFileSync('conversation.json', 'utf8'));
const bot = new Bot(parser(contents));

console.log('Can use the bot.message("") method to test the loaded conversation.');
debugger;
