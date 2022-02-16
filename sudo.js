const fs = require('fs');
const { solve, display } = require('./solve.js');

const file = fs.readFileSync('./puzzles/hardest.txt');
for (const line of file.toString().split('\n')) {
  if (!line) continue;
  
  const result = solve(line);
  console.log(line);
  if (result) display(result);
  console.log('\n');
}
