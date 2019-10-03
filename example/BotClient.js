module.exports = function(bot) {
  const readline = require('readline');
  const client = readline.createInterface({
      input: process.stdin,
      output: process.stdout
  });
  
  console.log('Bot has been loaded. Ctrl+C to quit');
  
  client.on('line', function (line) {
      var botReplay = bot.message(line);
  
      console.log(botReplay);
  });
}
