const fs = require('fs');
console.log(`${__dirname}/database/notFound.html`);
const NOT_FOUND = fs.readFileSync(
  `${__dirname}/database/notFound.html`,
  'utf8'
);
console.log(NOT_FOUND);
